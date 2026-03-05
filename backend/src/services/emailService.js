const nodemailer = require("nodemailer");

/**
 * Email Service using Mailtrap
 * Configured to use Mailtrap SMTP for development and testing
 */

// Initialize transporter with SMTP credentials
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === "true" ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  console.log(`📧 Initializing Mailtrap transporter:`, {
    host: config.host,
    port: config.port,
    user: config.auth.user ? "***" + config.auth.user.slice(-6) : "undefined",
    pass: config.auth.pass ? "***" : "undefined",
  });

  return nodemailer.createTransport(config);
};

/**
 * Send a verification email to the user
 * @param {Object} options - { to, fullName, verificationToken }
 */
const sendVerificationEmail = async ({ to, fullName, verificationToken }) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email/${verificationToken}`;
    console.log(`\n🔗 Verification URL: ${verificationUrl}\n`);

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Blood Connect Pro"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject: "Verify Your Email - Blood Connect Pro",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0; font-size: 24px;">Blood Connect Pro</h2>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Connecting Donors with Those in Need</p>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h3 style="color: #1f2937; margin-top: 0;">Welcome, ${fullName}!</h3>
            <p style="color: #4b5563; line-height: 1.6;">Thank you for registering with Blood Connect Pro. To complete your registration and verify your email address, please click the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Or copy this link in your browser:</p>
            <p style="color: #2563eb; font-size: 12px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 4px;">${verificationUrl}</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 13px; margin: 10px 0;">This link will expire in 24 hours. If you didn't create this account, please ignore this email.</p>
            <p style="color: #6b7280; font-size: 13px; margin: 10px 0;">Thank you for supporting blood donation awareness!</p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
            <p>© 2024 Blood Connect Pro. All rights reserved.</p>
            <p>Blood Connect Pro - Making a difference, one donation at a time.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    throw error;
  }
};

/**
 * Send a password reset email to the user
 * @param {Object} options - { to, fullName, resetToken }
 */
const sendPasswordResetEmail = async ({ to, fullName, resetToken }) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Blood Connect Pro"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject: "Password Reset - Blood Connect Pro",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0; font-size: 24px;">Blood Connect Pro</h2>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h3 style="color: #1f2937; margin-top: 0;">Password Reset Request</h3>
            <p style="color: #4b5563; line-height: 1.6;">Hi ${fullName},</p>
            <p style="color: #4b5563; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">This link expires in 10 minutes.</p>
            <p style="color: #6b7280; font-size: 13px; margin: 10px 0;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error.message);
    throw error;
  }
};

/**
 * Generic email sending function
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Blood Connect Pro"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      command: error.command,
      response: error.response,
    });
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEmail,
};
