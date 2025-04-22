import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShelterDetails.css';

const ShelterDetails = () => {
  const { state } = useLocation();
  const { shelter } = state || {};

  if (!shelter) return <div className="error-message">No shelter data available</div>;

  return (
    <div className="shelter-details-container">
      <h1 className="page-title">Shelter Details</h1>
      <div className="shelter-details">
        <h2 className="shelter-name">{shelter.name}</h2>
        <p className="shelter-type">Type: {shelter.type.charAt(0).toUpperCase() + shelter.type.slice(1)}</p>
        <div className="coordinates-container">
          <p className="coordinates">Latitude: {shelter.lat}</p>
          <p className="coordinates">Longitude: {shelter.lng}</p>
        </div>
        <a
          className="directions-btn"
          href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default ShelterDetails;