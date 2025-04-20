import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("idToken");
    setToken(storedToken);
    setTokenChecked(true);
  }, []);

  const userType = localStorage.getItem("userType");

  // 🧠 Debug logs
  console.log("🔐 TOKEN:", token);
  console.log("👤 USERTYPE:", userType);
  console.log("📍 PATHNAME:", location.pathname);

  if (!tokenChecked) return null; // Wait for token check

  if (!token) {
    console.log("⛔ No token found. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (
    location.pathname === "/upload-found" &&
    userType?.trim().toLowerCase() !== "staff"
  ) {
    return <Navigate to="/search-found" replace />;
  }

  return children;
};

export default ProtectedRoute;