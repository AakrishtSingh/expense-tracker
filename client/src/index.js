import React from "react";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
