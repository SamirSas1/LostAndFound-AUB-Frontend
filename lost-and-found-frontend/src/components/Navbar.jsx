import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Navbar.css';

const Navbar = () => {
  const user = {
    email: "student@aub.edu.lb",
    role: "student", // change to "staff" to test role-based display
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/search-found">Search Items</Link>
        <Link to="/upload-lost">Upload Lost Item</Link>
        {user.role === "staff" && (
          <Link to="/upload-found">Upload Found Item</Link>
        )}
        <Link to="/my-items">My Uploads</Link>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
