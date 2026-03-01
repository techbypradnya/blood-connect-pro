const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const { getDashboard } = require("../controllers/adminController");

router.get("/dashboard", protect, authorize("admin"), getDashboard);

module.exports = router;
