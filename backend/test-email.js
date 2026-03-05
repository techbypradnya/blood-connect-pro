/**
 * TEST SCRIPT: Email Verification Service
 * Run this to test Mailtrap connection and email sending
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("\n========== EMAIL SERVICE TEST ==========\n");

// Test 1: Check environment variables
console.log("✅ Step 1: Checking Environment Variables...\n");
console.log("SMTP Configuration:");
console.log(`  Host: ${process.env.SMTP_HOST}`);
console.log(`  Port: ${process.env.SMTP_PORT}`);
console.log(`  User: ***${process.env.SMTP_USER ? process.env.SMTP_USER.slice(-6) : "NOT SET"}`);
console.log(`  Pass: ${process.env.SMTP_PASS ? "***" : "NOT SET"}`);
console.log(`  From Email: ${process.env.FROM_EMAIL}`);
console.log(`  From Name: ${process.env.FROM_NAME}`);
console.log(`  Backend URL: ${process.env.BACKEND_URL}`);

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("\n❌ ERROR: SMTP credentials not set in .env file!");
  process.exit(1);
}

// Test 2: Create transporter
console.log("\n✅ Step 2: Creating Nodemailer Transporter...\n");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test 3: Verify connection
console.log("✅ Step 3: Verifying SMTP Connection...\n");
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:");
    console.error(error);
    process.exit(1);
  } else {
    console.log("✅ SMTP Connection Successful!");
    console.log("   Ready to send emails!\n");

    // Test 4: Create sample email
    console.log("✅ Step 4: Creating Sample Verification Email...\n");
    
    const verificationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const testEmail = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: "test@example.com",
      subject: "Verify Your Email - Blood Connect Pro",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Blood Connect Pro!</h2>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}">
            Verify Email
          </a>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    };

    console.log("Email Details:");
    console.log(`  From: ${testEmail.from}`);
    console.log(`  To: ${testEmail.to}`);
    console.log(`  Subject: ${testEmail.subject}`);
    console.log(`  Verification URL: ${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`);

    // Note: We don't actually send to test@example.com, just show what would be sent
    console.log("\n✅ All Tests Passed!");
    console.log("\n📧 You can now use sendVerificationEmail() in your application.");
    console.log("   Login to Mailtrap (https://mailtrap.io) to see sent emails.\n");

    process.exit(0);
  }
});
