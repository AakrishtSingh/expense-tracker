import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-1v9a.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const addTransaction = (data) => API.post("/transactions", data);
export const getTransactions = () => API.get("/transactions");
