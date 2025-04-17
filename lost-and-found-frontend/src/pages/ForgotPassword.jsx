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
    <div className="forgot-password-container">
      <form
        className="forgot-password-card"
        onSubmit={step === 1 ? handleSendCode : handleResetPassword}
      >
        <h2 className="title">Reset Password</h2>

        {step === 1 && (
          <>
            <p className="subtitle">Enter your email to receive a reset code</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Reset Code</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              required
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
          </>
        )}

        <p className="back-to-login">Remember your password?</p>
        <button
          type="button"
          className="login-redirect"
          onClick={() => navigate('/login')}
        >
          Login here
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
