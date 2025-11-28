// backend/controllers/scheduleController.js - NEW FILE
const Schedule = require('../models/Schedule');
const Listing = require('../models/Listing');
const notificationHelper = require('../utils/notificationHelper');

/**
 * @route   POST /api/listings/:id/schedule
 * @desc    Propose a pickup schedule
 * @access  Private (Donor only)
 */
const proposeSchedule = async (req, res) => {
  try {
    const { id: listingId } = req.params;
    const { 
      recipientId, 
      date, 
      time, 
      pickupLocation,
      pickupAddress,
      donorNotes 
    } = req.body;

    // Validate listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check if user is donor
    if (listing.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the donor can propose a schedule',
      });
    }

    // Check if listing is available
    if (listing.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Listing is not available for scheduling',
      });
    }

    // Validate recipient
    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient is required',
      });
    }

    // Combine date and time
    const proposedDate = new Date(date);
    const [hours, minutes] = time.split(':');
    proposedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if date is in the future
    if (proposedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date must be in the future',
      });
    }

    // Create schedule
    const schedule = new Schedule({
      listing: listingId,
      donor: req.user._id,
      recipient: recipientId,
      proposedDate: new Date(date),
      proposedTime: time,
      proposedDateTime: proposedDate,
      pickupLocation,
      pickupAddress,
      donorNotes,
      status: 'proposed',
    });

    await schedule.save();

    // Update listing
    listing.assignedTo = recipientId;
    listing.status = 'pending';
    await listing.linkSchedule(schedule._id);

    // Populate for response
    await schedule.populate([
      { path: 'donor', select: 'firstName lastName avatar' },
      { path: 'recipient', select: 'firstName lastName avatar email' },
      { path: 'listing', select: 'title images category' },
    ]);

    // 🔔 Notify recipient
    try {
      await notificationHelper.onScheduleProposed(schedule, req.io);
    } catch (notifError) {
      console.error('⚠️ Notification error:', notifError);
    }

    res.status(201).json({
      success: true,
      message: 'Pickup schedule proposed successfully',
      schedule,
    });
  } catch (error) {
    console.error('Propose schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error proposing schedule',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/schedules/:id/confirm
 * @desc    Confirm a proposed schedule
 * @access  Private (Recipient only)
 */
const confirmSchedule = async (req, res) => {
  try {
    const { id: scheduleId } = req.params;
    const { confirmationNotes } = req.body;

    const schedule = await Schedule.findById(scheduleId)
      .populate('donor', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .populate('listing', 'title');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Check if user is recipient
    if (schedule.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can confirm this schedule',
      });
    }

    // Check status
    if (schedule.status !== 'proposed') {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm schedule with status: ${schedule.status}`,
      });
    }

    // Check if expired
    if (schedule.proposedDateTime <= new Date()) {
      await schedule.expire();
      return res.status(400).json({
        success: false,
        message: 'Schedule has expired',
      });
    }

    // Confirm schedule
    await schedule.confirm(confirmationNotes);

    // Update listing
    const listing = await Listing.findById(schedule.listing);
    if (listing) {
      await listing.updateScheduleStatus('confirmed');
    }

    // 🔔 Notify donor
    try {
      await notificationHelper.onScheduleConfirmed(schedule, req.io);
    } catch (notifError) {
      console.error('⚠️ Notification error:', notifError);
    }

    res.json({
      success: true,
      message: 'Schedule confirmed successfully',
      schedule,
    });
  } catch (error) {
    console.error('Confirm schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error confirming schedule',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/schedules/:id/cancel
 * @desc    Cancel a schedule
 * @access  Private (Donor or Recipient)
 */
const cancelSchedule = async (req, res) => {
  try {
    const { id: scheduleId } = req.params;
    const { cancellationReason } = req.body;

    const schedule = await Schedule.findById(scheduleId)
      .populate('donor', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .populate('listing', 'title');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Check if user is donor or recipient
    const isDonor = schedule.donor._id.toString() === req.user._id.toString();
    const isRecipient = schedule.recipient._id.toString() === req.user._id.toString();

    if (!isDonor && !isRecipient) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this schedule',
      });
    }

    // Check status
    if (!['proposed', 'confirmed'].includes(schedule.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel schedule with status: ${schedule.status}`,
      });
    }

    // Cancel schedule
    await schedule.cancel(req.user._id, cancellationReason);

    // Update listing
    const listing = await Listing.findById(schedule.listing);
    if (listing) {
      await listing.updateScheduleStatus('cancelled');
      listing.status = 'available';
      listing.assignedTo = null;
      await listing.save();
    }

    // 🔔 Notify other party
    try {
      const otherParty = isDonor ? schedule.recipient : schedule.donor;
      await notificationHelper.onScheduleCancelled(schedule, otherParty, req.io);
    } catch (notifError) {
      console.error('⚠️ Notification error:', notifError);
    }

    res.json({
      success: true,
      message: 'Schedule cancelled successfully',
      schedule,
    });
  } catch (error) {
    console.error('Cancel schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling schedule',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/schedules/:id/complete
 * @desc    Mark schedule as completed
 * @access  Private (Donor only)
 */
const completeSchedule = async (req, res) => {
  try {
    const { id: scheduleId } = req.params;

    const schedule = await Schedule.findById(scheduleId)
      .populate('donor', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('listing', 'title');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Check if user is donor
    if (schedule.donor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the donor can mark schedule as completed',
      });
    }

    // Check status
    if (schedule.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed schedules can be completed',
      });
    }

    // Complete schedule
    await schedule.complete();

    // Update listing
    const listing = await Listing.findById(schedule.listing);
    if (listing) {
      await listing.updateScheduleStatus('completed');
    }

    // 🔔 Notify recipient
    try {
      await notificationHelper.onScheduleCompleted(schedule, req.io);
    } catch (notifError) {
      console.error('⚠️ Notification error:', notifError);
    }

    res.json({
      success: true,
      message: 'Schedule completed successfully',
      schedule,
    });
  } catch (error) {
    console.error('Complete schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing schedule',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/schedules/my-schedules
 * @desc    Get user's schedules
 * @access  Private
 */
const getMySchedules = async (req, res) => {
  try {
    const { status, role } = req.query; // role: 'donor' or 'recipient'
    const userId = req.user._id;

    let query = {
      $or: [{ donor: userId }, { recipient: userId }],
    };

    if (status) {
      query.status = status;
    }

    if (role === 'donor') {
      query = { donor: userId, ...(status && { status }) };
    } else if (role === 'recipient') {
      query = { recipient: userId, ...(status && { status }) };
    }

    const schedules = await Schedule.find(query)
      .populate('donor', 'firstName lastName avatar')
      .populate('recipient', 'firstName lastName avatar')
      .populate('listing', 'title images category status')
      .sort({ proposedDateTime: -1 });

    res.json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching schedules',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/schedules/upcoming
 * @desc    Get upcoming schedules
 * @access  Private
 */
const getUpcomingSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.getUpcomingForUser(req.user._id);

    res.json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    console.error('Get upcoming schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching upcoming schedules',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/schedules/:id
 * @desc    Get single schedule details
 * @access  Private
 */
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('donor', 'firstName lastName avatar phone email')
      .populate('recipient', 'firstName lastName avatar phone email')
      .populate('listing', 'title images category pickupLocation');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Check access
    const isDonor = schedule.donor._id.toString() === req.user._id.toString();
    const isRecipient = schedule.recipient._id.toString() === req.user._id.toString();

    if (!isDonor && !isRecipient && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching schedule',
      error: error.message,
    });
  }
};

module.exports = {
  proposeSchedule,
  confirmSchedule,
  cancelSchedule,
  completeSchedule,
  getMySchedules,
  getUpcomingSchedules,
  getScheduleById,
};