import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmergencyPage.css';

const EmergencyPage = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to emergency services
    alert(`Emergency reported! Type: ${emergencyType}`);
    navigate('/');
  };

  return (
    <div className="emergency-page">
      <h2>Emergency Assistance</h2>
      <div className="emergency-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Emergency Type:</label>
            <select 
              value={emergencyType} 
              onChange={(e) => setEmergencyType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              <option value="medical">Medical Emergency</option>
              <option value="fire">Fire</option>
              <option value="flood">Flood</option>
              <option value="earthquake">Earthquake</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the emergency"
              required
            />
          </div>
          <button type="submit" className="emergency-button">
            Request Emergency Help
          </button>
        </form>
      </div>
      <div className="emergency-contacts">
        <h3>Emergency Contacts</h3>
        <ul>
          <li>Police: 911</li>
          <li>Fire Department: 911</li>
          <li>Ambulance: 911</li>
          <li>Disaster Helpline: 1-800-123-4567</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyPage;