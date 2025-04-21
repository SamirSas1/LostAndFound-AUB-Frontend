import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../cognitoConfig";

const Verify = () => {
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();

    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error("❌ Verification failed:", err.message);
        alert("Verification failed: " + err.message);
      } else {
        console.log("✅ Verification successful:", result);
        alert("Email verified! You can now log in.");
        navigate("/login");
      }
    });
  };

  return (
    <div className="verify-container">
      <form className="verify-box" onSubmit={handleVerify}>
        <h2>Verify Your Email</h2>
        <input
          type="email"
          placeholder="Email used during signup"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          required
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default Verify;
