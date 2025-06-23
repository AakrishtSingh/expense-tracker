const express = require("express");
const { addTransaction, getTransactions } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);

module.exports = router;
