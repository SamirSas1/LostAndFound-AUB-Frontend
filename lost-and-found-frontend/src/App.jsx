import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import UploadLost from "./pages/UploadLost";
import UploadFound from "./pages/UploadFound";
import MyUploads from "./pages/MyUploads";
import ForgotPass from "./pages/ForgotPassword"; // ✅ Import the page
import Navbar from "./components/Navbar";
import Verify from "./pages/verify";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ import
import { Navigate } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password"; // ✅ Hide navbar on ForgotPass too

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/verify" element={<Verify />} />

          {/* ✅ All other routes are protected */}
          <Route path="/signup" element={<Signup />} />
<Route path="/forgot-password" element={<ForgotPass />} />

          <Route
            path="/verify"
            element={
             
                <Verify />
              
            }
          />
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
            path="/"
            element={
              localStorage.getItem("idToken")
                ? <Navigate to="/search-found" replace />
                : <Navigate to="/login" replace />
            }
          />
          
          {/* ✅ Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

      </Layout>
    </Router>
  );
}

export default App;