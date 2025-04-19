import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("idToken");
  const userType = localStorage.getItem("userType"); // "staff" or "student"
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Block students from accessing /upload-found
  if (location.pathname === "/upload-found" && userType !== "staff") {
    return <Navigate to="/search-found" replace />;
  }

  return children;
};

export default ProtectedRoute;
