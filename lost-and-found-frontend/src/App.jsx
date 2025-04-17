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

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/" ||
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
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPass />} /> {/* ✅ Route added */}
          <Route path="/search-found" element={<Search />} />
          <Route path="/upload-lost" element={<UploadLost />} />
          <Route path="/upload-found" element={<UploadFound />} />
          <Route path="/my-items" element={<MyUploads />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
