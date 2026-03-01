const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth");
const {
  getDonors,
  searchDonors,
  updateAvailability
} = require("../controllers/donorController");

// Get all donors
router.get("/", getDonors);

// Search donors
router.get("/search", searchDonors);

// Update availability (protected route)
router.put("/availability", protect, updateAvailability);

module.exports = router;