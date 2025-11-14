const Listing = require("../models/Listing");
const notificationHelper = require("../utils/notificationHelper");

// Join queue
exports.joinQueue = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if listing is available for queue
    if (listing.status === "available") {
      return res.status(400).json({
        success: false,
        message: "Listing is still available. Claim it directly!",
      });
    }

    if (listing.status === "completed" || listing.status === "expired") {
      return res.status(400).json({
        success: false,
        message: "Listing is no longer available",
      });
    }

    // Check if user is the owner
    if (listing.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot join queue for your own listing",
      });
    }

    // Check if user is already assigned
    if (
      listing.assignedTo &&
      listing.assignedTo.toString() === req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You are already assigned to this listing",
      });
    }

    // Add user to queue
    const position = await listing.addToQueue(req.user._id);

    // Notify donor (use notificationHelper now)
    await notificationHelper.onQueueJoined(listing, req.user, position, req.io);

    res.json({
      success: true,
      message: `Added to queue at position ${position}`,
      position,
      queueLength: listing.queue.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Leave queue
exports.leaveQueue = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    await listing.removeFromQueue(req.user._id);

    res.json({
      success: true,
      message: "Removed from queue",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get queue status
exports.getQueueStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "queue.user",
      "firstName lastName avatar"
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check user's position
    const userInQueue = listing.queue.find(
      (q) => q.user._id.toString() === req.user._id.toString()
    );

    res.json({
      success: true,
      queue: listing.queue,
      userPosition: userInQueue ? userInQueue.position : null,
      queueLength: listing.queue.length,
      queueLimit: listing.queueLimit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel assignment (donor action)
exports.cancelAssignment = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if user is donor
    if (listing.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only donor can cancel assignment",
      });
    }

    const previousAssignee = listing.assignedTo;

    // Assign to next in queue
    const nextUser = await listing.assignToNextInQueue();

    if (nextUser) {
      // Notify next person
      await notificationHelper.onQueueAssigned(
        listing,
        { _id: nextUser },
        req.io
      );

      res.json({
        success: true,
        message: "Assigned to next person in queue",
        nextUser,
      });
    } else {
      // No one in queue, make available
      listing.assignedTo = null;
      listing.status = "available";
      await listing.save();

      res.json({
        success: true,
        message: "Listing is now available again",
      });
    }

    // Notify previous assignee if any
    if (previousAssignee) {
      await notificationHelper.onQueueAssignmentCancelled(
        listing,
        { _id: previousAssignee },
        req.io
      );
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = exports;
