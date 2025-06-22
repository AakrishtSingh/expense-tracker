const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user._id });
    res.status(201).json(expense);
  } catch {
    res.status(400).json({ message: 'Failed to add expense' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort('-date');
    res.json(expenses);
  } catch {
    res.status(500).json({ message: 'Could not fetch expenses' });
  }
};
