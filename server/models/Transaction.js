// server/models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  note: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This is CRUCIAL
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
