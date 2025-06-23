import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction } from "../api/transaction";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    note: "",
  });

  const fetchData = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction(form);
    setForm({ type: "expense", category: "", amount: "", note: "" });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-xl font-bold text-green-700">₹{totalIncome}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Expense</h3>
          <p className="text-xl font-bold text-red-700">₹{totalExpense}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <select
            className="border p-2 rounded"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            required
          />
          <input
            type="text"
            placeholder="Note"
            className="border p-2 rounded"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Transaction
        </button>
      </form>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <ul>
          {transactions.map((t) => (
            <li key={t._id} className="border-b py-2 flex justify-between">
              <span>{t.category} ({t.note})</span>
              <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                ₹{t.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
