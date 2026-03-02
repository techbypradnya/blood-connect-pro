const nodemailer = require("nodemailer");

/**
 * Create reusable email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send emergency email notification to a matching donor
 * @param {Object} donor - Donor user document
 * @param {Object} request - Blood request document
 */
const sendEmergencyEmail = async (donor, request) => {
  try {
    const transporter = createTransporter();

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:2px solid #dc2626;border-radius:8px;overflow:hidden;">
        <div style="background:#dc2626;color:#fff;padding:20px;text-align:center;">
          <h1 style="margin:0;font-size:22px;">🚨 Emergency Blood Request</h1>
        </div>
        <div style="padding:24px;">
          <p style="font-size:16px;">Hi <strong>${donor.fullName}</strong>,</p>
          <p>An urgent blood request matching your profile has been raised near you.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Blood Group</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.bloodGroup}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Units Required</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.unitsRequired}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Hospital</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.hospitalName}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">City</td><td style="padding:8px;border-bottom:1px solid #eee;">${request.city}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Contact</td><td style="padding:8px;">${request.contactNumber}</td></tr>
          </table>
          <p>If you are available to donate, please reach out to the contact number above or log in to accept the request.</p>
          <p style="color:#666;font-size:13px;">Thank you for being a lifesaver! 🩸</p>
        </div>
        <div style="background:#f9f9f9;padding:12px;text-align:center;font-size:12px;color:#999;">
          Blood Connect Pro &mdash; Connecting donors with those in need
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "Blood Connect Pro"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: donor.email,
      subject: "🚨 Emergency Blood Request Nearby",
      html,
    });

    console.log(`[NOTIFICATION] Emergency email sent to ${donor.email}`);
  } catch (error) {
    console.error(`[NOTIFICATION] Email failed for ${donor.email}:`, error.message);
  }
};

/**
 * Send emergency SMS notification to a matching donor
 * Uses Twilio — swap with Fast2SMS or any provider as needed
 * @param {Object} donor - Donor user document
 * @param {Object} request - Blood request document
 */
const sendEmergencySMS = async (donor, request) => {
  try {
    // Skip if Twilio credentials are not configured
    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log(`[NOTIFICATION] SMS skipped for ${donor.phone} — Twilio not configured`);
      return;
    }

    const twilio = require("twilio");
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    const message = `Emergency Blood Request: ${request.bloodGroup} needed at ${request.hospitalName}, ${request.city}. Units: ${request.unitsRequired}. Contact: ${request.contactNumber} — Blood Connect Pro`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: donor.phone,
    });

    console.log(`[NOTIFICATION] Emergency SMS sent to ${donor.phone}`);
  } catch (error) {
    console.error(`[NOTIFICATION] SMS failed for ${donor.phone}:`, error.message);
  }
};

/**
 * Notify all matching donors for an emergency blood request
 * @param {Object} request - Blood request document
 */
const notifyMatchingDonors = async (request) => {
  const User = require("../models/User");

  const donors = await User.find({
    role: "donor",
    bloodGroup: request.bloodGroup,
    city: { $regex: new RegExp(`^${request.city}$`, "i") },
    available: true,
  });

  if (donors.length === 0) {
    console.log(`[NOTIFICATION] No matching donors found for emergency request ${request._id}`);
    return;
  }

  console.log(`[NOTIFICATION] Found ${donors.length} matching donor(s) for emergency request ${request._id}`);

  // Fire all notifications concurrently — don't block on individual failures
  const promises = donors.flatMap((donor) => [
    sendEmergencyEmail(donor, request),
    sendEmergencySMS(donor, request),
  ]);

  await Promise.allSettled(promises);
};

module.exports = { sendEmergencyEmail, sendEmergencySMS, notifyMatchingDonors };
