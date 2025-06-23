import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import bgImage from "../images/back.avif";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    note: "",
  });

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/transactions", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ type: "expense", category: "", amount: "", note: "" });
      fetchTransactions();
    } catch (err) {
      console.error("Error adding transaction", err);
    }
  };

  const groupByCategory = (type) => {
    return transactions
      .filter((tx) => tx.type === type)
      .reduce((acc, tx) => {
        const found = acc.find((a) => a.category === tx.category);
        if (found) found.amount += Number(tx.amount);
        else acc.push({ category: tx.category, amount: Number(tx.amount) });
        return acc;
      }, []);
  };

  const prepareChartData = (data) => ({
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: ["#4CAF50", "#FF6384", "#36A2EB", "#FFCE56", "#7e22ce"],
        borderWidth: 1,
      },
    ],
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          `url(${bgImage})`,
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 p-4 space-y-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Transaction Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 p-6 rounded shadow max-w-xl mx-auto space-y-4 text-black"
        >
          <div className="grid grid-cols-2 gap-4">
            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="note"
              placeholder="Note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </form>

        {/* Transaction List */}
        <div className="bg-white/90 p-4 rounded shadow max-w-xl mx-auto text-black">
          <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>
          <ul className="divide-y">
            {transactions.map((tx) => (
              <li key={tx._id} className="py-2 flex justify-between text-sm">
                <div>
                  <p className="font-medium">{tx.note}</p>
                  <p className="text-gray-500">{tx.category}</p>
                </div>
                <span
                  className={`${
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  ₹{tx.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Charts */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="w-72 bg-white/90 p-4 rounded shadow text-black">
            <h3 className="text-center font-semibold mb-2">Income by Category</h3>
            <Pie data={prepareChartData(groupByCategory("income"))} />
          </div>
          <div className="w-72 bg-white/90 p-4 rounded shadow text-black">
            <h3 className="text-center font-semibold mb-2">Expenses by Category</h3>
            <Pie data={prepareChartData(groupByCategory("expense"))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
