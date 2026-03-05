const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const validate = require("../middlewares/validate");
const { protect } = require("../middlewares/auth");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtp,
  verifyEmail,
} = require("../controllers/authController");

// Register
router.post(
  "/register",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").matches(/^\+?[\d\s-]{10,15}$/).withMessage("Valid phone number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("bloodGroup")
      .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
      .withMessage("Valid blood group is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("role")
      .optional()
      .isIn(["donor", "recipient"])
      .withMessage("Role must be donor or recipient"),
  ],
  validate,
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// Forgot password
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  validate,
  forgotPassword
);

// Reset password
router.put(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")],
  validate,
  resetPassword
);

// Verify email
router.get("/verify-email/:token", verifyEmail);

// Phone OTP (protected — user must be logged in)
router.post("/send-otp", protect, sendOtp);
router.post(
  "/verify-otp",
  protect,
  [body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")],
  validate,
  verifyOtp
);

module.exports = router;
