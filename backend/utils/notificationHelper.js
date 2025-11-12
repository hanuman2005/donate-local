// backend/utils/notificationHelper.js - COMPLETE FILE
const Notification = require("../models/Notification");
const { createNotification } = require("../controllers/notificationController");

const notificationHelper = {
  /**
   * When someone expresses interest in a listing
   */
  async onInterestExpressed(listing, interestedUser, io) {
    try {
      const notification = await createNotification({
        recipient: listing.donor,
        sender: interestedUser._id,
        type: "interest",
        title: "👋 New Interest in Your Listing",
        message: `${interestedUser.firstName} ${interestedUser.lastName} is interested in "${listing.title}"`,
        icon: "👋",
        relatedListing: listing._id,
        actionUrl: `/listings/${listing._id}`,
        priority: "normal",
      });

      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");

        if (io) {
          io.to(listing.donor.toString()).emit("newNotification", notification);
          console.log(
            `🔔 Interest notification sent to donor ${listing.donor}`
          );
        }
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onInterestExpressed:", error);
      return null;
    }
  },

  /**
   * When a listing is assigned to a recipient
   */
  async onListingAssigned(listing, recipient, io) {
    try {
      const notification = await createNotification({
        recipient: recipient._id,
        sender: listing.donor,
        type: "assignment",
        title: "🎉 Listing Assigned to You!",
        message: `You have been assigned "${listing.title}". Please coordinate pickup!`,
        icon: "🎉",
        relatedListing: listing._id,
        actionUrl: `/listings/${listing._id}`,
        priority: "high",
      });

      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");

        if (io) {
          io.to(recipient._id.toString()).emit("newNotification", notification);
          console.log(`🔔 Assignment notification sent to ${recipient._id}`);
        }
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onListingAssigned:", error);
      return null;
    }
  },

  /**
   * When a user receives a rating
   */
  async onRatingReceived(rating, ratedUser, rater, io) {
    try {
      const notification = await createNotification({
        recipient: ratedUser._id,
        sender: rater._id,
        type: "rating",
        title: "⭐ You Received a New Rating",
        message: `${rater.firstName} ${rater.lastName} rated you ${rating.rating} stars`,
        icon: "⭐",
        actionUrl: `/profile`,
        priority: "normal",
        metadata: { rating: rating.rating },
      });

      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");

        if (io) {
          io.to(ratedUser._id.toString()).emit("newNotification", notification);
          console.log(`🔔 Rating notification sent to ${ratedUser._id}`);
        }
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onRatingReceived:", error);
      return null;
    }
  },

  /**
   * When a listing is completed
   */
  async onListingCompleted(listing, recipient, io) {
    try {
      const notification = await createNotification({
        recipient: recipient._id,
        sender: listing.donor,
        type: "completion",
        title: "✅ Donation Completed",
        message: `The donation "${listing.title}" has been marked as completed. Please rate your experience!`,
        icon: "✅",
        relatedListing: listing._id,
        actionUrl: `/listings/${listing._id}`,
        priority: "normal",
      });

      if (notification) {
        await notification.populate("sender", "firstName lastName avatar");

        if (io) {
          io.to(recipient._id.toString()).emit("newNotification", notification);
          console.log(`🔔 Completion notification sent to ${recipient._id}`);
        }
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in onListingCompleted:", error);
      return null;
    }
  },

  /**
   * Broadcast new listing to all users
   */
  async broadcastNewListing(listing, donor, io) {
    try {
      const User = require("../models/User");

      // ✅ FIX: Get all RECIPIENT users (not donors) except the current user
      const allUsers = await User.find({
        _id: { $ne: donor._id },
        isActive: true,
        userType: "recipient", // ✅ ONLY NOTIFY RECIPIENTS
      }).select("_id");

      if (allUsers.length === 0) {
        console.log("⚠️ No recipients to notify");
        return 0;
      }

      // Create notifications for all recipients
      const notificationPromises = allUsers.map((user) =>
        createNotification({
          recipient: user._id,
          sender: donor._id,
          type: "new_listing",
          title: "🎁 New Donation Available!",
          message: `${donor.firstName} donated ${listing.title}`,
          icon: "🎁",
          relatedListing: listing._id,
          actionUrl: `/listings/${listing._id}`, // ✅ Links to listing detail page
          priority: listing.urgency >= 2 ? "high" : "normal",
          metadata: {
            category: listing.category,
            quantity: listing.quantity,
          },
        })
      );

      await Promise.all(notificationPromises);

      // Broadcast via Socket.IO
      if (io) {
        io.emit("newListingAlert", {
          listing: {
            _id: listing._id,
            title: listing.title,
            category: listing.category,
            images: listing.images,
            quantity: listing.quantity,
          },
          donor: {
            _id: donor._id,
            name: `${donor.firstName} ${donor.lastName}`,
            avatar: donor.avatar,
          },
          timestamp: new Date(),
        });

        console.log(
          `✅ Broadcasted new listing to ${allUsers.length} recipients`
        );
      }

      return allUsers.length;
    } catch (error) {
      console.error("❌ Error in broadcastNewListing:", error);
      return 0;
    }
  },

  /**
   * When a listing is edited/updated
   */
  async onListingUpdated(listing, updatedFields, io) {
    try {
      const usersToNotify = [];

      // Add all interested users
      if (listing.interestedUsers && listing.interestedUsers.length > 0) {
        listing.interestedUsers.forEach((interest) => {
          usersToNotify.push(interest.user);
        });
      }

      // Add assigned recipient
      if (listing.assignedTo) {
        usersToNotify.push(listing.assignedTo);
      }

      // Remove duplicates
      const uniqueUsers = [...new Set(usersToNotify.map((u) => u.toString()))];

      if (uniqueUsers.length === 0) return null;

      // Create change summary
      const changes = [];
      if (updatedFields.title) changes.push("title");
      if (updatedFields.quantity) changes.push("quantity");
      if (updatedFields.pickupLocation) changes.push("pickup location");
      if (updatedFields.expiryDate) changes.push("expiry date");

      const changeText =
        changes.length > 0
          ? `Updated: ${changes.join(", ")}`
          : "Details updated";

      // Create notifications for all interested users
      const notificationPromises = uniqueUsers.map((userId) =>
        createNotification({
          recipient: userId,
          sender: listing.donor,
          type: "listing_updated",
          title: "✏️ Listing Updated",
          message: `"${listing.title}" has been updated. ${changeText}`,
          icon: "✏️",
          relatedListing: listing._id,
          actionUrl: `/listings/${listing._id}`,
          priority: "normal",
          metadata: { changes: updatedFields },
        })
      );

      const notifications = await Promise.all(notificationPromises);

      // Send via Socket.IO
      if (io) {
        notifications.forEach((notification) => {
          if (notification) {
            io.to(notification.recipient.toString()).emit(
              "newNotification",
              notification
            );
          }
        });
        console.log(`🔔 Sent ${notifications.length} update notifications`);
      }

      return notifications;
    } catch (error) {
      console.error("❌ Error in onListingUpdated:", error);
      return null;
    }
  },

  /**
   * When a listing is deleted/cancelled
   */
  async onListingDeleted(listing, reason, io) {
    try {
      const usersToNotify = [];

      // Add all interested users
      if (listing.interestedUsers && listing.interestedUsers.length > 0) {
        listing.interestedUsers.forEach((interest) => {
          usersToNotify.push(interest.user);
        });
      }

      // Add assigned recipient
      if (listing.assignedTo) {
        usersToNotify.push(listing.assignedTo);
      }

      // Remove duplicates
      const uniqueUsers = [...new Set(usersToNotify.map((u) => u.toString()))];

      if (uniqueUsers.length === 0) return null;

      const reasonText = reason || "The donor has removed this listing";

      // Create notifications
      const notificationPromises = uniqueUsers.map((userId) =>
        createNotification({
          recipient: userId,
          sender: listing.donor,
          type: "listing_cancelled",
          title: "❌ Listing Cancelled",
          message: `"${listing.title}" is no longer available. ${reasonText}`,
          icon: "❌",
          actionUrl: `/listings`,
          priority: "high",
          metadata: {
            listingTitle: listing.title,
            reason: reasonText,
          },
        })
      );

      const notifications = await Promise.all(notificationPromises);

      // Send via Socket.IO
      if (io) {
        notifications.forEach((notification) => {
          if (notification) {
            io.to(notification.recipient.toString()).emit(
              "newNotification",
              notification
            );
          }
        });
        console.log(
          `🔔 Sent ${notifications.length} cancellation notifications`
        );
      }

      return notifications;
    } catch (error) {
      console.error("❌ Error in onListingDeleted:", error);
      return null;
    }
  },

  /**
   * When listing status changes (assigned/completed/expired)
   */
  async onListingStatusChanged(listing, newStatus, io) {
    try {
      // Notify all interested users who didn't get it
      if (newStatus === "assigned" && listing.interestedUsers) {
        const rejectedUsers = listing.interestedUsers.filter(
          (interest) =>
            interest.user.toString() !== listing.assignedTo.toString()
        );

        if (rejectedUsers.length === 0) return null;

        const notificationPromises = rejectedUsers.map((interest) =>
          createNotification({
            recipient: interest.user,
            sender: listing.donor,
            type: "listing_unavailable",
            title: "😔 Listing Already Taken",
            message: `"${listing.title}" has been assigned to someone else`,
            icon: "😔",
            relatedListing: listing._id,
            actionUrl: `/listings?category=${listing.category}`,
            priority: "normal",
            metadata: {
              suggestion: `Check out similar ${listing.category} listings`,
            },
          })
        );

        const notifications = await Promise.all(notificationPromises);

        // Send via Socket.IO
        if (io) {
          notifications.forEach((notification) => {
            if (notification) {
              io.to(notification.recipient.toString()).emit(
                "newNotification",
                notification
              );
            }
          });
          console.log(
            `🔔 Sent ${notifications.length} "already taken" notifications`
          );
        }

        return notifications;
      }

      return null;
    } catch (error) {
      console.error("❌ Error in onListingStatusChanged:", error);
      return null;
    }
  },

  /**
   * Notify pickup completion
   */
  async notifyPickupComplete(transaction, io) {
    try {
      // Notify donor
      const donorNotif = await createNotification({
        recipient: transaction.donor,
        sender: transaction.recipient,
        type: "pickup_completed",
        title: "✅ Pickup Completed!",
        message: "Your donation was successfully picked up",
        icon: "✅",
        relatedListing: transaction.listing,
        transaction: transaction._id,
        actionUrl: `/impact/personal`,
        priority: "normal",
        metadata: { impact: transaction.impact },
      });

      // Notify recipient
      const recipientNotif = await createNotification({
        recipient: transaction.recipient,
        sender: transaction.donor,
        type: "pickup_completed",
        title: "🎉 Thank You!",
        message: "Pickup confirmed successfully",
        icon: "🎉",
        relatedListing: transaction.listing,
        transaction: transaction._id,
        actionUrl: `/impact/personal`,
        priority: "normal",
        metadata: { impact: transaction.impact },
      });

      // Send via Socket.IO
      if (io) {
        if (donorNotif) {
          await donorNotif.populate("sender", "firstName lastName avatar");
          io.to(transaction.donor.toString()).emit(
            "newNotification",
            donorNotif
          );
        }

        if (recipientNotif) {
          await recipientNotif.populate("sender", "firstName lastName avatar");
          io.to(transaction.recipient.toString()).emit(
            "newNotification",
            recipientNotif
          );
        }

        console.log("🔔 Pickup completion notifications sent");
      }

      return { donorNotif, recipientNotif };
    } catch (error) {
      console.error("❌ Error in notifyPickupComplete:", error);
      return null;
    }
  },
};

module.exports = notificationHelper;
