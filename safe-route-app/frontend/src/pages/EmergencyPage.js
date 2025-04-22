import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmergencyPage.css';

const EmergencyPage = () => {
  const [emergencyNumbers, setEmergencyNumbers] = useState(null);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
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
        const countryCode = ipData.countryCode;

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

  // Handle emergency card click
  const handleEmergencyCardClick = (type) => {
    setActiveCard(type);
    setTimeout(() => {
      // Show info for 2 seconds then navigate home
      setTimeout(() => navigate('/'), 2000);
    }, 500);
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
        <p className="emergency-numbers-text">Emergency numbers for {countryName}:</p>
        <ul>
          {Object.entries(numberToServices).map(([number, services]) => (
            <li key={number}>
              {services.join(', ')}: <a href={`tel:${number}`} className="emergency-number">{number}</a>
            </li>
          ))}
        </ul>
      </>
    );
  };
  
  return (
    <div className="emergency-page">
      <h2>Emergency Assistance</h2>
      
      <div className="emergency-options">
        <div 
          className={`emergency-card medical ${activeCard === 'medical' ? 'active' : ''}`}
          onClick={() => handleEmergencyCardClick('medical')}
        >
          <div className="card-icon">🚑</div>
          <h3>Medical</h3>
          <p>For immediate medical assistance</p>
        </div>
        
        <div 
          className={`emergency-card fire ${activeCard === 'fire' ? 'active' : ''}`}
          onClick={() => handleEmergencyCardClick('fire')}
        >
          <div className="card-icon">🔥</div>
          <h3>Fire</h3>
          <p>For fire emergencies</p>
        </div>
        
        <div 
          className={`emergency-card police ${activeCard === 'police' ? 'active' : ''}`}
          onClick={() => handleEmergencyCardClick('police')}
        >
          <div className="card-icon">👮</div>
          <h3>Police</h3>
          <p>For security emergencies</p>
        </div>
        
        <div 
          className={`emergency-card disaster ${activeCard === 'disaster' ? 'active' : ''}`}
          onClick={() => handleEmergencyCardClick('disaster')}
        >
          <div className="card-icon">🌊</div>
          <h3>Natural Disaster</h3>
          <p>For flood, earthquake or other disasters</p>
        </div>
      </div>
      
      {activeCard && (
        <div className="emergency-alert">
          <p>Contacting emergency services for {activeCard} assistance...</p>
          <div className="pulse-indicator"></div>
        </div>
      )}
      
      <div className="emergency-contacts">
        <h3>Emergency Contacts</h3>
        {renderEmergencyContacts()}
      </div>
    </div>
  );
};

export default EmergencyPage;