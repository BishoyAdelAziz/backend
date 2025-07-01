/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 */

const express = require("express");
const router = express.Router();
const Client = require("../models/client.model");
const { authenticate } = require("../middleware/auth");
// Get all clients
router.get("/", authenticate, async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

// Get client by ID
router.get("/:id", authenticate, async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json(client);
});

// Create client
router.post("/", authenticate, async (req, res) => {
  const client = await Client.create(req.body);
  res.json(client);
});

// Update client
router.patch("/:id", authenticate, async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json(client);
});

// Delete client
router.delete("/:id", authenticate, async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json({ message: "Client deleted" });
});

module.exports = router;

module.exports = router;
