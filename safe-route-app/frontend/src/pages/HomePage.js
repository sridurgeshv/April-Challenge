import React from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Disaster Response System</h1>
      <div className="action-buttons">
        <Link to="/map" className="btn primary">
          View Disaster Map
        </Link>
        <Link to="/emergency" className="btn secondary">
          Emergency Assistance
        </Link>
      </div>
      <div className="quick-info">
        <h3>Recent Alerts</h3>
        {/* Will be populated with real data later */}
        <div className="alert-item">No current alerts</div>
      </div>
    </div>
  );
};

export default HomePage;