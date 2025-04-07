import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShelterDetails.css';

const ShelterDetails = () => {
  const { state } = useLocation();
  const { shelter } = state || {};

  if (!shelter) return <div>No shelter data available</div>;

  return (
    <div className="shelter-details">
      <h2>{shelter.name}</h2>
      <p>Type: {shelter.type.charAt(0).toUpperCase() + shelter.type.slice(1)}</p>
      <p className="coordinates">Latitude: {shelter.lat}</p>
      <p className="coordinates">Longitude: {shelter.lng}</p>
      <a
        className="directions-btn"
        href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Directions
      </a>
    </div>
  );
};

export default ShelterDetails;