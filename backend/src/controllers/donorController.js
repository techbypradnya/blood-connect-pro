const User = require("../models/User");

// @desc    Get all donors
// @route   GET /api/donors
// @access  Public
exports.getDonors = async (req, res, next) => {
  try {
    const donors = await User.find({ role: "donor", available: true }).select("-__v");
    res.json({ success: true, count: donors.length, data: donors });
  } catch (error) {
    next(error);
  }
};

// @desc    Search donors by blood group, city, state
// @route   GET /api/donors/search?bloodGroup=O+&city=Mumbai&state=Maharashtra
// @access  Public
exports.searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, state } = req.query;
    const filter = { role: "donor" };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");

    const donors = await User.find(filter).select("-__v");
    res.json({ success: true, count: donors.length, data: donors });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle donor availability
// @route   PUT /api/donors/availability
// @access  Private (donor only)
exports.updateAvailability = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== "donor") {
      return res.status(403).json({ success: false, message: "Only donors can update availability" });
    }

    user.available = req.body.available !== undefined ? req.body.available : !user.available;
    await user.save();

    res.json({
      success: true,
      data: { available: user.available },
    });
  } catch (error) {
    next(error);
  }
};
