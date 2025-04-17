import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password email sent to:', email);
    // Send reset request to backend here
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-card" onSubmit={handleSubmit}>
        <h2 className="title">Reset Password</h2>
        <p className="subtitle">Enter your email to receive a reset link</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Link</button>

        <p className="back-to-login">
          Remember your password?{' '}          
        </p>
        <button
            type="button"
            className="login-redirect"
            onClick={() => navigate('/')}
          >
            Login here
          </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
