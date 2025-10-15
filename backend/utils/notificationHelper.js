// backend/utils/notificationHelper.js - FIXED

const { createNotification } = require("../controllers/notificationController");

const notificationHelper = {
  // When someone expresses interest
  async onInterestExpressed(listing, interestedUser, io) {
    try {
      const notification = await createNotification({
        recipient: listing.donor,
        sender: interestedUser._id,
        type: "interest",
        title: "New Interest in Your Listing",
        message: `${interestedUser.firstName} ${interestedUser.lastName} is interested in "${listing.title}"`,
        relatedListing: listing._id,
        actionUrl: `/listings/${listing._id}`,
      });

      // ✅ Populate sender for real-time emission
      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");
      }

      // ✅ Emit real-time notification via socket
      if (io && notification) {
        io.to(listing.donor.toString()).emit("newNotification", notification);
        console.log(`🔔 Interest notification sent to donor ${listing.donor}`);
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onInterestExpressed:", error);
    }
  },

  // When listing is assigned
  async onListingAssigned(listing, recipient, io) {
    try {
      const notification = await createNotification({
        recipient: recipient._id,
        sender: listing.donor,
        type: "assignment",
        title: "Listing Assigned to You",
        message: `You have been assigned "${listing.title}". Please coordinate pickup!`,
        relatedListing: listing._id,
        actionUrl: `/listings/${listing._id}`,
      });

      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");
      }

      if (io && notification) {
        io.to(recipient._id.toString()).emit("newNotification", notification);
        console.log(`🔔 Assignment notification sent to ${recipient._id}`);
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onListingAssigned:", error);
    }
  },

  // When user receives a rating
  async onRatingReceived(rating, ratedUser, rater, io) {
    try {
      const notification = await createNotification({
        recipient: ratedUser._id,
        sender: rater._id,
        type: "rating",
        title: "You Received a New Rating",
        message: `${rater.firstName} ${rater.lastName} rated you ${rating.rating} stars`,
        actionUrl: `/profile`,
      });

      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");
      }

      if (io && notification) {
        io.to(ratedUser._id.toString()).emit("newNotification", notification);
        console.log(`🔔 Rating notification sent to ${ratedUser._id}`);
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onRatingReceived:", error);
    }
  },

  // When listing is completed
  async onListingCompleted(listing, recipient, io) {
    try {
      const notification = await createNotification({
        recipient: recipient._id,
        sender: listing.donor,
        type: "completion",
        title: "Donation Completed",
        message: `The donation "${listing.title}" has been marked as completed. Please rate your experience!`,
        relatedListing: listing._id,
        actionUrl: `/listings/${listing._id}`,
      });

      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");
      }

      if (io && notification) {
        io.to(recipient._id.toString()).emit("newNotification", notification);
        console.log(`🔔 Completion notification sent to ${recipient._id}`);
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onListingCompleted:", error);
    }
  },
};

module.exports = notificationHelper;
