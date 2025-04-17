import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCognito } from "../authService";
import '../styles/Login.css';
import { Link } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ NEW
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    loginCognito(
      email,
      password,
      (tokens) => {
        console.log("✅ Login success:", tokens);
        localStorage.setItem("idToken", tokens.idToken);
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
            localStorage.setItem("idToken", idToken);
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
    navigate("/forgot-password");
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
            type={showPassword ? "text" : "password"} // ✅ toggle
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
