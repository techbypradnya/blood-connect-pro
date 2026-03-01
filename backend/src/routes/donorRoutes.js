const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { getDonors, searchDonors, updateAvailability } = require("../controllers/donorController");

router.get("/", getDonors);
router.get("/search", searchDonors);
router.put("/availability", protect, updateAvailability);

module.exports = router;
