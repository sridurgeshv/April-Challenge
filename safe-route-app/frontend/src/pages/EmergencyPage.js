import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmergencyPage.css';

const EmergencyPage = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [emergencyNumbers, setEmergencyNumbers] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch emergency numbers based on user's location when component mounts
  useEffect(() => {
    const fetchEmergencyNumbers = async () => {
      try {
        // Step 1: Get country code from IP geolocation API
        const ipResponse = await fetch('http://localhost:5000/api/ip-location');
        if (!ipResponse.ok) {
          throw new Error('Failed to fetch location data');
        }
        const ipData = await ipResponse.json();
        const countryCode = ipData.countryCode; // 

        // Step 2: Fetch emergency numbers using the country code via proxy
        const emergencyResponse = await fetch(`http://localhost:5000/api/country/${countryCode}`);
        if (!emergencyResponse.ok) {
          throw new Error('Failed to fetch emergency numbers');
        }
        const emergencyData = await emergencyResponse.json();
        setEmergencyNumbers(emergencyData.data); // Store only the "data" object
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmergencyNumbers();
  }, []); // Empty dependency array means it runs once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Emergency reported! Type: ${emergencyType}`);
    navigate('/');
  };

  // Render emergency contacts based on fetched data
  const renderEmergencyContacts = () => {
    if (!emergencyNumbers) {
      return <p>Loading emergency numbers...</p>;
    }
  
    const numberToServices = {};
    const services = ['ambulance', 'fire', 'police', 'dispatch'];
  
    services.forEach((service) => {
      if (
        emergencyNumbers[service] &&
        emergencyNumbers[service].all?.length > 0 &&
        emergencyNumbers[service].all[0] !== ''
      ) {
        const number = emergencyNumbers[service].all[0];
        if (!numberToServices[number]) {
          numberToServices[number] = [];
        }
        numberToServices[number].push(service.charAt(0).toUpperCase() + service.slice(1));
      }
    });
  
    const countryName = emergencyNumbers.country?.name || 'your country';
    if (Object.keys(numberToServices).length === 0) {
      return <p>No emergency numbers available for {countryName}.</p>;
    }
  
    return (
      <>
        <p>Emergency numbers for {countryName}:</p>
        <ul>
          {Object.entries(numberToServices).map(([number, services]) => (
            <li key={number}>
              {services.join(', ')}: {number}
            </li>
          ))}
        </ul>
      </>
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
        <h3>Emergency Contacts</h3>
        {renderEmergencyContacts()}
      </div>
    </div>
  );
};

export default EmergencyPage;