// models/departmentRole.model.js
const mongoose = require("mongoose");

const departmentRoleSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      enum: ["Software", "Marketing"],
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DepartmentRole", departmentRoleSchema);
