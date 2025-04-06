import React, { useState } from 'react';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      return setMessage('Enter a valid 10-digit number.');
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      setMessage(data.message || 'Registered successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Error registering number');
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
        <h3>Enter your mobile number</h3>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="10-digit mobile number"
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  );
};

export default WelcomePage;
