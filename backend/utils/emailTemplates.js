// ============================================
// backend/utils/emailTemplates.js - Email Templates
// ============================================

const APP_NAME = "ShareTogether";
const APP_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@sharetogether.com";

// Base email template wrapper
const baseTemplate = (content, previewText = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${APP_NAME}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1f2937; margin-top: 0; }
    .content p { color: #4b5563; line-height: 1.6; margin: 16px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .info-box { background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .info-box p { margin: 0; color: #374151; }
    .success-box { background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .warning-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .stats-grid { display: flex; gap: 16px; margin: 20px 0; }
    .stat-card { flex: 1; background: #f9fafb; padding: 16px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #667eea; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #6b7280; font-size: 12px; margin: 8px 0; }
    .footer a { color: #667eea; text-decoration: none; }
    .social-links { margin: 16px 0; }
    .social-links a { display: inline-block; margin: 0 8px; color: #667eea; }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px 16px; }
      .stats-grid { flex-direction: column; }
    }
  </style>
</head>
<body>
  ${
    previewText
      ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>`
      : ""
  }
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <div class="container">
          ${content}
          <div class="footer">
            <p><strong>${APP_NAME}</strong> - Building a sustainable community together</p>
            <p>🌱 Every donation makes a difference</p>
            <div class="social-links">
              <a href="#">Twitter</a> | <a href="#">Facebook</a> | <a href="#">Instagram</a>
            </div>
            <p>
              <a href="${APP_URL}/settings/notifications">Manage email preferences</a> | 
              <a href="${APP_URL}/unsubscribe">Unsubscribe</a>
            </p>
            <p style="margin-top: 20px;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ============================================
// Email Templates
// ============================================

// 1. Welcome Email
const welcomeEmail = (user) => {
  const content = `
    <div class="header">
      <h1>🎉 Welcome to ${APP_NAME}!</h1>
      <p>Together, we're making a difference</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName}! 👋</h2>
      <p>Welcome to our community of conscious sharers! We're thrilled to have you join us in our mission to reduce waste and build stronger communities.</p>
      
      <div class="info-box">
        <p><strong>What you can do with ${APP_NAME}:</strong></p>
        <p>✨ Share items you no longer need<br>
        🎁 Find useful items from neighbors<br>
        📊 Track your environmental impact<br>
        🤝 Connect with your local community</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/dashboard" class="button">Explore Your Dashboard</a>
      </p>
      
      <h3>Quick Start Guide:</h3>
      <ol style="color: #4b5563; line-height: 1.8;">
        <li><strong>Complete your profile</strong> - Add a photo and bio to build trust</li>
        <li><strong>Browse nearby listings</strong> - See what's available in your area</li>
        <li><strong>Create your first listing</strong> - Share something you no longer need</li>
        <li><strong>Get verified</strong> - Increase your trust score</li>
      </ol>
      
      <div class="success-box">
        <p>🌱 <strong>Did you know?</strong> Each item shared saves an average of 3.5 kg of CO2 emissions!</p>
      </div>
      
      <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
      
      <p>Happy sharing! 🌍</p>
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `🎉 Welcome to ${APP_NAME}, ${user.firstName}!`,
    html: baseTemplate(
      content,
      `Welcome to ${APP_NAME}! Start sharing and making a difference today.`
    ),
    text: `Welcome to ${APP_NAME}, ${user.firstName}! We're excited to have you join our community. Visit ${APP_URL}/dashboard to get started.`,
  };
};

// 2. Password Reset Email
const passwordResetEmail = (user, resetToken, resetUrl) => {
  const content = `
    <div class="header">
      <h1>🔐 Password Reset</h1>
      <p>Let's get you back into your account</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset My Password</a>
      </p>
      
      <div class="warning-box">
        <p>⏰ <strong>This link expires in 1 hour</strong> for security reasons.</p>
      </div>
      
      <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      
      <div class="info-box">
        <p><strong>Security Tips:</strong></p>
        <p>• Never share your password with anyone<br>
        • Use a unique password for each account<br>
        • Enable two-factor authentication when available</p>
      </div>
      
      <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; font-size: 12px; color: #6b7280;">${resetUrl}</p>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `🔐 Reset Your ${APP_NAME} Password`,
    html: baseTemplate(
      content,
      `Reset your ${APP_NAME} password. This link expires in 1 hour.`
    ),
    text: `Hi ${user.firstName}, Reset your password by visiting: ${resetUrl}. This link expires in 1 hour.`,
  };
};

// 3. Email Verification
const emailVerificationEmail = (user, verificationUrl) => {
  const content = `
    <div class="header">
      <h1>✉️ Verify Your Email</h1>
      <p>One quick step to unlock full features</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName}! 👋</h2>
      <p>Please verify your email address to complete your account setup and unlock all features.</p>
      
      <p style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </p>
      
      <div class="info-box">
        <p><strong>Why verify?</strong></p>
        <p>✅ Increase your trust score<br>
        ✅ Get priority in search results<br>
        ✅ Unlock chat features<br>
        ✅ Receive important notifications</p>
      </div>
      
      <p>This verification link expires in 24 hours.</p>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `✉️ Verify your ${APP_NAME} email address`,
    html: baseTemplate(
      content,
      `Verify your email to unlock all ${APP_NAME} features.`
    ),
    text: `Hi ${user.firstName}, Verify your email by visiting: ${verificationUrl}`,
  };
};

// 4. Donation Confirmation (Donor)
const donationConfirmationEmail = (donor, recipient, listing) => {
  const content = `
    <div class="header">
      <h1>🎁 Donation Confirmed!</h1>
      <p>Thank you for making a difference</p>
    </div>
    <div class="content">
      <h2>Great news, ${donor.firstName}! 🎉</h2>
      <p>Your donation has been successfully matched and confirmed!</p>
      
      <div class="info-box">
        <p><strong>📦 Item Donated:</strong> ${listing.title}</p>
        <p><strong>👤 Recipient:</strong> ${recipient.firstName} ${
    recipient.lastName
  }</p>
        <p><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="success-box">
        <p>🌱 <strong>Your Impact:</strong> You've helped save approximately ${
          listing.estimatedImpact || 2.5
        } kg of CO2!</p>
      </div>
      
      <p>The recipient has been notified and will contact you to arrange pickup/delivery.</p>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/dashboard" class="button">View Your Impact</a>
      </p>
      
      <p>Thank you for being part of our sustainable community! 🌍</p>
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `🎁 Donation Confirmed: ${listing.title}`,
    html: baseTemplate(
      content,
      `Your donation of "${listing.title}" has been confirmed!`
    ),
    text: `Hi ${donor.firstName}, Your donation of "${listing.title}" to ${recipient.firstName} has been confirmed.`,
  };
};

// 5. Item Received Notification (Recipient)
const itemReceivedEmail = (recipient, donor, listing) => {
  const content = `
    <div class="header">
      <h1>📬 Item Available for You!</h1>
      <p>A generous donor is sharing with you</p>
    </div>
    <div class="content">
      <h2>Good news, ${recipient.firstName}! 🎁</h2>
      <p>You've been matched with a donation!</p>
      
      <div class="info-box">
        <p><strong>📦 Item:</strong> ${listing.title}</p>
        <p><strong>👤 Donor:</strong> ${donor.firstName}</p>
        <p><strong>📍 Location:</strong> ${
          listing.location?.city || "See listing"
        }</p>
      </div>
      
      <p>Please contact the donor to arrange pickup/delivery.</p>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/listings/${
    listing._id
  }" class="button">View Listing Details</a>
      </p>
      
      <div class="warning-box">
        <p>⏰ <strong>Please respond within 48 hours</strong> to confirm your interest.</p>
      </div>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `📬 You've been matched: ${listing.title}`,
    html: baseTemplate(content, `You've been matched with "${listing.title}"!`),
    text: `Hi ${recipient.firstName}, You've been matched with "${listing.title}" from ${donor.firstName}.`,
  };
};

