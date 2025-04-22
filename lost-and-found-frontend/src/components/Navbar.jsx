import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {    
    localStorage.removeItem("idToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userType"); // ✅ This line is crucial
    navigate("/login");
    console.log("Logged out...");
  };  

  return (
    <nav className="navbar">
      
      <div className="navbar-links">
        <Link to="/search-found">Search Items</Link>
        <Link to="/upload-lost">Upload Lost Item</Link>

        {/* ✅ Show this only if user is staff */}
        {user?.["custom:role"] === "staff" && (
          <Link to="/upload-found">Upload Found Item</Link>
        )}
        {user?.["custom:role"] === "staff" && (
          <Link to="/staff-dashboard">Staff Dashboard</Link>
        )}

        <Link to="/my-items">My Uploads</Link>
      </div>
      

      {/* ✅ Optional: show user email or name */}
      <div className="navbar-user">
  {user && <span>{user.name || user.email}</span>}

  <button className="theme-toggle" onClick={() => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }}>
    🌓
  </button>

  <button onClick={handleLogout}>Logout</button>
</div>

    </nav>
  );
};

export default Navbar;
