// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // 

const HomePage = () => {
  return (
    <div className="home-page container fade-in">
      <h1 className="title slide-in">Disaster Response System</h1>
      <div className="action-buttons button-group zoom-in">
        <Link to="/map" className="btn primary-btn">
          🚨 View Disaster Map
        </Link>
        <Link to="/emergency" className="btn secondary-btn">
          🆘 Emergency Assistance
        </Link>
      </div>
      <div className="quick-info info-card">
        <h3 className="section-title">Recent Alerts</h3>
        {/* Will be populated with real data later */}
        <div className="alert-item no-alert">No current alerts</div>
      </div>
    </div>
  );
};

export default HomePage;