// 6. Listing Expiration Warning
const listingExpirationEmail = (user, listing, daysRemaining) => {
  const content = `
    <div class="header">
      <h1>⏰ Listing Expiring Soon</h1>
      <p>Your listing needs attention</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>Your listing is expiring soon:</p>
      
      <div class="warning-box">
        <p><strong>📦 ${listing.title}</strong></p>
        <p>⏰ Expires in <strong>${daysRemaining} day${
    daysRemaining !== 1 ? "s" : ""
  }</strong></p>
      </div>
      
      <p>Would you like to extend your listing?</p>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/listings/${
    listing._id
  }/edit" class="button">Extend Listing</a>
      </p>
      
      <p>If your item has been donated or is no longer available, please mark it as completed or remove the listing.</p>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `⏰ Your listing "${
      listing.title
    }" expires in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`,
    html: baseTemplate(
      content,
      `Your listing expires in ${daysRemaining} days.`
    ),
    text: `Hi ${user.firstName}, Your listing "${listing.title}" expires in ${daysRemaining} days. Visit ${APP_URL}/listings/${listing._id}/edit to extend.`,
  };
};

// 7. New Message Notification
const newMessageEmail = (recipient, sender, messagePreview, chatId) => {
  const content = `
    <div class="header">
      <h1>💬 New Message</h1>
      <p>You have a new message on ${APP_NAME}</p>
    </div>
    <div class="content">
      <h2>Hi ${recipient.firstName},</h2>
      <p><strong>${sender.firstName}</strong> sent you a message:</p>
      
      <div class="info-box">
        <p style="font-style: italic;">"${messagePreview.substring(0, 150)}${
    messagePreview.length > 150 ? "..." : ""
  }"</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/chat/${chatId}" class="button">Reply to Message</a>
      </p>
      
      <p>Don't keep them waiting! 😊</p>
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `💬 New message from ${sender.firstName}`,
    html: baseTemplate(
      content,
      `New message from ${sender.firstName}: "${messagePreview.substring(
        0,
        50
      )}..."`
    ),
    text: `Hi ${recipient.firstName}, ${sender.firstName} sent you a message: "${messagePreview}". Reply at ${APP_URL}/chat/${chatId}`,
  };
};

