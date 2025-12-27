// backend/utils/scheduleCron.js - NEW FILE
const cron = require("node-cron");
const Schedule = require("../models/Schedule");
const Listing = require("../models/Listing");
const User = require("../models/User");
const notificationHelper = require("./notificationHelper");
const smsService = require("../services/smsService");

/**
 * Initialize schedule automation cron jobs
 */
const initScheduleCronJobs = (io) => {
  console.log("🕐 Initializing schedule cron jobs...");

  // Run every hour
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Running schedule automation...");

    try {
      // 1. Send reminders for upcoming pickups
      await sendUpcomingReminders(io);

      // 2. Mark expired schedules
      await markExpiredSchedules(io);

      console.log("✅ Schedule automation completed");
    } catch (error) {
      console.error("❌ Schedule automation error:", error);
    }
  });

  console.log("✅ Schedule cron jobs initialized");
};

/**
 * Send reminders for schedules within 24 hours
 */
const sendUpcomingReminders = async (io) => {
  try {
    const schedules = await Schedule.findNeedingReminders();

    console.log(`📬 Found ${schedules.length} schedules needing reminders`);

    for (const schedule of schedules) {
      try {
        // Send app notification
        await notificationHelper.sendScheduleReminder(schedule, io);

        // Send SMS reminders if enabled
        try {
          await sendSMSReminders(schedule);
        } catch (smsError) {
          console.warn(
            `⚠️ SMS reminder failed for schedule ${schedule._id}:`,
            smsError.message
          );
        }

        console.log(`✅ Reminder sent for schedule ${schedule._id}`);
      } catch (error) {
        console.error(
          `❌ Failed to send reminder for schedule ${schedule._id}:`,
          error
        );
      }
    }

    return schedules.length;
  } catch (error) {
    console.error("sendUpcomingReminders error:", error);
    throw error;
  }
};

/**
 * Send SMS reminders if users have SMS enabled
 */
const sendSMSReminders = async (schedule) => {
  // Get donor and recipient with their SMS preferences
  const donor = await User.findById(schedule.donor).select(
    "phone phoneVerified smsPreferences"
  );
  const recipient = await User.findById(schedule.recipient).select(
    "phone phoneVerified smsPreferences"
  );

  // Calculate hours until pickup
  const hoursUntil = Math.round(
    (new Date(schedule.scheduledDate) - new Date()) / (1000 * 60 * 60)
  );

  const scheduleInfo = {
    listingTitle: schedule.listing?.title || "Donation Item",
    pickupLocation: schedule.pickupLocation || "See app for details",
    scheduledDate: schedule.scheduledDate,
  };

  const promises = [];

  // Send SMS to donor if enabled
  if (
    donor?.phone &&
    donor?.phoneVerified &&
    donor?.smsPreferences?.enabled &&
    donor?.smsPreferences?.pickupReminders
  ) {
    promises.push(
      smsService.sendPickupReminder(scheduleInfo, donor.phone, hoursUntil)
    );
  }

  // Send SMS to recipient if enabled
  if (
    recipient?.phone &&
    recipient?.phoneVerified &&
    recipient?.smsPreferences?.enabled &&
    recipient?.smsPreferences?.pickupReminders
  ) {
    promises.push(
      smsService.sendPickupReminder(scheduleInfo, recipient.phone, hoursUntil)
    );
  }

  if (promises.length > 0) {
    await Promise.allSettled(promises);
    console.log(`📱 SMS reminders sent for schedule ${schedule._id}`);
  }
};

/**
 * Mark expired schedules (proposed but not confirmed)
 */
const markExpiredSchedules = async (io) => {
  try {
    const expiredSchedules = await Schedule.findExpired();

    console.log(`⏰ Found ${expiredSchedules.length} expired schedules`);

    for (const schedule of expiredSchedules) {
      try {
        await schedule.expire();

        // Update listing
        const listing = await Listing.findById(schedule.listing);
        if (listing) {
          await listing.updateScheduleStatus("expired");
          listing.status = "available";
          listing.assignedTo = null;
          await listing.save();
        }

        // Populate for notification
        await schedule.populate([
          { path: "donor", select: "firstName lastName email" },
          { path: "recipient", select: "firstName lastName email" },
          { path: "listing", select: "title" },
        ]);

        // Notify both parties
        await notificationHelper.onScheduleExpired(schedule, io);

        console.log(`✅ Marked schedule ${schedule._id} as expired`);
      } catch (error) {
        console.error(`❌ Failed to expire schedule ${schedule._id}:`, error);
      }
    }

    return expiredSchedules.length;
  } catch (error) {
    console.error("markExpiredSchedules error:", error);
    throw error;
  }
};

/**
 * Manual trigger for testing
 */
const runScheduleAutomationNow = async (io) => {
  console.log("🚀 Running schedule automation manually...");

  const reminderCount = await sendUpcomingReminders(io);
  const expiredCount = await markExpiredSchedules(io);

  return {
    remindersSent: reminderCount,
    schedulesExpired: expiredCount,
  };
};

module.exports = {
  initScheduleCronJobs,
  sendUpcomingReminders,
  markExpiredSchedules,
  runScheduleAutomationNow,
};
