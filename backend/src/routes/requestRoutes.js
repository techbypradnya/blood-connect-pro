const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const { protect } = require("../middlewares/auth");
const { createRequest, getRequests, updateRequest, deleteRequest } = require("../controllers/requestController");

router.post(
  "/",
  protect,
  [
    body("bloodGroup").isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).withMessage("Valid blood group is required"),
    body("unitsRequired").isInt({ min: 1, max: 10 }).withMessage("Units must be between 1 and 10"),
    body("hospitalName").trim().notEmpty().withMessage("Hospital name is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("contactNumber").notEmpty().withMessage("Contact number is required"),
  ],
  validate,
  createRequest
);

router.get("/", getRequests);
router.put("/:id", protect, updateRequest);
router.delete("/:id", protect, deleteRequest);

module.exports = router;
