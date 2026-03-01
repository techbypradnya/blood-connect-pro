const BloodRequest = require("../models/BloodRequest");

// @desc    Create blood request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
  try {
    req.body.requestedBy = req.user._id;
    const request = await BloodRequest.create(req.body);
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blood requests
// @route   GET /api/requests
// @access  Public
exports.getRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find()
      .populate("requestedBy", "fullName email phone")
      .populate("acceptedBy", "fullName email phone")
      .sort("-createdAt");
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status / accept request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // If a donor is accepting the request
    if (req.body.status === "accepted" && req.user.role === "donor") {
      request.acceptedBy = req.user._id;
      request.status = "accepted";
    } else if (
      request.requestedBy.toString() === req.user._id.toString() ||
      req.user.role === "admin"
    ) {
      // Owner or admin can update status
      if (req.body.status) request.status = req.body.status;
    } else {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await request.save();
    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (owner or admin)
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.requestedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await request.deleteOne();
    res.json({ success: true, message: "Request deleted" });
  } catch (error) {
    next(error);
  }
};
