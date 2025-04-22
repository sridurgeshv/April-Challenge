import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import axios from 'axios';
import { fetchDisasters } from '../services/disasterService';
import { getCurrentLocation } from '../services/locationService';
import { fetchReliefWebReports } from '../services/reliefWebService';
import 'leaflet/dist/leaflet.css';
import '../styles/MapPage.css';

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [localDisasters, setLocalDisasters] = useState([]);
  const [globalDisasters, setGlobalDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [shelters, setShelters] = useState([]);
  const [showGlobalDisasters, setShowGlobalDisasters] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showPreparednessTips, setShowPreparednessTips] = useState(false);
  const [reliefWebReports, setReliefWebReports] = useState([]);
  const [showVerifiedReports, setShowVerifiedReports] = useState(true);

  const calculateBoundingBox = (lat, lng, radiusKm) => {
    const earthRadius = 6371;
    const deltaLat = (radiusKm / earthRadius) * (180 / Math.PI);
    const deltaLng = (radiusKm / (earthRadius * Math.cos(Math.PI * lat / 180))) * (180 / Math.PI);
    return [lat - deltaLat, lng - deltaLng, lat + deltaLat, lng + deltaLng].join(',');
  };

  const fetchShelters = async (lat, lng, radiusKm) => {
    const bbox = calculateBoundingBox(lat, lng, radiusKm);
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](${bbox});
        node["amenity"="shelter"](${bbox});
        node["amenity"="fire_station"](${bbox});
      );
      out center;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.elements.map(el => ({
        id: el.id,
        name: el.tags.name || 'Unknown',
        type: el.tags.amenity,
        lat: el.lat,
        lng: el.lon
      }));
    } catch (error) {
      console.error('Error fetching shelters:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [localData, globalData, realShelters, reliefData] = await Promise.all([
          fetchDisasters({
            days: 7,
            status: 'open',
            lat: location.lat,
            lng: location.lng,
            radius: 500
          }),
          fetchDisasters({
            days: 7,
            status: 'open',
            limit: 50
          }),
          fetchShelters(location.lat, location.lng, 50),
          fetchReliefWebReports({
            lat: location.lat,
            lng: location.lng,
            radius: 1000
          })
        ]);

        setLocalDisasters(localData.events.filter(event => 
          new Date(event.geometry[0].date) >= sevenDaysAgo
        ));
        setGlobalDisasters(globalData.events.filter(event => 
          new Date(event.geometry[0].date) >= sevenDaysAgo
        ));
        setShelters(realShelters);
        console.log('Fetched ReliefWeb Reports:', reliefData);
        
        const reportsWithCoords = reliefData.filter(report => report.coordinates);
        console.log('Reports with coordinates:', reportsWithCoords);
        
        setReliefWebReports(reliefData);
        setLoading(false);
      } catch (err) {
        setError(`Location Error: ${err.message}. Please ensure location services are enabled.`);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);    

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };
  
  const handleProfileClick = () => {
    window.location.href = '/profile';
  };
  
  const handleLogoutClick = () => {
    window.location.href = '/';
  };

  const getDisasterIcon = (category, isRecent) => {
    const iconColors = {
      wildfires: 'red',
      severeStorms: 'orange',
      volcanoes: 'purple',
      earthquakes: 'blue',
      floods: 'cyan'
    };
    const color = isRecent ? 'gold' : (iconColors[category] || 'grey');
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const getShelterIcon = (type) => {
    const icons = {
      hospital: '🏥',
      shelter: '🏠',
      fire_station: '🚒'
    };
    return L.divIcon({
      html: `<div style="font-size: 36px">${icons[type] || '📍'}</div>`,
      className: 'shelter-icon'
    });
  };

  const userIcon = L.divIcon({
    className: 'user-location-icon',
    html: '<div style="background-color: blue; width: 20px; height: 20px; border-radius: 50%;"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleNavigateToNearestShelter = () => {
    if (shelters.length === 0) {
      alert('No shelters found nearby.');
      return;
    }

    const nearestShelter = shelters.reduce((prev, current) => {
      const prevDistance = haversineDistance(userLocation.lat, userLocation.lng, prev.lat, prev.lng);
      const currentDistance = haversineDistance(userLocation.lat, userLocation.lng, current.lat, current.lng);
      return currentDistance < prevDistance ? current : prev;
    });

    navigate(`/shelter/${nearestShelter.id}`, { state: { shelter: nearestShelter } });
  };

  const toggleLocationDetails = () => {
    setShowLocationDetails(!showLocationDetails);
  };

  const handleSOSClick = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emergency-contacts');
      const contacts = response.data;

      if (contacts.length === 0) {
        alert('No emergency contacts set. Please add contacts in the profile section.');
        return;
      }

      const message = `SOS! Emergency situation. User's location: Lat ${userLocation.lat.toFixed(4)}, Lng ${userLocation.lng.toFixed(4)}. Please help!`;
      const sosResponse = await axios.post('http://localhost:5000/api/sos/trigger', { message });

      if (sosResponse.data.success) {
        alert('SOS messages sent to emergency contacts via Telegram');
      } else {
        alert('Failed to send SOS messages');
      }
    } catch (error) {
      console.error('Error triggering SOS:', error);
      alert('Failed to send SOS messages');
    }
  };

  if (loading) return <div className="loading">Loading safety data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!userLocation) return <div className="error">Location access required</div>;

  const hasLocalDisasters = localDisasters.length > 0;

  const preparednessTips = [
    "Create an emergency kit with water, food, flashlight, and first aid supplies",
    "Identify safe places in your home for different types of disasters",
    "Learn basic first aid and CPR",
    "Keep important documents in a waterproof container",
    "Plan evacuation routes from your home and neighborhood",
    "Stay informed about local emergency alerts and warnings",
    "Practice emergency drills with your family",
    "Know how to turn off utilities in your home",
    "Keep your vehicle's gas tank at least half full",
    "Store at least 3 days worth of water (1 gallon per person per day)"
  ];

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="header-container">
          <h2>Disaster Safety Map</h2>
          <div className="profile-container" ref={dropdownRef}>
          <div className="profile-icon" onClick={toggleProfileDropdown}>
            <img 
              src="https://cdn-icons-png.flaticon.com/128/9131/9131646.png" 
              alt="Profile Icon" 
              className="profile-icon-inner" 
            />
          </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button onClick={handleProfileClick}>Profile</button>
                <button onClick={handleLogoutClick}>Log out</button>
              </div>
            )}
          </div>
        </div>
        <div className={`safety-status ${hasLocalDisasters ? 'danger' : 'safe'}`}>
          {hasLocalDisasters ? (
            <span>⚠️ {localDisasters.length} active threats nearby</span>
          ) : (
            <span>✓ You're in a safe zone</span>
          )}
        </div>
        <div className="map-controls-top">
          <button
            className={`btn ${showGlobalDisasters ? 'active' : ''}`}
            onClick={() => setShowGlobalDisasters(!showGlobalDisasters)}
          >
            {showGlobalDisasters ? 'Hide Global Disasters' : 'Show Global Disasters'}
          </button>
          <button 
            className="btn tips-toggle"
            onClick={() => setShowPreparednessTips(!showPreparednessTips)}
          >
            {showPreparednessTips ? 'Hide Tips' : 'Show Preparedness Tips'}
          </button>
        </div>
      </div>
      
      {!hasLocalDisasters && showPreparednessTips && (
        <div className="preparedness-tips-panel">
          <h3>Safety Preparedness Tips</h3>
          <button 
            className="close-tips-btn"
            onClick={() => setShowPreparednessTips(false)}
          >
            ×
          </button>
          <ul>
            {preparednessTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}    

      <div className="map-container">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            eventHandlers={{ click: toggleLocationDetails }}
          >
            <Popup>
              <strong>Your Location</strong>
              {showLocationDetails && (
                <div className="location-details">
                  <p>Latitude: {userLocation.lat.toFixed(6)}</p>
                  <p>Longitude: {userLocation.lng.toFixed(6)}</p>
                </div>
              )}
            </Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={500000}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />

          <MarkerClusterGroup>
            {shelters.map(shelter => (
              <Marker
                key={shelter.id}
                position={[shelter.lat, shelter.lng]}
                icon={getShelterIcon(shelter.type)}
              >
                <Popup>
                  <strong>{shelter.name}</strong>
                  <p>
                    {shelter.type === 'hospital'
                      ? 'Hospital'
                      : shelter.type === 'shelter'
                      ? 'Shelter'
                      : shelter.type === 'fire_station'
                      ? 'Fire Station'
                      : 'Safe Zone'}
                  </p>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          
          {localDisasters.map(disaster => {
            const isRecent = Date.now() - new Date(disaster.geometry[0].date) < 24 * 60 * 60 * 1000;
            return (
              <Marker
                key={`local-${disaster.id}`}
                position={[disaster.geometry[0].coordinates[1], disaster.geometry[0].coordinates[0]]}
                icon={getDisasterIcon(disaster.categories[0].id, isRecent)}
              >
                <Popup>
                  <h3>{disaster.title} (Nearby)</h3>
                  <p>Type: {disaster.categories[0].title}</p>
                  <p>Date: {new Date(disaster.geometry[0].date).toLocaleString()}</p>
                  <a href={disaster.sources[0].url} target="_blank" rel="noopener noreferrer">
                    More info
                  </a>
                </Popup>
              </Marker>
            );
          })}
          
          {showGlobalDisasters &&
            globalDisasters
              .filter(globalDis => !localDisasters.some(localDis => localDis.id === globalDis.id))
              .map(disaster => {
                const isRecent = Date.now() - new Date(disaster.geometry[0].date) < 24 * 60 * 60 * 1000;
                return (
                  <Marker
                    key={`global-${disaster.id}`}
                    position={[disaster.geometry[0].coordinates[1], disaster.geometry[0].coordinates[0]]}
                    icon={getDisasterIcon(disaster.categories[0].id, isRecent)}
                    opacity={0.7}
                  >
                    <Popup>
                      <h3>{disaster.title} (Global)</h3>
                      <p>Type: {disaster.categories[0].title}</p>
                      <p>Date: {new Date(disaster.geometry[0].date).toLocaleString()}</p>
                      <a href={disaster.sources[0].url} target="_blank" rel="noopener noreferrer">
                        More info
                      </a>
                    </Popup>
                  </Marker>
                );
              })}
          {showVerifiedReports && reliefWebReports.map(report => {
            if (!report.coordinates) {
              console.warn('Skipping marker for report without coordinates:', report);
              return null;
            }
            
            console.log('Rendering report marker:', report);
            
            return (
              <Marker
                key={`reliefweb-${report.id}`}
                position={[report.coordinates[1], report.coordinates[0]]}
                icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                })}
              >
                <Popup>
                  <div className="verified-report-popup">
                    <h3>Verified Report: {report.title}</h3>
                    <p className="report-meta">
                      {report.type} • {report.country} • {new Date(report.date).toLocaleDateString()}
                    </p>
                    <p className="report-excerpt">
                      {report.body.substring(0, 150)}...
                    </p>
                    <a href={report.url} target="_blank" rel="noopener noreferrer">
                      Read full report
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>    
       
      <div className="map-controls">
        <button className="btn emergency" onClick={handleSOSClick}>
          SOS Emergency
        </button>
        <button className="btn shelters" onClick={handleNavigateToNearestShelter}>
          Navigate to Nearest Shelter
        </button>
        <button
          className={`btn ${showVerifiedReports ? 'active' : ''}`}
          onClick={() => setShowVerifiedReports(!showVerifiedReports)}
        >
          {showVerifiedReports ? 'Hide Verified Reports' : 'Show Verified Reports'}
        </button>
      </div>
    </div>
  );
};

export default MapPage;