// WelcomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      return setMessage('Enter a valid 10-digit number.');
    }

    try {
      setUpRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const phone = `+91${phoneNumber}`; // Adjust country code as needed
      
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setMessage('OTP sent successfully!');
    } catch (error) {
      console.error(error);
      setMessage(`Error sending OTP: ${error.message}`);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage('Please enter the OTP.');

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      setMessage('OTP verified successfully!');
      setTimeout(() => navigate('/home'), 1000);
    } catch (error) {
      console.error(error);
      setMessage(`Error verifying OTP: ${error.message}`);
    }
  };

  return (
    <div className="welcome-page">
      <div className="emergency-icons">
        <div className="icon-item"><i className="fas fa-ambulance"></i></div>
        <div className="icon-item"><i className="fas fa-fire-extinguisher"></i></div>
        <div className="icon-item"><i className="fas fa-first-aid"></i></div>
        <div className="icon-item"><i className="fas fa-exclamation-triangle"></i></div>
        <div className="icon-item"><i className="fas fa-phone-alt"></i></div>
        <div className="icon-item"><i className="fas fa-map-marked-alt"></i></div>
      </div>
      
      <div className="welcome-content">
        <div className="logo">
          <div className="logo-icon">SR</div>
        </div>
        
        <h1>Welcome to SafeRoute</h1>
        <p className="tagline">Your personal disaster response companion</p>
        
        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-location-arrow"></i>
            </div>
            <h3>Real-time Alerts</h3>
            <p>Get instant notifications about emergencies near you</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-route"></i>
            </div>
            <h3>Safe Navigation</h3>
            <p>Find the safest routes during disaster situations</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3>Emergency Resources</h3>
            <p>Access vital information and emergency contacts</p>
          </div>
        </div>
        
        <button className="login-btn" onClick={() => setShowRegister(true)}>
          <i className="fas fa-user-shield"></i> Login with Mobile
        </button>
        
        <div className="emergency-tips">
          <h4>Did you know?</h4>
          <p>Having an emergency plan can increase your chances of safety by up to 70% during disasters.</p>
        </div>
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
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default WelcomePage;