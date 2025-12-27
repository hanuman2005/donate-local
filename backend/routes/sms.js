/**
 * SMS Notification Routes
 * Handles SMS-related API endpoints
 */

const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  sendOTP,
  verifyOTP,
  updateSMSPreferences,
  getSMSPreferences,
  testSMS,
  getSMSStatus,
} = require("../controllers/smsController");

// Public route - check if SMS is configured
router.get("/status", getSMSStatus);

// Protected routes - require authentication
router.use(auth);

// OTP verification
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// SMS preferences
router.get("/preferences", getSMSPreferences);
router.put("/preferences", updateSMSPreferences);

// Test SMS (admin only)
router.post("/test", testSMS);

module.exports = router;
