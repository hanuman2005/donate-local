// ============================================
// backend/services/emailService.js - Email Service
// ============================================
const { getTransporter } = require("../config/email");
const templates = require("../utils/emailTemplates");
const nodemailer = require("nodemailer");

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@sharetogether.com";
const FROM_NAME = process.env.FROM_NAME || "ShareTogether";

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 * @returns {Promise<Object>} - Send result
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await getTransporter();

    if (!transporter) {
      console.warn("⚠️ Email transporter not configured. Email not sent.");
      return { success: false, error: "Email not configured" };
    }

    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL for Ethereal test emails
    if (info.messageId) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`📧 Email Preview URL: ${previewUrl}`);
      }
    }

    console.log(`✅ Email sent to ${to}: ${subject}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// ============================================
// Email Service Methods
// ============================================

/**
 * Send welcome email to new user
 */
const sendWelcomeEmail = async (user) => {
  const { subject, html, text } = templates.welcomeEmail(user);
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/reset-password/${resetToken}`;
  const { subject, html, text } = templates.passwordResetEmail(
    user,
    resetToken,
    resetUrl
  );
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send email verification email
 */
const sendEmailVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/verify-email/${verificationToken}`;
  const { subject, html, text } = templates.emailVerificationEmail(
    user,
    verificationUrl
  );
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send donation confirmation to donor
 */
const sendDonationConfirmationEmail = async (donor, recipient, listing) => {
  const { subject, html, text } = templates.donationConfirmationEmail(
    donor,
    recipient,
    listing
  );
  return sendEmail({ to: donor.email, subject, html, text });
};

/**
 * Send item received notification to recipient
 */
const sendItemReceivedEmail = async (recipient, donor, listing) => {
  const { subject, html, text } = templates.itemReceivedEmail(
    recipient,
    donor,
    listing
  );
  return sendEmail({ to: recipient.email, subject, html, text });
};

/**
 * Send listing expiration warning
 */
const sendListingExpirationEmail = async (user, listing, daysRemaining) => {
  const { subject, html, text } = templates.listingExpirationEmail(
    user,
    listing,
    daysRemaining
  );
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send new message notification
 */
const sendNewMessageEmail = async (
  recipient,
  sender,
  messagePreview,
  chatId
) => {
  const { subject, html, text } = templates.newMessageEmail(
    recipient,
    sender,
    messagePreview,
    chatId
  );
  return sendEmail({ to: recipient.email, subject, html, text });
};

/**
 * Send weekly impact summary
 */
const sendWeeklyImpactEmail = async (user, stats) => {
  const { subject, html, text } = templates.weeklyImpactEmail(user, stats);
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send account warning
 */
const sendAccountWarningEmail = async (user, warningReason) => {
  const { subject, html, text } = templates.accountWarningEmail(
    user,
    warningReason
  );
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send account suspension notification
 */
const sendAccountSuspensionEmail = async (user, reason, suspendedUntil) => {
  const { subject, html, text } = templates.accountSuspensionEmail(
    user,
    reason,
    suspendedUntil
  );
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send pickup reminder
 */
const sendPickupReminderEmail = async (user, listing, schedule) => {
  const { subject, html, text } = templates.pickupReminderEmail(
    user,
    listing,
    schedule
  );
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send verification approved email
 */
const sendVerificationApprovedEmail = async (user) => {
  const { subject, html, text } = templates.verificationApprovedEmail(user);
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send verification rejected email
 */
const sendVerificationRejectedEmail = async (user, reason) => {
  const { subject, html, text } = templates.verificationRejectedEmail(
    user,
    reason
  );
  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send bulk emails (for newsletters, announcements)
 */
const sendBulkEmail = async (
  recipients,
  subject,
  htmlTemplate,
  textTemplate
) => {
  const results = [];

  for (const recipient of recipients) {
    // Replace placeholders in template
    const html = htmlTemplate
      .replace(/{{firstName}}/g, recipient.firstName)
      .replace(/{{lastName}}/g, recipient.lastName)
      .replace(/{{email}}/g, recipient.email);

    const text = textTemplate
      .replace(/{{firstName}}/g, recipient.firstName)
      .replace(/{{lastName}}/g, recipient.lastName)
      .replace(/{{email}}/g, recipient.email);

    const result = await sendEmail({
      to: recipient.email,
      subject,
      html,
      text,
    });
    results.push({ email: recipient.email, ...result });

    // Rate limiting - wait 100ms between emails
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendDonationConfirmationEmail,
  sendItemReceivedEmail,
  sendListingExpirationEmail,
  sendNewMessageEmail,
  sendWeeklyImpactEmail,
  sendAccountWarningEmail,
  sendAccountSuspensionEmail,
  sendPickupReminderEmail,
  sendVerificationApprovedEmail,
  sendVerificationRejectedEmail,
  sendBulkEmail,
};
