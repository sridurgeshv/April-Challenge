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
          age: '25', // Placeholder - would come from your user database
          bloodGroup: 'O+' // Placeholder - would come from your user database
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
    return <div className="emergency-profile__loader">Loading profile data...</div>;
  }

  return (
    <div className="emergency-profile">
      <div className="emergency-profile__header">
        <button className="emergency-profile__back-btn" onClick={handleBackToMap}>
          &larr; Back to Map
        </button>
        <h1 className="emergency-profile__title">Emergency Profile</h1>
      </div>

      <div className="emergency-profile__content">
        <div className="emergency-profile__user-info">
          <h2 className="emergency-profile__section-title">Personal Medical Information</h2>
          
          {isEditing ? (
            <div className="emergency-profile__edit-form">
              <div className="emergency-profile__field">
                <label className="emergency-profile__label">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="emergency-profile__input" 
                  value={editedData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="emergency-profile__field">
                <label className="emergency-profile__label">Phone Number</label>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  className="emergency-profile__input" 
                  value={editedData.phoneNumber} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="emergency-profile__field">
                <label className="emergency-profile__label">Age</label>
                <input 
                  type="text" 
                  name="age" 
                  className="emergency-profile__input" 
                  value={editedData.age} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="emergency-profile__field">
                <label className="emergency-profile__label">Blood Group</label>
                <select 
                  name="bloodGroup" 
                  className="emergency-profile__select" 
                  value={editedData.bloodGroup} 
                  onChange={handleInputChange}
                >
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
            <div className="emergency-profile__user-details">
              <div className="emergency-profile__info-card">
                <div className="emergency-profile__info-row">
                  <span className="emergency-profile__info-label">Name:</span>
                  <span className="emergency-profile__info-value">{userData.name}</span>
                </div>
                <div className="emergency-profile__info-row">
                  <span className="emergency-profile__info-label">Phone:</span>
                  <span className="emergency-profile__info-value">{userData.phoneNumber}</span>
                </div>
                <div className="emergency-profile__info-row">
                  <span className="emergency-profile__info-label">Age:</span>
                  <span className="emergency-profile__info-value">{userData.age}</span>
                </div>
                <div className="emergency-profile__info-row">
                  <span className="emergency-profile__info-label">Blood Group:</span>
                  <span className="emergency-profile__info-value emergency-profile__blood-type">{userData.bloodGroup}</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            className="emergency-profile__edit-btn" 
            onClick={toggleEdit}
          >
            {isEditing ? 'Save Information' : 'Edit Information'}
          </button>
        </div>

        <div className="emergency-profile__contacts">
          <EmergencyContacts />
        </div>

        <div className="emergency-profile__settings">
          <h2 className="emergency-profile__section-title">Emergency Settings</h2>
          
          <div className="emergency-profile__setting-row">
            <label className="emergency-profile__setting-label">
              <input type="checkbox" className="emergency-profile__checkbox" defaultChecked /> 
              Enable Emergency Alerts
            </label>
          </div>
          
          <div className="emergency-profile__setting-row">
            <label className="emergency-profile__setting-label">
              <input type="checkbox" className="emergency-profile__checkbox" defaultChecked /> 
              Auto-notify Emergency Contacts when SOS triggered
            </label>
          </div>
          
          <div className="emergency-profile__setting-row">
            <label className="emergency-profile__setting-label">
              <input type="checkbox" className="emergency-profile__checkbox" defaultChecked /> 
              Share location with Emergency Services
            </label>
          </div>
          
          <div className="emergency-profile__setting-row">
            <span className="emergency-profile__setting-text">SOS Button Mode</span>
            <select className="emergency-profile__select" defaultValue="single">
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