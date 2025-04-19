import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmergencyPage.css';

const EmergencyPage = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [emergencyNumbers, setEmergencyNumbers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          // Get country from coordinates
          getCountryFromCoordinates(latitude, longitude);
        },
        err => {
          setError('Unable to retrieve your location. Showing default emergency numbers.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Showing default emergency numbers.');
      setLoading(false);
    }
  }, []);

  const getCountryFromCoordinates = async (latitude, longitude) => {
    try {
      // Using a reverse geocoding service to get country code from coordinates
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const data = await response.json();
      
      if (data && data.countryCode) {
        setCountryCode(data.countryCode.toLowerCase());
        fetchEmergencyNumbers(data.countryCode.toLowerCase());
      } else {
        throw new Error('Unable to determine country from coordinates');
      }
    } catch (err) {
      setError('Error determining your location. Showing default emergency numbers.');
      setLoading(false);
    }
  };

  const fetchEmergencyNumbers = async (countryCode) => {
    try {
      // Fetch emergency numbers for the user's country
      const response = await fetch(`/api/emergency-numbers/${countryCode}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency numbers');
      }
      
      const data = await response.json();
      setEmergencyNumbers(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching emergency numbers. Showing default emergency numbers.');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to emergency services
    alert(`Emergency reported! Type: ${emergencyType}`);
    navigate('/');
  };

  // Render emergency numbers based on location data
  const renderEmergencyContacts = () => {
    if (loading) {
      return <p>Loading emergency contacts for your location...</p>;
    }

    if (error || !emergencyNumbers) {
      // Default US numbers if we can't get location-specific ones
      return (
        <ul>
          <li>Police: 921</li>
          <li>Fire Department: 911</li>
          <li>Ambulance: 911</li>
          <li>Disaster Helpline: 1-800-123-4567</li>
        </ul>
      );
    }

    return (
      <ul>
        {emergencyNumbers.data.police.all && emergencyNumbers.data.police.all[0] && (
          <li>Police: {emergencyNumbers.data.police.all[0]}</li>
        )}
        
        {emergencyNumbers.data.fire.all && emergencyNumbers.data.fire.all[0] && (
          <li>Fire Department: {emergencyNumbers.data.fire.all[0]}</li>
        )}
        
        {emergencyNumbers.data.ambulance.all && emergencyNumbers.data.ambulance.all[0] && (
          <li>Ambulance: {emergencyNumbers.data.ambulance.all[0]}</li>
        )}
        
        {emergencyNumbers.data.dispatch.all && emergencyNumbers.data.dispatch.all[0] && (
          <li>Emergency Dispatch: {emergencyNumbers.data.dispatch.all[0]}</li>
        )}
        
        {(!emergencyNumbers.data.police.all || !emergencyNumbers.data.police.all[0]) && 
         (!emergencyNumbers.data.fire.all || !emergencyNumbers.data.fire.all[0]) && 
         (!emergencyNumbers.data.ambulance.all || !emergencyNumbers.data.ambulance.all[0]) && 
         emergencyNumbers.data.dispatch.all && emergencyNumbers.data.dispatch.all[0] && (
          <li>General Emergency: {emergencyNumbers.data.dispatch.all[0]}</li>
        )}
        
        <li>International Emergency: 112</li>
      </ul>
    );
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
        <h3>Emergency Contacts {countryCode && `for ${countryCode.toUpperCase()}`}</h3>
        {renderEmergencyContacts()}
      </div>
    </div>
  );
};

export default EmergencyPage;