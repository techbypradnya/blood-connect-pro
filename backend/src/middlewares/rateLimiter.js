const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific rate limiter for forgot password (more restrictive)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 forgot password requests per 15 minutes
  message: {
    success: false,
    message: "Too many password reset requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;
module.exports.forgotPasswordLimiter = forgotPasswordLimiter;
