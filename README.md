# SafeRoute: Disaster Response & Evacuation Assistant

**SafeRoute** is a comprehensive emergency response platform built to guide users during natural disasters. It offers real-time geolocation, dynamic disaster alerts, and safe navigation to shelters and critical services — all tailored for the user’s specific location.

---

## 🌟 Problem Statement

During natural disasters, timely information and clear evacuation guidance can mean the difference between life and death. SafeRoute addresses this critical need by providing an all-in-one solution that helps users:

- Access real-time disaster information specific to their location
- Find the safest evacuation routes away from danger
- Locate nearby emergency shelters and critical services
- Connect with local emergency services through region-specific contact information

---

## 🧭 Solution Overview

SafeRoute utilizes real-time geospatial data and global disaster feeds to help users stay informed and make fast, safe decisions. Our platform combines multiple data sources to create a comprehensive emergency response tool accessible from any mobile device or computer.

---

## 🚀 Key Features

- 🔴 **Live Disaster Alerts**: Integration with trusted global sources for timely notifications about earthquakes, floods, wildfires, and other natural disasters.
  
- 🧭 **Safe Navigation**: AI-powered routing algorithm that suggests optimal evacuation paths while avoiding hazardous areas.

- 🛑 **Shelter & Resource Locator**: Instantly identifies nearby shelters, medical facilities, and aid centers when you need them most.

- 📞 **Localized Emergency Contacts**: Our standout feature — SafeRoute detects the user's region and dynamically presents localized emergency numbers (police, fire, ambulance). Whether in India, the U.S., or elsewhere, users receive accurate, region-specific contact details.

- 📡 **Offline Functionality**: Critical features remain available even during connectivity disruptions through local data caching.

- 📢 **Community Reports**: Users can flag danger zones or request help, creating a collaborative safety network visible to other users and authorities.

- 🔔 **Personalized Alerts**: Set up custom notifications based on specific disaster types or proximity thresholds.

---

## 📱 User Interface & Experience

![App Screenshots](https://github.com/sridurgeshv/April-Challenge/blob/main/images/map.JPG)

SafeRoute features an intuitive, panic-friendly interface designed to be used under stress:
- Large, clear buttons for critical functions
- High-contrast color scheme for visibility in various lighting conditions
- Voice commands for hands-free operation
- Minimal screen transitions to access vital information

---

## 🧱 Technology Stack

### Frontend
- **React.js** - For building a responsive and interactive user interface
- **Leaflet** / **MapBox** - Powering our interactive maps and real-time geolocation
- **Material UI** / **Tailwind CSS** - Creating a responsive and accessible design system

### Backend
- **Node.js** with **Express** - Handling server-side operations and API integrations
- **MongoDB** - Storing user data, location information, and shelter databases
- **Redis** - Caching disaster data for rapid access and offline functionality
- **Socket.io** - Enabling real-time updates and notifications

---

## 🔌 API Integrations

| API | Purpose | Implementation Details |
|-----|---------|------------------------|
| [NASA EONET](https://eonet.gsfc.nasa.gov/docs/v2.1) | Real-time natural event tracking | Polls every 5 minutes for updated disaster data |
| [NASA Earth API](https://api.nasa.gov/) | Satellite imagery | Used for visual confirmation of affected areas |
| [OpenStreetMap](https://wiki.openstreetmap.org/wiki/API_v0.6) | Geolocation and navigation | Primary mapping service for route calculation |
| [ReliefWeb API](https://reliefweb.int/help/api) | Humanitarian response data | Shelter and aid location data source |
| [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) | Emergency services & hospitals | Identifies medical facilities within safe reach |
| [Photon](https://photon.komoot.io/) | Geocoding | Converts addresses to coordinates and vice versa |
| [HERE Maps API](https://www.here.com/developer/rest-apis) | Map services and routing | Secondary routing provider with traffic data |
| [Regional Emergency Directory API](https://example.com) | Country-specific emergency contacts | Custom implementation that maps user location to appropriate emergency numbers |

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas connection)
- API keys (see [API Registration](#api-registration))

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/safe-route-app.git
   cd safe-route-app
   ```

2. **Frontend setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Backend setup**
   ```bash
   cd backend
   npm install
   cp .env
   node server.js
   ```

### API Registration

To run this application, obtain API keys from the following services:
1. NASA API - [Register](https://api.nasa.gov/)
2. Google Places API - [Register](https://developers.google.com/maps/documentation/places/web-service/overview)
3. HERE Maps API - [Register](https://www.here.com/develop/rest-apis)
4. MapBox (optional) - [Register](https://www.mapbox.com/)

Add these keys to your `.env` files in both frontend and backend folders.

## Test Credentials (for OTP module)

- Phone Number: 6789065432
- OTP: 890765

## 👥 Contributing

We welcome community contributions to make SafeRoute more effective in emergency situations. To contribute:

1. Fork the repository
2. Create a new branch for your feature or fix: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please ensure your code is clean, tested, and well-documented.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎬 Demo Video

[Watch the complete demonstration](https://youtu.be/pRJqV9tYTTs) of SafeRoute in action, showcasing:
- Real-time disaster alerts
- Safe evacuation routing
- Shelter location
- Emergency service contact features

## 📧 Contact

For questions or feedback, reach out to:
- Email: ritikasrivastava456@gmail.com, sridurgeshv@gmail.com
- GitHub Issues: [Report a bug](https://github.com/sridurgeshv/safe-route-app/issues)







