// validators/common.validator.js
const mongoose = require("mongoose");

// Middleware to validate MongoDB ObjectId in req.params.id
function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
  }
  next();
}

module.exports = { validateObjectId };
