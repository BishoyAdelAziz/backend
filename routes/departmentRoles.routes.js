// routes/departmentRoles.routes.js
const express = require("express");
const router = express.Router();
const DepartmentRole = require("../models/departmentRole.model");
const { authenticate, authorize } = require("../middleware/auth");

// Admin adds new role to department
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { department, role } = req.body;
    const newRole = await DepartmentRole.create({
      department,
      role,
      createdBy: req.user._id,
    });
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all roles for a department
router.get("/:department", authenticate, async (req, res) => {
  try {
    const roles = await DepartmentRole.find({
      department: req.params.department,
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin updates a role
router.patch("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const updatedRole = await DepartmentRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin deletes a role
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    await DepartmentRole.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
