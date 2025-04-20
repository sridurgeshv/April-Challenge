import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import '../styles/WelcomePage.css';

// Import GIF assets
import ambulanceGif from '../assets/ambulance.gif';
import fireVehicleGif from '../assets/firetruck.gif';
import alertBoardGif from '../assets/alert.gif';
import phoneMapGif from '../assets/map.gif';

const WelcomePage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [animateTitle, setAnimateTitle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start title animation after component mount
    const titleInterval = setInterval(() => {
      setAnimateTitle(prev => !prev);
    }, 3000);
    
    return () => clearInterval(titleInterval);
  }, []);

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, auth);
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
      <div className="collage-container">
        {/* Top left - Ambulance GIF */}
        <div className="collage-item item-1">
          <img src={ambulanceGif} alt="Ambulance emergency vehicle" />
        </div>
        
        {/* Top right - Fire Vehicle GIF */}
        <div className="collage-item item-2">
          <img src={fireVehicleGif} alt="Fire emergency vehicle" />
        </div>
        
        {/* Center - Login button */}
        <div className="collage-item center-item">
          <div className={`title-container ${animateTitle ? 'pulse' : ''}`}>
            <h1 className="dynamic-title">SafeRoute</h1>
          </div>
          <button className="login-btn" onClick={() => setShowRegister(true)}>
            <i className="fas fa-user-shield"></i> Login
          </button>
        </div>
        
        {/* Bottom left - Alert Board GIF */}
        <div className="collage-item item-3">
          <img src={alertBoardGif} alt="Emergency alert board" />
        </div>
        
        {/* Bottom right - Phone Map GIF */}
        <div className="collage-item item-4">
          <img src={phoneMapGif} alt="Phone with emergency maps" />
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
