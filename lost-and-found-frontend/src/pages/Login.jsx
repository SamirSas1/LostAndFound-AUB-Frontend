import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCognito } from "../authService";
import { jwtDecode } from "jwt-decode";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    loginCognito(
      email,
      password,
      (tokens) => {
        const idToken = tokens.idToken;
        const userInfo = jwtDecode(idToken);

        console.log("✅ Login success:", userInfo);

        // 🧠 Extract role and store everything
        const role = userInfo["custom:role"];
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        if (role) {
          localStorage.setItem("userType", role);
          console.log("✅ userType set at login:", role);
        } else {
          console.warn("⚠️ custom:role not found in decoded token.");
        }

        navigate("/search-found");
      },
      (err) => {
        alert("Login failed: " + err.message);
      },
      (user, userAttributes, requiredAttributes) => {
        const newPassword = prompt("Enter a new password to complete your first-time login:");

        user.completeNewPasswordChallenge(newPassword, {}, {
          onSuccess: (result) => {
            const idToken = result.getIdToken().getJwtToken();
            const userInfo = jwtDecode(idToken);

            const role = userInfo["custom:role"];
            localStorage.setItem("idToken", idToken);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            if (role) {
              localStorage.setItem("userType", role);
              console.log("✅ userType set after password reset:", role);
            } else {
              console.warn("⚠️ custom:role not found in decoded token.");
            }

            navigate("/search-found");
          },
          onFailure: (err) => {
            alert("Password reset failed: " + err.message);
          }
        });
      }
    );
  };

  const goToForgotPassword = () => {
    navigate("/Forgot-Password");
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

      <form className="login-la-box" onSubmit={handleLogin}>
        <h1 className="login-la-title">Lost and Found AUB</h1>
        <h2 className="login-la-subtitle">Welcome Back</h2>

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
            role="button"
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" className="login-la-button">Login</button>

        <button
          type="button"
          className="login-la-forgot-password"
          onClick={goToForgotPassword}
        >
          Forgot Password?
        </button>

        <p className="login-la-signup-text">
          Don’t have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
};


export default Login;
