const User = require("../models/User");
const { checkEligibility } = require("../utils/eligibility");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v");
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (self or admin)
exports.updateUser = async (req, res, next) => {
  try {
    // Only allow self or admin to update
    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this user" });
    }

    // Prevent role escalation
    if (req.body.role && req.user.role !== "admin") {
      delete req.body.role;
    }

    // Don't allow password update via this route
    delete req.body.password;

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compute eligibility after update
    const eligibility = checkEligibility(user.toObject());

    res.json({ success: true, data: user, eligibility });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donor eligibility status
// @route   GET /api/users/:id/eligibility
// @access  Private
exports.getEligibility = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const eligibility = checkEligibility(user.toObject());
    res.json({ success: true, data: eligibility });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (self or admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this user" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Update authenticated user's profile (self)
// @route   PUT /api/users/update-profile
// @access  Private
exports.updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Only allow specific fields to be updated here
    const allowed = [
      "fullName",
      "bloodGroup",
      "age",
      "weight",
      "height",
      "bmi",
      "phone",
      "city",
      "state",
      "lastDonationDate",
      "available",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Prevent password/role changes via this endpoint
    delete updates.password;
    delete updates.role;

    // Ensure updatedAt changes even on findByIdAndUpdate
    updates.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const eligibility = checkEligibility(updatedUser.toObject());
    res.json({ success: true, data: updatedUser, eligibility });
  } catch (error) {
    next(error);
  }
};
