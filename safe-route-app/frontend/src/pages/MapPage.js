import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { fetchDisasters } from '../services/disasterService';
import { getCurrentLocation } from '../services/locationService';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [localDisasters, setLocalDisasters] = useState([]);
  const [globalDisasters, setGlobalDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [shelters, setShelters] = useState([]);
  const [showGlobalDisasters, setShowGlobalDisasters] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);

        // Fetch local disasters (500km radius)
        const localData = await fetchDisasters({
          days: 30,
          status: 'open',
          lat: location.lat,
          lng: location.lng,
          radius: 500
        });
        setLocalDisasters(localData.events || []);

        // Fetch global disasters (no location filter)
        const globalData = await fetchDisasters({
          days: 30,
          status: 'open',
          limit: 50 // Limit to 50 most recent global disasters
        });
        setGlobalDisasters(globalData.events || []);

        // Mock shelter data
        setShelters(getNearbyShelters(location.lat, location.lng));
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getNearbyShelters = (lat, lng) => {
    // In a real app, this would be an API call
    return [
      {
        id: 1,
        name: 'Community Emergency Shelter',
        type: 'shelter',
        lat: lat + 0.05,
        lng: lng + 0.05,
        distance: 5.2 // km
      },
      {
        id: 2,
        name: 'City General Hospital',
        type: 'hospital',
        lat: lat - 0.03,
        lng: lng + 0.07,
        distance: 7.8
      },
      {
        id: 3,
        name: 'Fire Station #42',
        type: 'fire',
        lat: lat + 0.08,
        lng: lng - 0.02,
        distance: 8.5
      }
    ];
  };

  const getDisasterIcon = (category) => {
    const iconColors = {
      wildfires: 'red',
      severeStorms: 'orange',
      volcanoes: 'purple',
      earthquakes: 'blue',
      floods: 'cyan'
    };
    
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColors[category] || 'grey'}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const getShelterIcon = (type) => {
    const icons = {
      shelter: '🏠',
      hospital: '🏥',
      fire: '🚒',
      police: '🚓'
    };
    return L.divIcon({
      html: `<div style="font-size: 24px">${icons[type] || '📍'}</div>`,
      className: 'shelter-icon'
    });
  };

  const toggleLocationDetails = () => {
    setShowLocationDetails(!showLocationDetails);
  };

  if (loading) return <div className="loading">Loading safety data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!userLocation) return <div className="error">Location access required</div>;

  const hasLocalDisasters = localDisasters.length > 0;

  return (
    <div className="map-page">
      <div className="map-header">
        <h2>Disaster Safety Map</h2>
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
        </div>
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={[userLocation.lat, userLocation.lng]} 
          zoom={5} // Start with a wider zoom to see global context
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User location */}
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
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
          
          {/* Local shelters */}
          {shelters.map(shelter => (
            <Marker
              key={shelter.id}
              position={[shelter.lat, shelter.lng]}
              icon={getShelterIcon(shelter.type)}
            >
              <Popup>
                <strong>{shelter.name}</strong>
                <p>{shelter.type === 'hospital' ? 'Hospital' : 
                    shelter.type === 'fire' ? 'Fire Station' : 'Emergency Shelter'}</p>
                <p>{shelter.distance.toFixed(1)} km away</p>
              </Popup>
            </Marker>
          ))}
          
          {/* Local disasters (always shown) */}
          {localDisasters.map((disaster) => (
            <Marker
              key={`local-${disaster.id}`}
              position={[disaster.geometry[0].coordinates[1], disaster.geometry[0].coordinates[0]]}
              icon={getDisasterIcon(disaster.categories[0].id)}
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
          ))}
          
          {/* Global disasters (toggleable) */}
          {showGlobalDisasters && globalDisasters
            .filter(globalDis => 
              !localDisasters.some(localDis => localDis.id === globalDis.id)
            )
            .map((disaster) => (
              <Marker
                key={`global-${disaster.id}`}
                position={[disaster.geometry[0].coordinates[1], disaster.geometry[0].coordinates[0]]}
                icon={getDisasterIcon(disaster.categories[0].id)}
                opacity={0.7} // Make global disasters slightly transparent
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
            ))}
          
          {/* Safety info panel when no local disasters */}
          {!hasLocalDisasters && (
            <div className="safety-info-panel">
              <h3>Safety Preparedness</h3>
              <div className="safety-tips">
                <div className="tip-card">
                  <h4>Emergency Kit Checklist</h4>
                  <ul>
                    <li>Water (1 gallon per person per day)</li>
                    <li>Non-perishable food</li>
                    <li>First aid kit</li>
                    <li>Flashlight + batteries</li>
                  </ul>
                </div>
                <div className="tip-card">
                  <h4>Global Disaster Watch</h4>
                  <p>{globalDisasters.length} active disasters worldwide</p>
                </div>
              </div>
            </div>
          )}
        </MapContainer>
      </div>
      
      <div className="map-controls">
        <button className="btn emergency">SOS Emergency</button>
        <button className="btn shelters">Navigate to Nearest Shelter</button>
      </div>
    </div>
  );
};

export default MapPage;