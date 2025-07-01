/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Installment:
 *       type: object
 *       required:
 *         - amount
 *         - date
 *       properties:
 *         amount:
 *           type: number
 *           format: double
 *           minimum: 0
 *           description: Amount paid in this installment
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the installment payment
 *         notes:
 *           type: string
 *           description: Optional notes about the installment
 *     Client:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Client's full name
 *         email:
 *           type: string
 *           format: email
 *           description: Client's email address
 *         phone:
 *           type: string
 *           description: Client's primary phone number
 *         additionalPhones:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional phone numbers
 *     Project:
 *       type: object
 *       required:
 *         - projectName
 *         - budget
 *         - client
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated project ID
 *         projectName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Name of the project
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Project description
 *         budget:
 *           type: number
 *           format: double
 *           minimum: 0
 *           description: Total project budget
 *         deposit:
 *           type: number
 *           format: double
 *           minimum: 0
 *           description: Initial deposit amount
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Project start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Project estimated completion date
 *         status:
 *           type: string
 *           enum: [planned, active, on-hold, completed, cancelled]
 *           default: "planned"
 *           description: Current project status
 *         installments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Installment'
 *           description: Payment installments
 *         completionPercentage:
 *           type: number
 *           format: double
 *           minimum: 0
 *           maximum: 100
 *           description: Percentage of budget paid
 *         client:
 *           $ref: '#/components/schemas/Client'
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the project
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Project creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Project last update timestamp
 *         pendingEdit:
 *           type: object
 *           description: Proposed edits awaiting approval
 *         editRequestedBy:
 *           type: string
 *           description: ID of user who requested edit
 *         editStatus:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Status of edit request
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all projects (filtered by role)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, active, on-hold, completed, cancelled]
 *         description: Filter by project status
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: Filter by client name or ID
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               budget:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *               deposit:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [planned, active, on-hold, completed, cancelled]
 *               installments:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Installment'
 *               client:
 *                 $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/projects/{id}/request-edit:
 *   post:
 *     summary: Request project edit (moderator)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *               installments:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Installment'
 *     responses:
 *       200:
 *         description: Edit request submitted for approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input data or no changes requested
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/projects/{id}/approve-edit:
 *   post:
 *     summary: Approve/reject edit request (admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approve:
 *                 type: boolean
 *                 description: Whether to approve the edit
 *               notes:
 *                 type: string
 *                 description: Optional notes about the decision
 *     responses:
 *       200:
 *         description: Edit request processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: No pending edit request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

const express = require("express");
const router = express.Router();
const Project = require("../models/project.model");
const { authenticate, authorize } = require("../middleware/auth");

// Helper function to calculate completion percentage
const calculateCompletion = (installments = [], budget = 0) => {
  if (budget <= 0) return 0;
  const totalPaid = installments.reduce((sum, i) => sum + (i.amount || 0), 0);
  return Math.min(100, (totalPaid / budget) * 100);
};

// Create new project (Admin/Moderator)
router.post(
  "/",
  authenticate,
  authorize(["admin", "moderator"]),
  async (req, res) => {
    try {
      const { installments = [], budget = 0, ...projectData } = req.body;

      const project = new Project({
        ...projectData,
        installments,
        budget,
        completionPercentage: calculateCompletion(installments, budget),
        createdBy: req.user.id,
        status: "planned",
      });

      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all projects (with role-based filtering)
router.get("/", authenticate, async (req, res) => {
  try {
    const { status, client } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (client) {
      filter.$or = [
        { "client.name": { $regex: client, $options: "i" } },
        { "client.email": { $regex: client, $options: "i" } },
      ];
    }

    let projects = await Project.find(filter);

    // Filter sensitive data for non-admin/moderator users
    if (!["admin", "moderator"].includes(req.user.role)) {
      projects = projects.map((p) => {
        const project = p.toObject();
        delete project.budget;
        delete project.deposit;
        delete project.installments;
        delete project.completionPercentage;
        return project;
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get("/:id", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check permissions for sensitive data
    if (!["admin", "moderator"].includes(req.user.role)) {
      const filteredProject = project.toObject();
      delete filteredProject.budget;
      delete filteredProject.deposit;
      delete filteredProject.installments;
      delete filteredProject.completionPercentage;
      return res.json(filteredProject);
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project (Admin only)
router.patch("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { installments, budget, ...updateData } = req.body;
    const update = { ...updateData };

    if (installments !== undefined) update.installments = installments;
    if (budget !== undefined) update.budget = budget;

    // Recalculate completion if installments or budget changed
    if (installments !== undefined || budget !== undefined) {
      const project = await Project.findById(req.params.id);
      const currentBudget = budget !== undefined ? budget : project.budget;
      const currentInstallments =
        installments !== undefined ? installments : project.installments;
      update.completionPercentage = calculateCompletion(
        currentInstallments,
        currentBudget
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project (Admin only)
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request edit (Moderator)
router.post(
  "/:id/request-edit",
  authenticate,
  authorize(["moderator"]),
  async (req, res) => {
    try {
      const { budget, installments } = req.body;

      if (!budget && !installments) {
        return res.status(400).json({ message: "No changes requested" });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if there's already a pending request
      if (project.editStatus === "pending") {
        return res
          .status(400)
          .json({ message: "Edit request already pending" });
      }

      // Prepare the edit request
      project.pendingEdit = {};
      if (budget !== undefined) project.pendingEdit.budget = budget;
      if (installments !== undefined)
        project.pendingEdit.installments = installments;

      project.editRequestedBy = req.user.id;
      project.editStatus = "pending";

      await project.save();

      res.json({
        message: "Edit request submitted for admin approval",
        project,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Approve/reject edit (Admin)
router.post(
  "/:id/approve-edit",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { approve, notes } = req.body;
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.editStatus !== "pending") {
        return res.status(400).json({ message: "No pending edit request" });
      }

      if (approve) {
        // Apply the approved changes
        if (project.pendingEdit.budget !== undefined) {
          project.budget = project.pendingEdit.budget;
        }
        if (project.pendingEdit.installments !== undefined) {
          project.installments = project.pendingEdit.installments;
        }

        // Recalculate completion
        project.completionPercentage = calculateCompletion(
          project.installments,
          project.budget
        );

        project.editStatus = "approved";
        project.editNotes = notes || "Edit approved";
      } else {
        project.editStatus = "rejected";
        project.editNotes = notes || "Edit rejected";
      }

      // Clear the pending edit
      project.pendingEdit = undefined;
      await project.save();

      res.json({
        message: approve ? "Edit approved and applied" : "Edit rejected",
        project,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
