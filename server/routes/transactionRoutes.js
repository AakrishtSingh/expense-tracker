const express = require("express");
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Add transaction
router.post("/", auth, async (req, res) => {
  try {
    const { type, category, amount, note } = req.body;
    const transaction = new Transaction({ ...req.body, userId: req.user.id });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Error creating transaction" });
  }
});

// Get all transactions
router.get("/", auth, async (req, res) => {
  try {
    const data = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

module.exports = router;
