const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const { getUsers, getUserById, updateUser, deleteUser, getEligibility, updateMyProfile } = require("../controllers/userController");

router.get("/", protect, authorize("admin"), getUsers);
router.put("/update-profile", protect, updateMyProfile);
router.get("/:id", protect, getUserById);
router.get("/:id/eligibility", protect, getEligibility);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;
