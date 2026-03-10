const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../services/emailService");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role, bloodGroup, city, state } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role,
      bloodGroup,
      city,
      state,
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      console.log(`\n📧 Attempting to send verification email to: ${user.email}`);
      
      await sendVerificationEmail({
        to: user.email,
        fullName: user.fullName,
        verificationToken,
      });

      console.log(`✅ Verification email sent successfully to: ${user.email}\n`);

      res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          bloodGroup: user.bloodGroup,
          city: user.city,
          state: user.state,
          available: user.available,
          isVerified: user.isVerified,
        },
      });
    } catch (emailError) {
      console.error(`❌ Email sending failed for ${user.email}:`, emailError);
      
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Check backend logs for details. Please try again later.",
        error: process.env.NODE_ENV === "development" ? emailError.message : undefined,
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in. Check your inbox for the verification link.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        city: user.city,
        state: user.state,
        available: user.available,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      console.log(`❌ Password reset requested for non-existent email: ${req.body.email}`);
      return res.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    try {
      console.log(`\n📧 Attempting to send password reset email to: ${user.email}`);
      
      await sendPasswordResetEmail({
        to: user.email,
        fullName: user.fullName,
        resetToken,
      });

      console.log(`✅ Password reset email sent successfully to: ${user.email}\n`);

      res.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });
    } catch (emailErr) {
      console.error(`❌ Failed to send password reset email to ${user.email}:`, emailErr.message);
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }
  } catch (error) {
    console.error("❌ Error in forgotPassword:", error.message);
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log(`❌ Invalid or expired reset token attempted: ${req.params.token.substring(0, 10)}...`);
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log(`✅ Password reset successful for user: ${user.email}`);

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Error in resetPassword:", error.message);
    next(error);
  }
};

// @desc    Send phone OTP
// @route   POST /api/auth/send-otp
// @access  Private
exports.sendOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = user.getPhoneOtp();
    await user.save({ validateBeforeSave: false });

    // TODO: Integrate with an SMS service (Twilio, AWS SNS, etc.)
    // For development, log OTP to console
    console.log(`[DEV] Phone OTP for ${user.phone}: ${otp}`);

    res.json({ success: true, message: "OTP sent to your phone number" });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify phone OTP
// @route   POST /api/auth/verify-otp
// @access  Private
exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      _id: req.user._id || req.user.id,
      phoneOtp: hashedOtp,
      phoneOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.phoneVerified = true;
    user.phoneOtp = undefined;
    user.phoneOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Phone number verified successfully" });
  } catch (error) {
    next(error);
  }
};
// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: "Verification token is required" });
    }

    // Hash the token to match the one stored in the database
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching verification token and check if it hasn't expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token. Please register again.",
      });
    }

    // Mark email as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};