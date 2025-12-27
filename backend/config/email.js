// ============================================
// backend/config/email.js - Email Configuration
// ============================================
const nodemailer = require("nodemailer");

// Create transporter based on environment
const createTransporter = () => {
  // For production, use real SMTP service
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // For development, use Gmail or Ethereal (fake SMTP for testing)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Create test account with Ethereal
  return null;
};

let transporter = createTransporter();

// Initialize Ethereal for development if no SMTP configured
const initializeTransporter = async () => {
  if (!transporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("📧 Email: Using Ethereal test account");
      console.log(`   Preview emails at: https://ethereal.email`);
      console.log(`   User: ${testAccount.user}`);
    } catch (error) {
      console.error("❌ Failed to create test email account:", error);
    }
  }
  return transporter;
};

// Verify transporter connection
const verifyConnection = async () => {
  try {
    if (!transporter) {
      await initializeTransporter();
    }
    await transporter.verify();
    console.log("✅ Email server connection verified");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error.message);
    return false;
  }
};

// Get transporter instance
const getTransporter = async () => {
  if (!transporter) {
    await initializeTransporter();
  }
  return transporter;
};

module.exports = {
  getTransporter,
  verifyConnection,
  initializeTransporter,
};
