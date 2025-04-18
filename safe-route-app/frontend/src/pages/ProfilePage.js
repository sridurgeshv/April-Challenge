import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import EmergencyContacts from '../components/EmergencyContacts/EmergencyContacts';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    phoneNumber: '',
    name: '',
    age: '',
    bloodGroup: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // In a real app, you'd fetch additional info like age and blood group from your database
        setUserData({
          phoneNumber: user.phoneNumber || '',
          name: user.displayName || 'User',
          age: '', // No placeholder data
          bloodGroup: '' // No placeholder data
        });
      } else {
        window.location.href = '/';
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleBackToMap = () => {
    window.location.href = '/map';
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save logic would go here
      setUserData({...userData, ...editedData});
      setIsEditing(false);
    } else {
      setEditedData({...userData});
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  if (isLoading) {
    return <div className="profile-page__loader">Loading profile data...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <button className="profile-page__back-btn" onClick={handleBackToMap}>
          &larr; Back to Map
        </button>
        <h1 className="profile-page__title">My Profile</h1>
      </div>

      <div className="profile-page__content">
        <div className="profile-page__user-info">
          <h2 className="profile-page__section-title">Personal Information</h2>
          
          {isEditing ? (
            <div className="profile-page__edit-form">
              <div className="profile-page__field">
                <label className="profile-page__label">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="profile-page__input" 
                  value={editedData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="profile-page__field">
                <label className="profile-page__label">Phone Number</label>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  className="profile-page__input" 
                  value={editedData.phoneNumber} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="profile-page__field">
                <label className="profile-page__label">Age</label>
                <input 
                  type="text" 
                  name="age" 
                  className="profile-page__input" 
                  value={editedData.age} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="profile-page__field">
                <label className="profile-page__label">Blood Group</label>
                <select 
                  name="bloodGroup" 
                  className="profile-page__select" 
                  value={editedData.bloodGroup} 
                  onChange={handleInputChange}
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="profile-page__user-details">
              <div className="profile-page__info-card">
                <div className="profile-page__info-row">
                  <span className="profile-page__info-label">Name:</span>
                  <span className="profile-page__info-value">{userData.name}</span>
                </div>
                <div className="profile-page__info-row">
                  <span className="profile-page__info-label">Phone:</span>
                  <span className="profile-page__info-value">{userData.phoneNumber}</span>
                </div>
                <div className="profile-page__info-row">
                  <span className="profile-page__info-label">Age:</span>
                  <span className="profile-page__info-value">{userData.age || 'Not specified'}</span>
                </div>
                <div className="profile-page__info-row">
                  <span className="profile-page__info-label">Blood Group:</span>
                  <span className="profile-page__info-value profile-page__blood-type">{userData.bloodGroup || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            className="profile-page__edit-btn" 
            onClick={toggleEdit}
          >
            {isEditing ? 'Save Information' : 'Edit Information'}
          </button>
        </div>

        <div className="profile-page__contacts">
          <EmergencyContacts />
        </div>

        <div className="profile-page__settings">
          <h2 className="profile-page__section-title">Emergency Settings</h2>
          
          <div className="profile-page__setting-row">
            <label className="profile-page__setting-label">
              <input type="checkbox" className="profile-page__checkbox" defaultChecked /> 
              Enable Emergency Alerts
            </label>
          </div>
          
          <div className="profile-page__setting-row">
            <label className="profile-page__setting-label">
              <input type="checkbox" className="profile-page__checkbox" defaultChecked /> 
              Auto-notify Emergency Contacts when SOS triggered
            </label>
          </div>
          
          <div className="profile-page__setting-row">
            <label className="profile-page__setting-label">
              <input type="checkbox" className="profile-page__checkbox" defaultChecked /> 
              Share location with Emergency Services
            </label>
          </div>
          
          <div className="profile-page__setting-row">
            <span className="profile-page__setting-text">SOS Button Mode</span>
            <select className="profile-page__select" defaultValue="single">
              <option value="single">Single Press</option>
              <option value="double">Double Press</option>
              <option value="hold">Hold for 3 Seconds</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;