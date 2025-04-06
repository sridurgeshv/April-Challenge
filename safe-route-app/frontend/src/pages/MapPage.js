import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { fetchDisasters } from '../services/disasterService';
import { getCurrentLocation } from '../services/locationService';
import 'leaflet/dist/leaflet.css';
import '../styles/MapPage.css'; 

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        const disasterData = await fetchDisasters({
          days: 30,
          status: 'open'
        });
        setDisasters(disasterData.events || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getDisasterIcon = (category) => {
    const iconColors = {
      wildfires: 'red',
      severeStorms: 'orange',
      volcanoes: 'purple',
      earthquakes: 'blue'
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

  if (loading) return <div className="loading">Loading map data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!userLocation) return <div className="error">Location access required</div>;

  return (
    <div className="map-page">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={8} 
        className="full-screen-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
        
        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={[disaster.geometry[0].coordinates[1], disaster.geometry[0].coordinates[0]]}
            icon={getDisasterIcon(disaster.categories[0].id)}
          >
            <Popup>
              <h3>{disaster.title}</h3>
              <p>Type: {disaster.categories[0].title}</p>
              <p>Date: {new Date(disaster.geometry[0].date).toLocaleString()}</p>
              <a href={disaster.sources[0].url} target="_blank" rel="noopener noreferrer">
                More info
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
