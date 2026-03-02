const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    unitsRequired: {
      type: Number,
      required: [true, "Units required is required"],
      min: [1, "At least 1 unit is required"],
      max: [10, "Cannot request more than 10 units"],
    },
    hospitalName: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    emergency: {
      type: Boolean,
      default: false,
    },
    emergencyNotifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending",
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
