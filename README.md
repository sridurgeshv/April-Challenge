# SafeRoute: Disaster Response & Evacuation Assistant

An emergency application that helps users find safe zones, hospitals, and emergency services during natural disasters using real-time geolocation data.

### How It Works:

1. User shares their location (or manually inputs it).
2. App fetches real-time disaster data (from APIs like NASA Disaster API, ReliefWeb, etc.).
3. Safe zones and emergency shelters appear on the map (using OpenStreetMap data).
4. App suggests the safest route to the nearest safe zone, avoiding blocked roads or dangerous areas.
5. Users get emergency contacts (local fire stations, hospitals, NGOs, etc.).
6. (Optional) User can report unsafe zones or request help, which is added to a live feed.

## Features

- Real-time disaster tracking and visualization
- Safe zone and emergency shelter locator
- Safe route navigation avoiding disaster areas
- Emergency contacts and resources
- Offline capability for emergency situations

## Tech Stack

### Frontend
- React.js
- Leaflet/MapBox for mapping
- Material UI/Tailwind CSS for UI components

### Backend
- Node.js with Express
- API integration with NASA EONET, OpenStreetMap

### APIs
- NASA EONET (Earth Observatory Natural Event Tracker)
- NASA Earth API for satellite imagery
- OpenStreetMap for geolocation and mapping
- (Optional) ReliefWeb API for humanitarian data

## Development Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- API keys (see API Registration section)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/safe-route-app.git
   cd safe-route-app
   ```

2. Frontend setup
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Backend setup
   ```bash
   cd backend
   npm install
   node server.js
   ```

## API Registration

This application requires API keys from:
1. NASA API - Register at https://api.nasa.gov/
2. MapBox (optional) - Register at https://www.mapbox.com/


# SafeRoute: Disaster Response & Evacuation Assistant


### Tech Stack & APIs:
1. APIs:
- OpenStreetMap (for geolocation & navigation).
- NASA Disaster API (for real-time disaster alerts).
- ReliefWeb API (for humanitarian response data).
- Google Places API (for emergency services & hospitals).
- Hosting: Vercel/Netlify (Frontend), Firebase/AWS (Backend).

### API's :
1. NASA - https://api.nasa.gov/
- [Link 1](https://worldview.earthdata.nasa.gov/?v=72.90204749683377,19.086367401115417,73.09423884362047,19.17175059691467&l=Reference_Labels_15m,Reference_Features_15m,Coastlines_15m,HLS_L30_Nadir_BRDF_Adjusted_Reflectance,Land_Water_Map&lg=true&l1=Reference_Labels_15m,Reference_Features_15m,Coastlines_15m,MODIS_Aqua_Cloud_Top_Pressure_Day&lg1=true&ca=false&cv=46&s=79.4433,23.3794&t=2023-04-30-T00%3A00%3A00Z&t1=2025-04-04-T05%3A56%3A43Z)
- [EONET}(https://eonet.gsfc.nasa.gov/docs/v2.1)
2. ReliefWeb - https://reliefweb.int/help/api
3. OpenStreetMap - https://wiki.openstreetmap.org/wiki/API_v0.6
4. https://photon.komoot.io/
5. https://www.here.com/developer/rest-apis

## Project Roadmap

- [x] Project setup and planning
- [x] Basic map implementation
- [x] NASA API integration
- [x] Safe route algorithm implementation
- [ ] User interface development
- [ ] Testing and optimization
- [ ] Documentation and deployment

## Contributing
Instructions for contributing to the project.

## License
MIT License