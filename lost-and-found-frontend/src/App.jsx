import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import UploadLost from "./pages/UploadLost";
import UploadFound from "./pages/UploadFound";
import MyUploads from "./pages/MyUploads";
import ForgotPass from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import Verify from "./pages/verify";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffDashboard from "./pages/StaffDashboard";

// ✅ Layout wrapper that conditionally hides Navbar
const Layout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup", "/Forgot-Password", "/verify"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload["custom:role"];
        if (role) {
          localStorage.setItem("userType", role);
          console.log("✅ userType set:", role);
        } else {
          console.warn("⚠️ custom:role not found in token.");
        }
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/verify" element={<Verify />} />

          {/* Protected Routes */}
          <Route
            path="/search-found"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-lost"
            element={
              <ProtectedRoute>
                <UploadLost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-found"
            element={
              <ProtectedRoute>
                <UploadFound />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <MyUploads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Home redirect */}
          <Route
            path="/"
            element={
              localStorage.getItem("idToken")
                ? <Navigate to="/search-found" replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