// 8. Weekly Impact Summary
const weeklyImpactEmail = (user, stats) => {
  const content = `
    <div class="header">
      <h1>📊 Your Weekly Impact</h1>
      <p>See how you're making a difference</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName}! 🌟</h2>
      <p>Here's your impact summary for this week:</p>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
        <tr>
          <td style="width: 33%; text-align: center; padding: 16px; background: #f0f4ff; border-radius: 8px 0 0 8px;">
            <div style="font-size: 28px; font-weight: 700; color: #667eea;">${
              stats.itemsDonated || 0
            }</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Items Donated</div>
          </td>
          <td style="width: 33%; text-align: center; padding: 16px; background: #dcfce7;">
            <div style="font-size: 28px; font-weight: 700; color: #16a34a;">${
              stats.co2Saved || 0
            } kg</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">CO₂ Saved</div>
          </td>
          <td style="width: 33%; text-align: center; padding: 16px; background: #fef3c7; border-radius: 0 8px 8px 0;">
            <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">${
              stats.peopleHelped || 0
            }</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">People Helped</div>
          </td>
        </tr>
      </table>
      
      <div class="success-box">
        <p>🏆 <strong>Total Impact:</strong> You've donated ${
          stats.totalDonations || 0
        } items and saved ${stats.totalCO2 || 0} kg of CO₂!</p>
      </div>
      
      ${
        stats.newBadge
          ? `
      <div class="info-box">
        <p>🎖️ <strong>New Badge Earned:</strong> ${stats.newBadge}</p>
        <p>Congratulations on this achievement!</p>
      </div>
      `
          : ""
      }
      
      <p style="text-align: center;">
        <a href="${APP_URL}/impact" class="button">View Full Impact Report</a>
      </p>
      
      <p>Keep up the great work! Every item shared makes a difference. 🌍</p>
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `📊 Your Weekly Impact: ${
      stats.itemsDonated || 0
    } items donated, ${stats.co2Saved || 0}kg CO₂ saved!`,
    html: baseTemplate(
      content,
      `This week you donated ${stats.itemsDonated || 0} items and saved ${
        stats.co2Saved || 0
      }kg of CO₂!`
    ),
    text: `Hi ${user.firstName}, This week: ${
      stats.itemsDonated || 0
    } items donated, ${stats.co2Saved || 0}kg CO₂ saved, ${
      stats.peopleHelped || 0
    } people helped.`,
  };
};

// 9. Account Warning
const accountWarningEmail = (user, warningReason) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
      <h1>⚠️ Account Warning</h1>
      <p>Important notice about your account</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>We're reaching out because there's been an issue with your account activity:</p>
      
      <div class="warning-box">
        <p><strong>Reason:</strong> ${warningReason}</p>
      </div>
      
      <p>Please review our <a href="${APP_URL}/community-guidelines">Community Guidelines</a> to ensure your future activity complies with our standards.</p>
      
      <div class="info-box">
        <p><strong>What happens next?</strong></p>
        <p>• This is a warning - no action is required<br>
        • Continued violations may result in account suspension<br>
        • If you believe this is an error, please contact support</p>
      </div>
      
      <p>We're here to help if you have questions. Contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `⚠️ Important: Warning about your ${APP_NAME} account`,
    html: baseTemplate(
      content,
      `Important notice about your ${APP_NAME} account activity.`
    ),
    text: `Hi ${user.firstName}, This is a warning about your account activity: ${warningReason}. Please review our community guidelines.`,
  };
};

// 10. Account Suspension
const accountSuspensionEmail = (user, reason, suspendedUntil) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">
      <h1>🚫 Account Suspended</h1>
      <p>Your account has been temporarily suspended</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>Your ${APP_NAME} account has been suspended due to a violation of our community guidelines.</p>
      
      <div class="warning-box" style="background-color: #fee2e2; border-left-color: #dc2626;">
        <p><strong>Reason:</strong> ${reason}</p>
        ${
          suspendedUntil
            ? `<p><strong>Suspended until:</strong> ${new Date(
                suspendedUntil
              ).toLocaleDateString()}</p>`
            : "<p><strong>Duration:</strong> Indefinite</p>"
        }
      </div>
      
      <p>During this suspension, you will not be able to:</p>
      <ul style="color: #4b5563;">
        <li>Create or edit listings</li>
        <li>Send or receive messages</li>
        <li>Request or donate items</li>
      </ul>
      
      <div class="info-box">
        <p><strong>Appeal this decision:</strong></p>
        <p>If you believe this suspension was made in error, you can submit an appeal by contacting us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
      </div>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `🚫 Your ${APP_NAME} account has been suspended`,
    html: baseTemplate(content, `Your ${APP_NAME} account has been suspended.`),
    text: `Hi ${user.firstName}, Your account has been suspended. Reason: ${reason}. Contact ${SUPPORT_EMAIL} to appeal.`,
  };
};

// 11. Pickup Reminder
const pickupReminderEmail = (user, listing, schedule) => {
  const content = `
    <div class="header">
      <h1>📅 Pickup Reminder</h1>
      <p>Don't forget your scheduled pickup!</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>This is a reminder about your upcoming pickup:</p>
      
      <div class="info-box">
        <p><strong>📦 Item:</strong> ${listing.title}</p>
        <p><strong>📅 Date:</strong> ${new Date(
          schedule.date
        ).toLocaleDateString()}</p>
        <p><strong>🕐 Time:</strong> ${schedule.timeSlot}</p>
        <p><strong>📍 Location:</strong> ${
          schedule.address || listing.location?.city || "See listing"
        }</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/schedules/${
    schedule._id
  }" class="button">View Schedule Details</a>
      </p>
      
      <p>Can't make it? Please reschedule or cancel to let the other party know.</p>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `📅 Pickup Reminder: ${listing.title} - ${new Date(
      schedule.date
    ).toLocaleDateString()}`,
    html: baseTemplate(
      content,
      `Reminder: Pickup scheduled for ${new Date(
        schedule.date
      ).toLocaleDateString()}`
    ),
    text: `Hi ${user.firstName}, Reminder: Pickup for "${
      listing.title
    }" on ${new Date(schedule.date).toLocaleDateString()} at ${
      schedule.timeSlot
    }.`,
  };
};

// 12. Verification Approved
const verificationApprovedEmail = (user) => {
  const content = `
    <div class="header">
      <h1>✅ Verification Approved!</h1>
      <p>Your account is now verified</p>
    </div>
    <div class="content">
      <h2>Congratulations, ${user.firstName}! 🎉</h2>
      <p>Your verification request has been approved. You now have a verified badge on your profile!</p>
      
      <div class="success-box">
        <p>✅ <strong>Benefits of being verified:</strong></p>
        <p>• Higher trust score<br>
        • Priority in search results<br>
        • Verified badge on your profile<br>
        • Access to exclusive features</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/profile" class="button">View Your Profile</a>
      </p>
      
      <p>Thank you for helping build a trusted community!</p>
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `✅ Your ${APP_NAME} account is now verified!`,
    html: baseTemplate(
      content,
      `Congratulations! Your ${APP_NAME} account has been verified.`
    ),
    text: `Hi ${user.firstName}, Your verification has been approved! You now have a verified badge on your profile.`,
  };
};

