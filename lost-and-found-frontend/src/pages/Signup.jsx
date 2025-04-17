import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import { Link } from "react-router-dom";

import { signUpCognito } from "../authService";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ New

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    const role = "student";

    signUpCognito(
      name,
      email,
      password,
      role,
      (result) => {
        console.log("✅ Signup success:", result);
        alert("Account created! Check your email to verify.");
        navigate("/verify");
      },
      (err) => {
        console.error("❌ Signup failed:", err.message);
        alert("Signup failed: " + err.message);
      }
    );
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSignup}>
        <h2>Create Your Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "0px",
              top: "37%",
              transform: "translateY(-50%)",
              userSelect: "none"
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit">Create Account</button>
        <p className="login-redirect">
  Already have an account? <Link to="/login">Log in here</Link>
</p>


      </form>
    </div>
  );
};

export default Signup;
