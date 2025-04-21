import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("idToken");

    // 🧠 Debug log before setting
    console.log("🕵️‍♂️ Checking token from localStorage:", storedToken);

    setToken(storedToken);
    setTokenChecked(true);
  }, []);

  const userType = localStorage.getItem("userType");

  // 🧠 Debug logs
  console.log("🔐 TOKEN:", token);
  console.log("👤 USERTYPE:", userType);
  console.log("📍 PATHNAME:", location.pathname);

  if (!tokenChecked) return null; // Prevent flicker or false redirect

  if (!token) {
    console.log("⛔ No token found. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (
    location.pathname === "/upload-found" &&
    userType?.trim().toLowerCase() !== "staff"
  ) {
    console.log("⛔ Access denied: only staff can access /upload-found");
    return <Navigate to="/search-found" replace />;
  }

  return children;
};

export default ProtectedRoute;
