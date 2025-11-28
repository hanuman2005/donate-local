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
  async notifyQueueJoined(listing, userId, position) {
    try {
      const user = await User.findById(userId);

      await Notification.create({
        recipient: listing.donor,
        sender: userId,
        type: "queue_joined",
        title: "📋 Someone Joined Your Queue",
        message: `${user.firstName} joined the queue for "${listing.title}" (Position: ${position})`,
        listing: listing._id,
        actionUrl: `/listings/${listing._id}`,
      });
    } catch (error) {
      console.error("Error sending queue notification:", error);
    }
  },

  // Notify user when assigned from queue
  async notifyAssignedFromQueue(listing, userId) {
    try {
      await Notification.create({
        recipient: userId,
        sender: listing.donor,
        type: "queue_assigned",
        title: "🎉 Your Turn! Listing Assigned",
        message: `"${listing.title}" is now assigned to you! You have 24 hours to respond.`,
        listing: listing._id,
        actionUrl: `/listings/${listing._id}`,
      });
    } catch (error) {
      console.error("Error sending queue assignment notification:", error);
    }
  },

  // Notify when assignment is cancelled
  async notifyAssignmentCancelled(listing, userId) {
    try {
      await Notification.create({
        recipient: userId,
        type: "assignment_cancelled",
        title: "❌ Assignment Cancelled",
        message: `Your assignment for "${listing.title}" was cancelled by the donor`,
        listing: listing._id,
        actionUrl: `/listings`,
      });
    } catch (error) {
      console.error("Error sending cancellation notification:", error);
    }
  },
};
const onScheduleProposed = async (schedule, io) => {
  try {
    const notification = await Notification.create({
      recipient: schedule.recipient._id,
      sender: schedule.donor._id,
      type: "pickup_scheduled",
      title: "📅 Pickup Schedule Proposed",
      message: `${
        schedule.donor.firstName
      } proposed a pickup on ${schedule.proposedDate.toLocaleDateString()} at ${
        schedule.proposedTime
      }`,
      icon: "📅",
      priority: "high",
      relatedListing: schedule.listing._id,
      actionUrl: `/schedules/${schedule._id}`,
      metadata: {
        scheduleId: schedule._id,
        proposedDateTime: schedule.proposedDateTime,
      },
    });

    await notification.populate([
      { path: "sender", select: "firstName lastName avatar" },
      { path: "relatedListing", select: "title images" },
    ]);

    // Send via Socket.IO
    if (io) {
      io.to(schedule.recipient._id.toString()).emit(
        "newNotification",
        notification
      );
      console.log(
        `🔔 Schedule proposed notification sent to ${schedule.recipient.email}`
      );
    }

    // Send email (optional)
    // await sendEmail({
    //   to: schedule.recipient.email,
    //   subject: 'Pickup Schedule Proposed',
    //   template: 'schedule-proposed',
    //   data: { schedule },
    // });

    return notification;
  } catch (error) {
    console.error("onScheduleProposed error:", error);
    throw error;
  }
};

/**
 * Notify donor when schedule is confirmed
 */
const onScheduleConfirmed = async (schedule, io) => {
  try {
    const notification = await Notification.create({
      recipient: schedule.donor._id,
      sender: schedule.recipient._id,
      type: "pickup_scheduled",
      title: "✅ Pickup Schedule Confirmed",
      message: `${
        schedule.recipient.firstName
      } confirmed the pickup on ${schedule.proposedDate.toLocaleDateString()} at ${
        schedule.proposedTime
      }`,
      icon: "✅",
      priority: "high",
      relatedListing: schedule.listing._id,
      actionUrl: `/schedules/${schedule._id}`,
      metadata: {
        scheduleId: schedule._id,
        confirmedAt: schedule.confirmedAt,
      },
    });

    await notification.populate([
      { path: "sender", select: "firstName lastName avatar" },
      { path: "relatedListing", select: "title images" },
    ]);

    if (io) {
      io.to(schedule.donor._id.toString()).emit(
        "newNotification",
        notification
      );
      console.log(`🔔 Schedule confirmed notification sent to donor`);
    }

    return notification;
  } catch (error) {
    console.error("onScheduleConfirmed error:", error);
    throw error;
  }
};

/**
 * Notify when schedule is cancelled
 */
const onScheduleCancelled = async (schedule, recipient, io) => {
  try {
    const cancelledBy =
      schedule.cancelledBy.toString() === schedule.donor._id.toString()
        ? schedule.donor
        : schedule.recipient;

    const notification = await Notification.create({
      recipient: recipient._id,
      sender: schedule.cancelledBy,
      type: "pickup_scheduled",
      title: "❌ Pickup Schedule Cancelled",
      message: `${
        cancelledBy.firstName
      } cancelled the pickup scheduled for ${schedule.proposedDate.toLocaleDateString()}`,
      icon: "❌",
      priority: "high",
      relatedListing: schedule.listing._id,
      actionUrl: `/listings/${schedule.listing._id}`,
      metadata: {
        scheduleId: schedule._id,
        cancelledAt: schedule.cancelledAt,
        reason: schedule.cancellationReason,
      },
    });

    await notification.populate([
      { path: "sender", select: "firstName lastName avatar" },
      { path: "relatedListing", select: "title images" },
    ]);

    if (io) {
      io.to(recipient._id.toString()).emit("newNotification", notification);
      console.log(`🔔 Schedule cancelled notification sent`);
    }

    return notification;
  } catch (error) {
    console.error("onScheduleCancelled error:", error);
    throw error;
  }
};

