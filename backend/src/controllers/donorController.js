const User = require("../models/User");

// ---------------- GET ALL DONORS ----------------
exports.getDonors = async (req, res) => {
  try {
    console.log("GET /api/donors HIT ✅");

    const donors = await User.find({
      role: "donor",
      available: true
    }).select("-password -__v");

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- SEARCH DONORS ----------------
exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city, state } = req.query;

    const filter = {
      role: "donor",
      available: true
    };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");

    const donors = await User.find(filter).select("-password -__v");

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- UPDATE AVAILABILITY ----------------
exports.updateAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== "donor") {
      return res.status(403).json({
        success: false,
        message: "Only donors can update availability"
      });
    }

    user.available =
      req.body.available !== undefined
        ? req.body.available
        : !user.available;

    await user.save();

    res.json({
      success: true,
      data: { available: user.available }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};