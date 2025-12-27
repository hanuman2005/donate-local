// backend/models/Schedule.js - NEW MODEL
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Proposed schedule
    proposedDate: {
      type: Date,
      required: true,
    },
    proposedTime: {
      type: String, // Format: "14:30" (24-hour)
      required: true,
    },
    proposedDateTime: {
      type: Date, // Combined date + time
      required: true,
      index: true,
    },

    // Status tracking
    status: {
      type: String,
      enum: ["proposed", "confirmed", "completed", "cancelled", "expired"],
      default: "proposed",
      index: true,
    },

    // Confirmation
    confirmedAt: Date,
    confirmationNotes: {
      type: String,
      maxlength: 500,
    },

    // Completion
    completedAt: Date,

    // Cancellation
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: {
      type: String,
      maxlength: 500,
    },

    // Reminders
    remindersSent: {
      type: Number,
      default: 0,
    },
    lastReminderAt: Date,

    // Location (optional)
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
    },
    pickupAddress: String,

    // Pickup Tracking
    pickupStatus: {
      type: String,
      enum: ["pending", "en_route", "arriving", "arrived", "completed"],
      default: "pending",
    },
    driverLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
    },
    pickupStartedAt: Date,
    lastLocationUpdate: Date,

    // Recurring schedule support
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "biweekly", "monthly", null],
      default: null,
    },
    parentSchedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },

    // Additional notes
    donorNotes: {
      type: String,
      maxlength: 500,
    },
    recipientNotes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
scheduleSchema.index({ donor: 1, status: 1 });
scheduleSchema.index({ recipient: 1, status: 1 });
scheduleSchema.index({ proposedDateTime: 1, status: 1 });

// Virtual: Check if expired
scheduleSchema.virtual("isExpired").get(function () {
  return this.status === "proposed" && new Date() > this.proposedDateTime;
});

// Virtual: Time until pickup
scheduleSchema.virtual("timeUntilPickup").get(function () {
  if (this.status !== "confirmed") return null;
  const now = new Date();
  const diff = this.proposedDateTime - now;
  return diff > 0 ? diff : 0; // milliseconds
});

// Virtual: Needs reminder (24 hours before)
scheduleSchema.virtual("needsReminder").get(function () {
  if (this.status !== "confirmed") return false;
  const now = new Date();
  const reminderTime = new Date(
    this.proposedDateTime.getTime() - 24 * 60 * 60 * 1000
  );
  return now >= reminderTime && this.remindersSent < 3;
});

// Method: Confirm schedule
scheduleSchema.methods.confirm = async function (notes = "") {
  this.status = "confirmed";
  this.confirmedAt = new Date();
  this.confirmationNotes = notes;
  await this.save();
  return this;
};

// Method: Complete schedule
scheduleSchema.methods.complete = async function () {
  this.status = "completed";
  this.completedAt = new Date();
  await this.save();
  return this;
};

// Method: Cancel schedule
scheduleSchema.methods.cancel = async function (userId, reason = "") {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  await this.save();
  return this;
};

// Method: Mark as expired
scheduleSchema.methods.expire = async function () {
  this.status = "expired";
  await this.save();
  return this;
};

// Method: Send reminder
scheduleSchema.methods.sendReminder = async function () {
  this.remindersSent += 1;
  this.lastReminderAt = new Date();
  await this.save();
  return this;
};

// Static: Find schedules needing reminders
scheduleSchema.statics.findNeedingReminders = async function () {
  const now = new Date();
  const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return this.find({
    status: "confirmed",
    proposedDateTime: { $lte: reminderWindow },
    remindersSent: { $lt: 3 },
    $or: [
      { lastReminderAt: { $exists: false } },
      { lastReminderAt: { $lt: new Date(now.getTime() - 6 * 60 * 60 * 1000) } }, // 6 hours ago
    ],
  })
    .populate("donor", "firstName lastName email")
    .populate("recipient", "firstName lastName email")
    .populate("listing", "title");
};

// Static: Find expired schedules
scheduleSchema.statics.findExpired = async function () {
  const now = new Date();
  return this.find({
    status: "proposed",
    proposedDateTime: { $lt: now },
  });
};

// Static: Get upcoming schedules for user
scheduleSchema.statics.getUpcomingForUser = async function (userId) {
  const now = new Date();
  return this.find({
    $or: [{ donor: userId }, { recipient: userId }],
    status: { $in: ["proposed", "confirmed"] },
    proposedDateTime: { $gte: now },
  })
    .populate("listing", "title images category")
    .populate("donor", "firstName lastName avatar")
    .populate("recipient", "firstName lastName avatar")
    .sort({ proposedDateTime: 1 });
};

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