/**
 * Notify when schedule is completed
 */
const onScheduleCompleted = async (schedule, io) => {
  try {
    const notification = await Notification.create({
      recipient: schedule.recipient._id,
      sender: schedule.donor._id,
      type: "pickup_completed",
      title: "🎉 Pickup Completed",
      message: `Pickup completed successfully for ${schedule.listing.title}`,
      icon: "🎉",
      priority: "normal",
      relatedListing: schedule.listing._id,
      actionUrl: `/impact/personal`,
      metadata: {
        scheduleId: schedule._id,
        completedAt: schedule.completedAt,
      },
    });

    await notification.populate([
      { path: "sender", select: "firstName lastName avatar" },
      { path: "relatedListing", select: "title images" },
    ]);

    if (io) {
      io.to(schedule.recipient._id.toString()).emit(
        "newNotification",
        notification
      );
      console.log(`🔔 Schedule completed notification sent`);
    }

    return notification;
  } catch (error) {
    console.error("onScheduleCompleted error:", error);
    throw error;
  }
};

/**
 * Send pickup reminder (24 hours before)
 */
const sendScheduleReminder = async (schedule, io) => {
  try {
    // Notify both donor and recipient
    const donorNotification = await Notification.create({
      recipient: schedule.donor._id,
      type: "pickup_scheduled",
      title: "⏰ Pickup Reminder",
      message: `Reminder: Pickup scheduled for ${schedule.proposedDate.toLocaleDateString()} at ${
        schedule.proposedTime
      }`,
      icon: "⏰",
      priority: "high",
      relatedListing: schedule.listing._id,
      actionUrl: `/schedules/${schedule._id}`,
      metadata: {
        scheduleId: schedule._id,
        proposedDateTime: schedule.proposedDateTime,
        reminderType: "upcoming",
      },
    });

    const recipientNotification = await Notification.create({
      recipient: schedule.recipient._id,
      type: "pickup_scheduled",
      title: "⏰ Pickup Reminder",
      message: `Reminder: Pickup scheduled for ${schedule.proposedDate.toLocaleDateString()} at ${
        schedule.proposedTime
      }`,
      icon: "⏰",
      priority: "high",
      relatedListing: schedule.listing._id,
      actionUrl: `/schedules/${schedule._id}`,
      metadata: {
        scheduleId: schedule._id,
        proposedDateTime: schedule.proposedDateTime,
        reminderType: "upcoming",
      },
    });

    if (io) {
      io.to(schedule.donor._id.toString()).emit(
        "newNotification",
        donorNotification
      );
      io.to(schedule.recipient._id.toString()).emit(
        "newNotification",
        recipientNotification
      );
      console.log(`🔔 Schedule reminders sent`);
    }

    // Mark reminder as sent
    await schedule.sendReminder();

    return { donorNotification, recipientNotification };
  } catch (error) {
    console.error("sendScheduleReminder error:", error);
    throw error;
  }
};

const onScheduleExpired = async (schedule, io) => {
  try {
    // Notify donor
    const donorNotification = await Notification.create({
      recipient: schedule.donor._id,
      type: 'listing_expired',
      title: '⏰ Pickup Schedule Expired',
      message: `The pickup schedule for ${schedule.listing.title} has expired. The listing is now available again.`,
      icon: '⏰',
      priority: 'normal',
      relatedListing: schedule.listing._id,
      actionUrl: `/listings/${schedule.listing._id}`,
      metadata: {
        scheduleId: schedule._id,
        expiredAt: new Date(),
      },
    });

    // Notify recipient
    const recipientNotification = await Notification.create({
      recipient: schedule.recipient._id,
      type: 'listing_expired',
      title: '⏰ Pickup Schedule Expired',
      message: `The pickup schedule for ${schedule.listing.title} has expired without confirmation.`,
      icon: '⏰',
      priority: 'normal',
      relatedListing: schedule.listing._id,
      actionUrl: `/listings/${schedule.listing._id}`,
      metadata: {
        scheduleId: schedule._id,
        expiredAt: new Date(),
      },
    });

    if (io) {
      io.to(schedule.donor._id.toString()).emit('newNotification', donorNotification);
      io.to(schedule.recipient._id.toString()).emit('newNotification', recipientNotification);
      console.log(`🔔 Schedule expired notifications sent`);
    }

    return { donorNotification, recipientNotification };
  } catch (error) {
    console.error('onScheduleExpired error:', error);
    throw error;
  }
};


module.exports = {
  ...notificationHelper,
  onScheduleProposed,
  onScheduleConfirmed,
  onScheduleCancelled,
  onScheduleCompleted,
  sendScheduleReminder,
  onScheduleExpired,
};

