const cron = require('node-cron');
const Listing = require('../models/Listing');
const notificationHelper = require('./notificationHelper');

// Run every hour
const checkExpiredQueueAssignments = cron.schedule('0 * * * *', async () => {
  try {
    console.log('🔍 Checking for expired queue assignments...');

    const listings = await Listing.find({
      status: 'pending',
      'queue.status': 'notified',
      'queue.expiresAt': { $lt: new Date() }
    });

    for (const listing of listings) {
      const expiredEntry = listing.queue.find(
        q => q.status === 'notified' && q.expiresAt < new Date()
      );

      if (expiredEntry) {
        console.log(`⏰ Assignment expired for listing ${listing._id}`);

        // Remove from queue
        await listing.removeFromQueue(expiredEntry.user);

        // Assign to next person
        const nextUser = await listing.assignToNextInQueue();

        if (nextUser) {
          await notificationHelper.notifyAssignedFromQueue(listing, nextUser);
        } else {
          // No one left, make available
          listing.assignedTo = null;
          listing.status = 'available';
          await listing.save();
        }

        // Notify expired user
        await notificationHelper.create({
          recipient: expiredEntry.user,
          type: 'queue_expired',
          title: '⏰ Assignment Expired',
          message: `Your 24-hour window for "${listing.title}" has expired`,
          listing: listing._id
        });
      }
    }

    console.log('✅ Queue expiry check complete');
  } catch (error) {
    console.error('❌ Error in queue cron job:', error);
  }
});

module.exports = checkExpiredQueueAssignments;