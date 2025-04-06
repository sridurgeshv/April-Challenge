// WelcomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      return setMessage('Enter a valid 10-digit number.');
    }

    try {
      const response = await fetch('http://localhost:5000/api/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error sending OTP');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage('Please enter the OTP.');

    try {
      const response = await fetch('http://localhost:5000/api/register/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error verifying OTP');
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1>Welcome to SafeRoute 🌍</h1>
        <p>Your personal disaster response companion</p>
        <button onClick={() => setShowRegister(true)}>
          Login with Mobile Number
        </button>
      </div>

      <div className={`register-panel ${showRegister ? 'slide-in' : ''}`}>
        <button className="close-btn" onClick={() => setShowRegister(false)}>×</button>
        <h3>{otpSent ? 'Enter OTP' : 'Enter your mobile number'}</h3>
        <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="register-form">
          {!otpSent ? (
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="10-digit mobile number"
            />
          ) : (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
          )}
          <button type="submit">{otpSent ? 'Verify OTP' : 'Send OTP'}</button>
        </form>
        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  );
};

export default WelcomePage;
