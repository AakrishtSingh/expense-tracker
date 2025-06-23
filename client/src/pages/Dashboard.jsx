import React, { useState } from "react";
import PieChartCard from "../components/Charts/PieChartCard";
import { useTransactions } from "../context/TransactionContext";
import axios from "axios";

const Dashboard = () => {
  const { transactions, fetchTransactions } = useTransactions();
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/transactions", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ type: "income", category: "", amount: "", note: "" });
      fetchTransactions();
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };

  const incomeData = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => {
      const found = acc.find((a) => a.category === tx.category);
      if (found) found.amount += tx.amount;
      else acc.push({ category: tx.category, amount: tx.amount });
      return acc;
    }, []);

  const expenseData = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => {
      const found = acc.find((a) => a.category === tx.category);
      if (found) found.amount += tx.amount;
      else acc.push({ category: tx.category, amount: tx.amount });
      return acc;
    }, []);

  return (
    <div className="p-4 space-y-8">
      {/* Transaction Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow max-w-xl mx-auto space-y-4"
      >
        <div>
          <label className="block">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Note</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>

      {/* Charts Section */}
      <div className="flex flex-wrap gap-4 justify-center">
        <PieChartCard data={incomeData} title="Income by Category" />
        <PieChartCard data={expenseData} title="Expenses by Category" />
      </div>
    </div>
  );
};

export default Dashboard;
