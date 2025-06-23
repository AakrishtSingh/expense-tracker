// server/controllers/transactionController.js
const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.user._id, // ✅ Important
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error("💥 Transaction error:", err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error("💥 Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
