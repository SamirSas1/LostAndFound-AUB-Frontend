import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '../cognitoConfig';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: userPool });

    user.forgotPassword({
      onSuccess: () => {
        alert('✅ Verification code sent to your email');
        setStep(2);
      },
      onFailure: (err) => {
        alert('❌ Failed to send code: ' + err.message);
      }
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: userPool });

    user.confirmPassword(code, newPassword, {
      onSuccess: () => {
        alert('✅ Password reset successful! You can now log in.');
        navigate('/login');
      },
      onFailure: (err) => {
        alert('❌ Failed to reset password: ' + err.message);
      }
    });
  };

  return (
    <div className="forgot-la-container">
      <form
        className="forgot-la-card"
        onSubmit={step === 1 ? handleSendCode : handleResetPassword}
      >
        <h2 className="forgot-la-title">Reset Password</h2>

        {step === 1 && (
          <>
            <p className="forgot-la-subtitle">
              Enter your email to receive a reset code
            </p>
            <input
              type="email"
              className="forgot-la-input"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="forgot-la-button">
              Send Reset Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              className="forgot-la-input"
              placeholder="Verification Code"
              value={code}
              required
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="password"
              className="forgot-la-input"
              placeholder="New Password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" className="forgot-la-button">
              Reset Password
            </button>
          </>
        )}

        <p className="forgot-la-redirect-label">Remember your password?</p>
        <button
          type="button"
          className="forgot-la-redirect-button"
          onClick={() => navigate("/login")}
        >
          Login here
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
