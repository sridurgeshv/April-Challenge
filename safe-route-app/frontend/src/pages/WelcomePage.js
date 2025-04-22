import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import '../styles/WelcomePage.css';
import { useAuth } from '../contexts/AuthContext';

import ambulanceGif from '../assets/ambulance.gif';
import fireVehicleGif from '../assets/firetruck.gif';
import alertBoardGif from '../assets/alert.gif';
import phoneMapGif from '../assets/maps.gif';

const WelcomePage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Trigger initial animation
  useEffect(() => {
    setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
  }, []);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  // Set up RecaptchaVerifier when the register panel is shown
  useEffect(() => {
    if (showRegister && auth) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
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

    setLoadingOtp(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        setMessage('reCAPTCHA not initialized. Please reopen the panel.');
        setLoadingOtp(false);
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
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage('Please enter the OTP.');

    setLoadingVerify(true);
    try {
      await confirmationResult.confirm(otp);
      setMessage('OTP verified successfully!');
    } catch (error) {
      console.error('Verification error:', error);
      setMessage(`Error verifying OTP: ${error.message}`);
    } finally {
      setLoadingVerify(false);
    }
  };

  const closeRegisterPanel = () => {
    setShowRegister(false);
    setOtpSent(false);
    setPhoneNumber('');
    setOtp('');
    setMessage('');
  };

  return (
    <div className="welcome-page">
      <div className="app-title">
        <h1>Emergency Response System</h1>
        <p>Your safety is our priority</p>
      </div>
      
      <div className={`collage-container ${animationComplete ? 'loaded' : ''}`}>
        <div className="collage-item item-1" data-delay="0">
          <div className="item-content">
            <img src={ambulanceGif} alt="Ambulance emergency vehicle" />
            <div className="item-overlay">
              <h3>Medical Response</h3>
            </div>
          </div>
        </div>
        <div className="collage-item item-2" data-delay="0.2">
          <div className="item-content">
            <img src={fireVehicleGif} alt="Fire emergency vehicle" />
            <div className="item-overlay">
              <h3>Fire Services</h3>
            </div>
          </div>
        </div>
        <div className="collage-item center-item" data-delay="0.4">
          <div className="pulse-anim">
            <button className="login-btn" onClick={() => setShowRegister(true)}>
              <i className="fas fa-user-shield"></i> Login
            </button>
          </div>
        </div>
        <div className="collage-item item-3" data-delay="0.6">
          <div className="item-content">
            <img src={alertBoardGif} alt="Emergency alert board" />
            <div className="item-overlay">
              <h3>Alert System</h3>
            </div>
          </div>
        </div>
        <div className="collage-item item-4" data-delay="0.8">
          <div className="item-content">
            <img src={phoneMapGif} alt="Phone with emergency maps" />
            <div className="item-overlay">
              <h3>Location Services</h3>
            </div>
          </div>
        </div>
      </div>

      <div className={`overlay ${showRegister ? 'active' : ''}`} onClick={closeRegisterPanel}></div>

      <div className={`register-panel ${showRegister ? 'slide-in' : ''}`}>
        <button className="close-btn" onClick={closeRegisterPanel}>×</button>
        <div className="auth-header">
          <div className="auth-logo">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3>{otpSent ? 'Verify OTP' : 'Login with Mobile'}</h3>
        </div>
        <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="register-form">
          {!otpSent ? (
            <>
              <div className="input-group">
                <span className="prefix">+91</span>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
              </div>
              <button type="submit" disabled={loadingOtp}>
                {loadingOtp ? (
                  <span className="spinner"></span>
                ) : (
                  'Send OTP'
                )}
              </button>
            </>
          ) : (
            <>
              <div className="otp-container">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength="6"
                />
                <p className="otp-hint">OTP sent to +91 {phoneNumber}</p>
              </div>
              <button type="submit" disabled={loadingVerify}>
                {loadingVerify ? (
                  <span className="spinner"></span>
                ) : (
                  'Verify & Login'
                )}
              </button>
              <button 
                type="button" 
                className="back-btn" 
                onClick={() => {
                  setOtpSent(false);
                  setMessage('');
                }}
              >
                Back to Phone Number
              </button>
            </>
          )}
        </form>
        {message && <p className={`msg ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
        <div id="recaptcha-container"></div>
      </div>
      
      <footer className="page-footer">
        <p>© 2025 Emergency Response System</p>
      </footer>
    </div>
  );
};

export default WelcomePage;