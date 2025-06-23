import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://expense-tracker-1v9a.onrender.com/api",
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
