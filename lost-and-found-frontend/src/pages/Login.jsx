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
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>

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

        <button type="submit">Login</button>

        <button
          type="button"
          className="forgot-password-button"
          onClick={goToForgotPassword}
        >
          Forgot Password?
        </button>

        <p className="signup-redirect">
          Don’t have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
