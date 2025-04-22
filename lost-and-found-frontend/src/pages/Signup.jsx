import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";
import { signUpCognito } from "../authService";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        navigate("/verify", { state: { email } });
      },
      (err) => {
        console.error("❌ Signup failed:", err.message);
        alert("Signup failed: " + err.message);
      }
    );
  };

  return (
    <div className="login-la-container">
      <button
        className="login-la-theme-toggle-btn"
        onClick={() => {
          const isDark = document.body.classList.toggle("dark-mode");
          localStorage.setItem("theme", isDark ? "dark" : "light");
        }}
      >
        🌓
      </button>
      <form className="login-la-box" onSubmit={handleSignup}>
        <h2 className="login-la-title">Create Your Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="login-la-input"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="login-la-input"
        />

        <div className="login-la-password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="login-la-password-input"
          />
          <span
            className="login-la-toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" className="login-la-button">Create Account</button>

        <p className="login-la-redirect">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
