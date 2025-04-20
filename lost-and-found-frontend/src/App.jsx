import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
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

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
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
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/verify" element={<Verify />} />

          {/* ✅ Protected Routes */}
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
          {/* ✅ Root redirect based on login */}
          <Route
            path="/"
            element={
              localStorage.getItem("idToken")
                ? <Navigate to="/search-found" replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* ✅ Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
