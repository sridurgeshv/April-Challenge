import React, { useState, useEffect } from 'react';
import EmergencyContacts from '../components/EmergencyContacts/EmergencyContacts';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    phoneNumber: '',
    name: ''    
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch user data from an API or local storage
    // Mocking the data fetch with setTimeout
    setTimeout(() => {
      // Mock user data
      setUserData({
        phoneNumber: '+1 (555) 123-4567',
        name: 'John Doe'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleBackToMap = () => {
    window.location.href = '/map';
  };

  if (isLoading) {
    return <div className="profile-loader">Loading profile data...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-header-container">
        <button className="nav-back-button" onClick={handleBackToMap}>
          &larr; Back to Map
        </button>
        <h1>User Profile</h1>
      </div>

      <div className="profile-content-grid">
        <div className="profile-box account-box">
          <h2>Account Information</h2>
          <div className="account-field">
            <label>Phone Number (ID)</label>
            <div className="field-content">{userData.phoneNumber}</div>
          </div>
          <div className="account-field">
            <label>Name</label>
            <div className="field-content">{userData.name}</div>
          </div>          
          <button className="account-edit-btn">Edit Account Info</button>
        </div>

        <div className="profile-box emergency-box">
          <h2>Emergency Settings</h2>
          <EmergencyContacts />
        </div>

        <div className="profile-box preferences-box">
          <h2>App Preferences</h2>
          <div className="preference-row">
            <label>
              <input type="checkbox" defaultChecked /> 
              Receive disaster alerts
            </label>
          </div>
          <div className="preference-row">
            <label>
              <input type="checkbox" defaultChecked /> 
              Show global disasters by default
            </label>
          </div>
          <div className="preference-row">
            <label>
              <input type="checkbox" defaultChecked /> 
              Allow location access
            </label>
          </div>
          <div className="preference-row">
            <label>Distance Units</label>
            <select defaultValue="km">
              <option value="km">Kilometers</option>
              <option value="miles">Miles</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;