// 13. Verification Rejected
const verificationRejectedEmail = (user, reason) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
      <h1>📋 Verification Update</h1>
      <p>About your verification request</p>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>Unfortunately, your verification request could not be approved at this time.</p>
      
      <div class="warning-box">
        <p><strong>Reason:</strong> ${reason}</p>
      </div>
      
      <p>You can submit a new verification request after addressing the above concerns:</p>
      
      <p style="text-align: center;">
        <a href="${APP_URL}/settings/verification" class="button">Submit New Request</a>
      </p>
      
      <p>If you have questions about this decision, please contact our support team.</p>
      
      <p><strong>The ${APP_NAME} Team</strong></p>
    </div>
  `;

  return {
    subject: `📋 Update on your ${APP_NAME} verification request`,
    html: baseTemplate(content, `Update on your verification request.`),
    text: `Hi ${user.firstName}, Your verification request was not approved. Reason: ${reason}. You can submit a new request.`,
  };
};

module.exports = {
  welcomeEmail,
  passwordResetEmail,
  emailVerificationEmail,
  donationConfirmationEmail,
  itemReceivedEmail,
  listingExpirationEmail,
  newMessageEmail,
  weeklyImpactEmail,
  accountWarningEmail,
  accountSuspensionEmail,
  pickupReminderEmail,
  verificationApprovedEmail,
  verificationRejectedEmail,
};
