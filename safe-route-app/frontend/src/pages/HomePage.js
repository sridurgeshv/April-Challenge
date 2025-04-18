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
        {loading ? (
          <div className="loading">Loading alerts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <h4>{alert.title?.[0] || 'No title available'}</h4>
              <p>{alert.description?.[0]?.substring(0, 200) || 'No description available'}...</p>
              <a href={alert.link?.[0]} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          ))
        ) : (
          <div className="no-alert">No current alerts</div>
        )}
      </div>
    </div>
  );
};

export default HomePage;