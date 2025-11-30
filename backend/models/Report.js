// backend/models/Report.js - NEW MODEL
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    // What is being reported
    reportType: {
      type: String,
      enum: ['listing', 'user', 'review'],
      required: true,
      index: true,
    },

    // Target references
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Who reported
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Report details
    reason: {
      type: String,
      enum: [
        'spam',
        'fraud',
        'inappropriate_content',
        'misleading_information',
        'unsafe_item',
        'harassment',
        'fake_listing',
        'other',
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
      maxlength: 500,
    },

    // Additional evidence
    screenshots: [String], // URLs to uploaded images
    additionalInfo: {
      type: String,
      maxlength: 1000,
    },

    // Status tracking
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },

    // Admin review
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    adminNotes: String,
    resolution: {
      type: String,
      enum: ['warning_sent', 'content_removed', 'account_suspended', 'no_action', 'other'],
    },

    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },

    // Tracking
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ listing: 1, status: 1 });
reportSchema.index({ user: 1, status: 1 });
reportSchema.index({ reportedBy: 1, createdAt: -1 });
reportSchema.index({ status: 1, priority: -1 });

// Method to mark as resolved
reportSchema.methods.resolve = async function (adminId, resolution, notes) {
  this.status = 'resolved';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.resolution = resolution;
  this.adminNotes = notes;
  await this.save();
  return this;
};

// Method to dismiss
reportSchema.methods.dismiss = async function (adminId, reason) {
  this.status = 'dismissed';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = reason;
  await this.save();
  return this;
};

// Static: Get report count for an entity
reportSchema.statics.getReportCount = async function (entityType, entityId, status = 'pending') {
  const query = { reportType: entityType, status };
  
  if (entityType === 'listing') query.listing = entityId;
  else if (entityType === 'user') query.user = entityId;
  
  return this.countDocuments(query);
};

// Static: Check if user already reported this entity
reportSchema.statics.hasUserReported = async function (userId, entityType, entityId) {
  const query = { reportedBy: userId, reportType: entityType };
  
  if (entityType === 'listing') query.listing = entityId;
  else if (entityType === 'user') query.user = entityId;
  
  const report = await this.findOne(query);
  return !!report;
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;