# SafeRoute: Disaster Response & Evacuation Assistant

**SafeRoute** is a comprehensive emergency response platform built to guide users during natural disasters. It offers real-time geolocation, dynamic disaster alerts, and safe navigation to shelters and critical services — all tailored for the user’s specific location.

---

## 🧭 Overview

SafeRoute utilizes real-time geospatial data and global disaster feeds to help users stay informed and make fast, safe decisions. Key capabilities include:

- Automatic location detection or manual input

- Live updates on natural disasters from reliable data sources

- Discovery of nearby shelters, hospitals, and emergency facilities

- Navigation through the safest available routes, avoiding blocked or hazardous areas

- Location-based emergency contact information

- User-generated hazard reporting and SOS requests

---

## 🚀  Key Features

- 🔴 *Live Disaster Alerts*: Integrates with trusted sources for timely disaster notifications.
- 🧭 *Safe Navigation*: Suggests optimal evacuation routes with hazard avoidance.
- 🛑 *Shelter & Resource Locator*: Identifies nearby shelters, medical facilities, and aid centers.
- 📞 *Localized Emergency Contacts*: A standout feature — SafeRoute detects the user’s region and dynamically presents localized emergency numbers (police, fire, ambulance). Whether the user is in India, the U.S., or any other part of the world, they receive accurate, region-specific contact details for critical services.
- 📡 *Offline Functionality*: Provides support during connectivity disruptions.
- 📢 *User Reports*: Users can flag danger zones or request help, visible to other users and authorities.

---

## 🧱 Tech Stack

### Frontend
- **React.js**
- **Leaflet** / **MapBox** – Interactive maps and real-time geolocation
- **Material UI** / **Tailwind CSS** – Responsive and modern UI components

### Backend
- **Node.js** with **Express**
- RESTful API integration for external data sources and internal processing

---

## 🔌 APIs Used

| API | Purpose |
| --- | ------- |
| [NASA EONET](https://eonet.gsfc.nasa.gov/docs/v2.1) | Real-time natural event tracking |
| [NASA Earth API](https://api.nasa.gov/) | Satellite imagery |
| [OpenStreetMap](https://wiki.openstreetmap.org/wiki/API_v0.6) | Geolocation and navigation |
| [ReliefWeb API](https://reliefweb.int/help/api) | Humanitarian response data |
| [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) | Emergency services & hospitals |
| [Photon](https://photon.komoot.io/) | Geocoding |
| [HERE Maps API](https://www.here.com/developer/rest-apis) | Map services and routing |
| [Regional Emergency Directory API (Custom Implementation)]() | Provides country/region-specific emergency contacts based on user location |
---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- API keys (see [API Registration](#api-registration))

### Installation Steps

1. **Clone the repository**

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

To run this application, obtain API keys from the following services:
1. NASA API - [Register](https://api.nasa.gov/)
2. MapBox (optional) - [Register](https://www.mapbox.com/)

## Test Credentials (for OTP module)

- Phone Number: 6789065432
- OTP: 890765

## Project Roadmap

- [x] Initial project setup
- [x] Basic map implementation
- [x] NASA EONET API integration
- [x] Safe route algorithm
- [ ] UI/UX development
- [ ] Testing and performance optimization
- [ ] Documentation and deployment

## Contributing

We encourage community contributions. If you'd like to contribute:

1. Fork the repository
2. Create a new branch for your feature or fix
3. Ensure your code is clean, tested, and documented
4. Submit a pull request

## License

This project is licensed under the MIT License.