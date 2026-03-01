const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;
