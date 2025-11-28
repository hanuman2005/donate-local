// backend/utils/scheduleCron.js - NEW FILE
const cron = require('node-cron');
const Schedule = require('../models/Schedule');
const Listing = require('../models/Listing');
const notificationHelper = require('./notificationHelper');

/**
 * Initialize schedule automation cron jobs
 */
const initScheduleCronJobs = (io) => {
  console.log('🕐 Initializing schedule cron jobs...');

  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running schedule automation...');
    
    try {
      // 1. Send reminders for upcoming pickups
      await sendUpcomingReminders(io);
      
      // 2. Mark expired schedules
      await markExpiredSchedules(io);
      
      console.log('✅ Schedule automation completed');
    } catch (error) {
      console.error('❌ Schedule automation error:', error);
    }
  });

  console.log('✅ Schedule cron jobs initialized');
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
        await notificationHelper.sendScheduleReminder(schedule, io);
        console.log(`✅ Reminder sent for schedule ${schedule._id}`);
      } catch (error) {
        console.error(`❌ Failed to send reminder for schedule ${schedule._id}:`, error);
      }
    }
    
    return schedules.length;
  } catch (error) {
    console.error('sendUpcomingReminders error:', error);
    throw error;
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
          await listing.updateScheduleStatus('expired');
          listing.status = 'available';
          listing.assignedTo = null;
          await listing.save();
        }
        
        // Populate for notification
        await schedule.populate([
          { path: 'donor', select: 'firstName lastName email' },
          { path: 'recipient', select: 'firstName lastName email' },
          { path: 'listing', select: 'title' },
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
    console.error('markExpiredSchedules error:', error);
    throw error;
  }
};

/**
 * Manual trigger for testing
 */
const runScheduleAutomationNow = async (io) => {
  console.log('🚀 Running schedule automation manually...');
  
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
