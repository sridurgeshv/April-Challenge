import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import '../styles/WelcomePage.css';

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
  const navigate = useNavigate();

  // Set up RecaptchaVerifier when the register panel is shown
  useEffect(() => {
    if (showRegister && auth) {
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        console.error('reCAPTCHA container not found');
        setMessage('reCAPTCHA setup failed. Please try again.');
        return;
      }

      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            setMessage('reCAPTCHA expired. Please try again.');
          }
        });
      } catch (error) {
        console.error('Error initializing RecaptchaVerifier:', error);
        setMessage('Error setting up reCAPTCHA: ' + error.message);
      }
    }
  }, [showRegister, auth]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      return setMessage('Enter a valid 10-digit number.');
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        setMessage('reCAPTCHA not initialized. Please reopen the panel.');
        return;
      }

      const phone = `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setMessage('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage(`Error sending OTP: ${error.message}`);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage('Please enter the OTP.');

    try {
      const result = await confirmationResult.confirm(otp);
      console.log('User  signed in:', result.user);
      setMessage('OTP verified successfully!');
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setMessage(`Error verifying OTP: ${error.message}`);
    }
  };

  return (
    <div className="welcome-page">
      <div className="collage-container">
        <div className="collage-item item-1">
          <img src={ambulanceGif} alt="Ambulance emergency vehicle" />
        </div>
        <div className="collage-item item-2">
          <img src={fireVehicleGif} alt="Fire emergency vehicle" />
        </div>
        <div className="collage-item center-item">
          <button className="login-btn" onClick={() => setShowRegister(true)}>
            <i className="fas fa-user-shield"></i> Login
          </button>
        </div>
        <div className="collage-item item-3">
          <img src={alertBoardGif} alt="Emergency alert board" />
        </div>
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