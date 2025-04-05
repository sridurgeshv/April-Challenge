import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the new CSS file

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Disaster Response System</h1>
      <div className="homepage-action-buttons">
        <Link to="/map" className="btn btn-primary">
          View Disaster Map
        </Link>
        <Link to="/emergency" className="btn btn-secondary">
          Emergency Assistance
        </Link>
      </div>
      <div className="homepage-quick-info">
        <h3 className="quick-info-title">Recent Alerts</h3>
        {/* Will be populated with real data later */}
        <div className="alert-item">No current alerts</div>
      </div>
    </div>
  );
};

export default HomePage;
