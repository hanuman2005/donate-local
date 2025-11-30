// backend/controllers/reportController.js - NEW FILE
const Report = require('../models/Report');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * @route   POST /api/reports/listing/:id
 * @desc    Report a listing
 * @access  Private
 */
const reportListing = async (req, res) => {
  try {
    const { id: listingId } = req.params;
    const { reason, message, additionalInfo } = req.body;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check if already flagged
    if (listing.isFlagged) {
      return res.status(400).json({
        success: false,
        message: 'This listing is already under review',
      });
    }

    // Check if user already reported this listing
    const hasReported = await Report.hasUserReported(req.user._id, 'listing', listingId);
    if (hasReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this listing',
      });
    }

    // Create report
    const report = new Report({
      reportType: 'listing',
      listing: listingId,
      reportedBy: req.user._id,
      reason,
      message,
      additionalInfo,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      priority: reason === 'fraud' || reason === 'unsafe_item' ? 'high' : 'medium',
    });

    await report.save();

    // Increment report count on listing
    await listing.incrementReportCount();

    // Notify admin (if admin notification system exists)
    console.log(`⚠️ New report: ${reason} for listing ${listingId}`);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our team will review it shortly.',
      report: {
        _id: report._id,
        reason: report.reason,
        status: report.status,
      },
    });
  } catch (error) {
    console.error('Report listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/reports/user/:id
 * @desc    Report a user
 * @access  Private
 */
const reportUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { reason, message, additionalInfo } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Can't report yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot report yourself',
      });
    }

    // Check if already reported
    const hasReported = await Report.hasUserReported(req.user._id, 'user', userId);
    if (hasReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this user',
      });
    }

    // Create report
    const report = new Report({
      reportType: 'user',
      user: userId,
      reportedBy: req.user._id,
      reason,
      message,
      additionalInfo,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      priority: reason === 'fraud' || reason === 'harassment' ? 'high' : 'medium',
    });

    await report.save();

    // Increment report count on user
    user.reportedCount += 1;
    
    // Auto-suspend after 3 reports
    if (user.reportedCount >= 3 && !user.isSuspended) {
      await user.suspend('Multiple reports received', 7); // 7 days
    }
    
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User report submitted successfully',
      report: {
        _id: report._id,
        reason: report.reason,
        status: report.status,
      },
    });
  } catch (error) {
    console.error('Report user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/reports/my-reports
 * @desc    Get user's submitted reports
 * @access  Private
 */
const getMyReports = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find({ reportedBy: req.user._id })
      .populate('listing', 'title images category')
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments({ reportedBy: req.user._id });

    res.json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
    });
  }
};

/**
 * @route   GET /api/reports/admin/pending
 * @desc    Get pending reports (admin only)
 * @access  Private (Admin)
 */
const getPendingReports = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find({ status: 'pending' })
      .populate('reportedBy', 'firstName lastName email')
      .populate('listing', 'title images category donor')
      .populate('user', 'firstName lastName email')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get pending reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
    });
  }
};

/**
 * @route   PUT /api/reports/:id/resolve
 * @desc    Resolve a report (admin only)
 * @access  Private (Admin)
 */
const resolveReport = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const { id: reportId } = req.params;
    const { resolution, adminNotes } = req.body;

    const report = await Report.findById(reportId)
      .populate('listing')
      .populate('user');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    await report.resolve(req.user._id, resolution, adminNotes);

    // Take action based on resolution
    if (resolution === 'content_removed' && report.listing) {
      await report.listing.flagListing('Removed by admin due to report');
    }

    if (resolution === 'account_suspended' && report.user) {
      await report.user.suspend('Admin action: Multiple violations', 30);
    }

    res.json({
      success: true,
      message: 'Report resolved successfully',
      report,
    });
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve report',
    });
  }
};

module.exports = {
  reportListing,
  reportUser,
  getMyReports,
  getPendingReports,
  resolveReport,
};