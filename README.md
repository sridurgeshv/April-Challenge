# SafeRoute: Disaster Response & Evacuation Assistant

**SafeRoute** is an emergency response application designed to assist users during natural disasters. It enables real-time location tracking, disaster alert integration, and safe route navigation to nearby shelters, hospitals, and emergency services.

---

## 🧭 Overview

SafeRoute leverages real-time geolocation and disaster data to:

- Detect user location or accept manual input
- Display ongoing disasters from trusted data sources
- Identify nearby shelters and hospitals
- Navigate users through the safest possible routes
- Provide emergency contact details
- Allow users to report unsafe areas or request help

---

## 🚀 Features

- 🔴 Real-time disaster alerts and visualization
- 🛑 Safe zone and shelter locator
- 🧭 Navigation with blocked road and hazard avoidance
- 📞 Emergency contacts: fire stations, hospitals, NGOs
- 📡 Offline support during connectivity issues
- 📢 User-reported hazard feed (optional)

---

## 🧱 Tech Stack

### Frontend
- **React.js**
- **Leaflet** / **MapBox** – Mapping & geolocation
- **Material UI** / **Tailwind CSS** – UI styling

### Backend
- **Node.js** with **Express**
- API integration for real-time data

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

## Project Roadmap

- [x] Initial project setup
- [x] Basic map implementation
- [x] NASA EONET API integration
- [x] Safe route algorithm
- [ ] UI/UX development
- [ ] Testing and performance optimization
- [ ] Documentation and deployment

## Test Credentials (for OTP module)

- Phone Number: 6789065432
- OTP: 890765

## Contributing

We welcome contributions from the community! Please fork the repo, make your changes, and submit a pull request. Ensure code is well-documented and tested.

## License

This project is licensed under the MIT License.