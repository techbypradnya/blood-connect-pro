const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalDonors, activeDonors, totalRequests, pendingRequests] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "donor", available: true }),
        BloodRequest.countDocuments(),
        BloodRequest.countDocuments({ status: "pending" }),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        activeDonors,
        totalRequests,
        pendingRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};
