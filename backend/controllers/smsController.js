/**
 * SMS Notification Controller
 * Handles SMS-related API endpoints
 */

const User = require("../models/User");
const smsService = require("../services/smsService");

// Store OTPs in memory (in production, use Redis)
const otpStore = new Map();

/**
 * Send OTP for phone verification
 * POST /api/notifications/sms/send-otp
 */
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Generate OTP
    const otp = smsService.generateOTP();

    // Store OTP with expiry (10 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      userId: req.user._id,
    });

    // Send OTP via SMS
    const result = await smsService.sendOTP(phone, otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
      mock: result.mock || false,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

/**
 * Verify OTP and save phone number
 * POST /api/notifications/sms/verify-otp
 */
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // Get stored OTP
    const storedData = otpStore.get(phone);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message:
          "No OTP found for this phone number. Please request a new one.",
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // OTP is valid - update user's phone number
    await User.findByIdAndUpdate(req.user._id, {
      phone: phone,
      phoneVerified: true,
    });

    // Clean up
    otpStore.delete(phone);

    res.json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

/**
 * Update SMS notification preferences
 * PUT /api/notifications/sms/preferences
 */
const updateSMSPreferences = async (req, res) => {
  try {
    const { smsEnabled, pickupReminders, newMatches, scheduleConfirmations } =
      req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        "smsPreferences.enabled": smsEnabled,
        "smsPreferences.pickupReminders": pickupReminders,
        "smsPreferences.newMatches": newMatches,
        "smsPreferences.scheduleConfirmations": scheduleConfirmations,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "SMS preferences updated",
      preferences: user.smsPreferences,
    });
  } catch (error) {
    console.error("Update SMS preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update SMS preferences",
      error: error.message,
    });
  }
};

/**
 * Get SMS notification preferences
 * GET /api/notifications/sms/preferences
 */
const getSMSPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "phone phoneVerified smsPreferences"
    );

    res.json({
      success: true,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      preferences: user.smsPreferences || {
        enabled: false,
        pickupReminders: true,
        newMatches: false,
        scheduleConfirmations: true,
      },
    });
  } catch (error) {
    console.error("Get SMS preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get SMS preferences",
      error: error.message,
    });
  }
};

/**
 * Test SMS (admin only)
 * POST /api/notifications/sms/test
 */
const testSMS = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const result = await smsService.sendSMS(
      phone,
      message || "Test message from DonateLocal"
    );

    res.json({
      success: true,
      message: "Test SMS sent",
      result,
    });
  } catch (error) {
    console.error("Test SMS error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test SMS",
      error: error.message,
    });
  }
};

/**
 * Check if SMS service is configured
 * GET /api/notifications/sms/status
 */
const getSMSStatus = async (req, res) => {
  res.json({
    success: true,
    configured: smsService.isTwilioConfigured(),
    provider: "twilio",
  });
};

module.exports = {
  sendOTP,
  verifyOTP,
  updateSMSPreferences,
  getSMSPreferences,
  testSMS,
  getSMSStatus,
};
