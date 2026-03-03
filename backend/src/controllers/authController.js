const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

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

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
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
    if (!user) {
      return res.status(404).json({ success: false, message: "No account with that email" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Blood Connect Pro — Password Reset",
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.fullName},</p>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
          <p>This link expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      res.json({ success: true, message: "Password reset email sent" });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }
  } catch (error) {
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
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
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
