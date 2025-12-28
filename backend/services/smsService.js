/**
 * SMS Service using Twilio
 * Handles SMS notifications for pickup reminders and alerts
 */

// Check if Twilio is configured
// Debug: Log Twilio env variables

const isTwilioConfigured = () => {
  return (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
};

// Initialize Twilio client only if configured
let twilioClient = null;
if (isTwilioConfigured()) {
  try {
    const twilio = require("twilio");
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log("✅ Twilio SMS service initialized");
  } catch (error) {
    console.warn("⚠️ Twilio not configured, SMS service disabled");
  }
} else {
  console.log("ℹ️ Twilio credentials not set, SMS service disabled");
}

/**
 * Send SMS message
 * @param {string} to - Phone number (with country code, e.g., +1234567890)
 * @param {string} message - SMS message content
 * @returns {Promise<object>} - Twilio message response
 */
const sendSMS = async (to, message) => {
  if (!twilioClient) {
    console.log("📱 SMS (mock):", { to, message });
    return { success: true, mock: true, message: "SMS service not configured" };
  }

  try {
    // Validate phone number format
    if (!to.startsWith("+")) {
      to = "+1" + to.replace(/\D/g, ""); // Default to US if no country code
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log(`✅ SMS sent to ${to}: ${result.sid}`);
    return {
      success: true,
      sid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error("❌ SMS send failed:", error.message);
    throw error;
  }
};

/**
 * Send pickup reminder SMS
 * @param {object} schedule - Schedule object with donor, recipient, listing info
 * @param {string} recipientPhone - Phone number to send reminder to
 * @param {number} hoursUntil - Hours until scheduled pickup
 */
const sendPickupReminder = async (
  schedule,
  recipientPhone,
  hoursUntil = 24
) => {
  const timeText = hoursUntil === 1 ? "1 hour" : `${hoursUntil} hours`;
  const message = `🎁 DonateLocal Reminder: Your pickup for "${
    schedule.listingTitle
  }" is scheduled in ${timeText}. 
Location: ${schedule.pickupLocation}
Time: ${new Date(schedule.scheduledDate).toLocaleString()}
Reply HELP for assistance.`;

  return sendSMS(recipientPhone, message);
};

/**
 * Send donation received confirmation
 * @param {object} recipient - Recipient user object
 * @param {string} listingTitle - Title of the donated item
 */
const sendDonationReceivedConfirmation = async (
  recipientPhone,
  listingTitle,
  donorName
) => {
  const message = `✅ Great news! Your request for "${listingTitle}" from ${donorName} has been confirmed. Check DonateLocal app for pickup details. Reply HELP for assistance.`;

  return sendSMS(recipientPhone, message);
};

/**
 * Send new listing alert (for saved search alerts)
 * @param {string} recipientPhone - Phone number
 * @param {string} listingTitle - New listing title
 * @param {string} category - Listing category
 */
const sendNewListingAlert = async (recipientPhone, listingTitle, category) => {
  const message = `🆕 New listing on DonateLocal! "${listingTitle}" in ${category} category matches your saved search. Check the app now! Reply STOP to unsubscribe.`;

  return sendSMS(recipientPhone, message);
};

/**
 * Send OTP for phone verification
 * @param {string} phone - Phone number
 * @param {string} otp - One-time password
 */
const sendOTP = async (phone, otp) => {
  const message = `Your DonateLocal verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

  return sendSMS(phone, message);
};

/**
 * Send schedule confirmation to both parties
 * @param {object} schedule - Schedule object
 * @param {string} donorPhone - Donor's phone number
 * @param {string} recipientPhone - Recipient's phone number
 */
const sendScheduleConfirmation = async (
  schedule,
  donorPhone,
  recipientPhone
) => {
  const dateStr = new Date(schedule.scheduledDate).toLocaleString();

  // Message to donor
  const donorMessage = `📅 Pickup Scheduled! "${schedule.listingTitle}" will be picked up on ${dateStr} at ${schedule.pickupLocation}. Open DonateLocal for details.`;

  // Message to recipient
  const recipientMessage = `📅 Pickup Confirmed! You're scheduled to pick up "${schedule.listingTitle}" on ${dateStr} at ${schedule.pickupLocation}. Open DonateLocal for directions.`;

  const results = await Promise.allSettled([
    donorPhone
      ? sendSMS(donorPhone, donorMessage)
      : Promise.resolve({ mock: true }),
    recipientPhone
      ? sendSMS(recipientPhone, recipientMessage)
      : Promise.resolve({ mock: true }),
  ]);

  return {
    donorSent: results[0].status === "fulfilled",
    recipientSent: results[1].status === "fulfilled",
  };
};

/**
 * Send cancellation notice
 * @param {string} recipientPhone - Phone number
 * @param {string} listingTitle - Cancelled listing title
 * @param {string} reason - Cancellation reason (optional)
 */
const sendCancellationNotice = async (
  recipientPhone,
  listingTitle,
  reason = ""
) => {
  let message = `❌ The pickup for "${listingTitle}" has been cancelled.`;
  if (reason) {
    message += ` Reason: ${reason}`;
  }
  message += " Please check DonateLocal for other available items.";

  return sendSMS(recipientPhone, message);
};

/**
 * Generate random OTP
 * @param {number} length - OTP length (default 6)
 * @returns {string} - Generated OTP
 */
const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

module.exports = {
  sendSMS,
  sendPickupReminder,
  sendDonationReceivedConfirmation,
  sendNewListingAlert,
  sendOTP,
  sendScheduleConfirmation,
  sendCancellationNotice,
  generateOTP,
  isTwilioConfigured,
};
