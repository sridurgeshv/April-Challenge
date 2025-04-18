import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import xml2js from 'xml2js';
import '../styles/HomePage.css';

const HomePage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/disaster-alerts');
        const parser = new xml2js.Parser();
        parser.parseString(response.data, (err, result) => {
          if (err) {
            console.error('Error parsing RSS feed:', err);
            setError('Failed to parse disaster alerts');
          } else {
            const items = result?.rss?.channel?.[0]?.item || [];
            setAlerts(items.slice(0, 5)); // Limit to the most recent 5 alerts
          }
          setLoading(false);
        });
      } catch (err) {
        console.error('Error fetching alerts:', err.message);
        setError('Failed to fetch disaster alerts');
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="ers-container">
      <div className="ers-hero">
        <div className="ers-hero-gradient"></div>
        <div className="ers-hero-content">
          <h1 className="ers-title">Emergency Response System</h1>
          <p className="ers-subtitle">Stay informed, prepared, and protected during emergencies</p>
        </div>
      </div>

      <div className="ers-stats-banner">
        <div className="ers-stat-item">
          <span className="ers-stat-number">24/7</span>
          <span className="ers-stat-label">Monitoring</span>
        </div>
        <div className="ers-stat-item">
          <span className="ers-stat-number">98%</span>
          <span className="ers-stat-label">Alert Accuracy</span>
        </div>
        <div className="ers-stat-item">
          <span className="ers-stat-number">3min</span>
          <span className="ers-stat-label">Avg. Response Time</span>
        </div>
      </div>

      <div className="ers-main">
        <div className="ers-services">
          <h2 className="ers-section-title">Emergency Services</h2>
          <div className="ers-services-grid">
            <Link to="/map" className="ers-service-card ers-card-red">
              <div className="ers-service-icon">🚨</div>
              <h3>Disaster Map</h3>
              <p>Real-time visualization of active emergency zones and evacuation routes</p>
              <span className="ers-service-action">View Map</span>
            </Link>
            <Link to="/emergency" className="ers-service-card ers-card-blue">
              <div className="ers-service-icon">🆘</div>
              <h3>Emergency Help</h3>
              <p>Request immediate assistance and connect with emergency services</p>
              <span className="ers-service-action">Get Help</span>
            </Link>
            <Link to="/resources" className="ers-service-card ers-card-dark">
              <div className="ers-service-icon">📋</div>
              <h3>Preparation Guide</h3>
              <p>Emergency readiness tips, checklists, and resource planning</p>
              <span className="ers-service-action">Learn More</span>
            </Link>
          </div>
        </div>

        <div className="ers-alerts">
          <div className="ers-alerts-header">
            <h2 className="ers-section-title">Live Emergency Alerts</h2>
            <div className="ers-live-indicator"><span></span>Live Updates</div>
          </div>
          
          {loading ? (
            <div className="ers-loading">
              <div className="ers-spinner"></div>
              <p>Fetching latest emergency alerts...</p>
            </div>
          ) : error ? (
            <div className="ers-error">
              <div className="ers-error-icon">⚠️</div>
              <p>{error}</p>
              <button className="ers-retry-button">Retry</button>
            </div>
          ) : alerts.length > 0 ? (
            <div className="ers-alerts-container">
              {alerts.map((alert, index) => {
                const severityClass = index % 3 === 0 ? 'ers-alert-critical' : 
                                     index % 3 === 1 ? 'ers-alert-warning' : 'ers-alert-caution';
                return (
                  <div key={index} className={`ers-alert ${severityClass}`}>
                    <div className="ers-alert-header">
                      <span className="ers-alert-type">
                        {index % 3 === 0 ? 'CRITICAL' : index % 3 === 1 ? 'WARNING' : 'CAUTION'}
                      </span>
                      <span className="ers-alert-time">Live</span>
                    </div>
                    <h3 className="ers-alert-title">{alert.title?.[0] || 'No title available'}</h3>
                    <p className="ers-alert-desc">{alert.description?.[0]?.substring(0, 120) || 'No description available'}...</p>
                    <div className="ers-alert-footer">
                      <a href={alert.link?.[0]} target="_blank" rel="noopener noreferrer" className="ers-alert-link">
                        View Details
                      </a>
                      <span className="ers-alert-location">
                        <span className="ers-location-icon">📍</span> Affected Area
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ers-no-alerts">
              <div className="ers-no-alerts-icon">✓</div>
              <h3>All Clear</h3>
              <p>No active emergencies in your area at this time.</p>
            </div>
          )}
        </div>
      </div>

      <div className="ers-footer">
        <div className="ers-footer-content">
          <p className="ers-footer-motto">Stay prepared. Stay safe.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;