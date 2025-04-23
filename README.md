# SafeRoute: Disaster Response & Evacuation Assistant

**SafeRoute** is a comprehensive emergency response platform built to guide users during natural disasters. It offers real-time geolocation, dynamic disaster alerts, and safe navigation to shelters and critical services — all tailored for the user’s specific location.

---

## 🌟 Problem Statement

During natural disasters, timely information and clear evacuation guidance can mean the difference between life and death. SafeRoute addresses this critical need by providing an all-in-one solution. The key features include:

- Automatic location detection.
- Can check global disasters happening or happened all around the world as well as can also check if your in a safe zone in the map itself.
- Live alerts on natural disasters from reliable data sources
- Discovery of nearby shelters, hospitals, and emergency facilities
- Navigation through the nearest available shelters
- SOS message to emergency contact added by user via telegram.
- Connect with local emergency services through region-specific contact information
- PreparednessTips especially curated for users.
---

## 🧭 Solution Overview

SafeRoute utilizes real-time geospatial data and global disaster feeds to help users stay informed and make fast, safe decisions. Our platform combines multiple data sources to create a comprehensive emergency response tool accessible from any mobile device or computer.

---

## 🚀 Key Features

- 🔴 **Live Disaster Alerts**: Integration with trusted global sources for timely notifications about earthquakes, floods, wildfires, and other natural disasters.

- 🛑 **Shelter & Resource Locator**: Identifies nearby shelters, medical facilities, and aid centers and navigation through the nearest available shelter.

- 📞 **Localized Emergency Contacts**: Our standout feature — SafeRoute detects the user's region and dynamically presents localized emergency numbers (police, fire, ambulance). Whether in India, the U.S., or elsewhere, users receive accurate, region-specific contact details.

- 🔴  **SOS Message** : Can send sos message to your emergency contacts via telegram.
---

## 📱 User Interface & Experience

![App Screenshots](https://github.com/sridurgeshv/April-Challenge/blob/main/images/map.JPG)

SafeRoute features an intuitive, panic-friendly interface designed to be used under stress:
- Large, clear buttons for critical functions
- High-contrast color scheme for visibility in various lighting conditions
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
---

## 🔌 API Integrations

| API | Purpose | Implementation Details |
|-----|---------|------------------------|
| [NASA EONET](https://eonet.gsfc.nasa.gov/docs/v3) | Real-time natural event tracking | Polls every 5 minutes for updated disaster data |
| [Gdacs API](https://gdacs.org/) | Real-time access to web‐based disaster information| For live disaster alerts |
| [OpenStreetMap](https://wiki.openstreetmap.org/wiki/API_v0.6) | Geolocation and navigation | Primary mapping service for route calculation |
| [ReliefWeb API](https://reliefweb.int/help/api) | Humanitarian response data | Shelter and aid location data source |
| [Emergency Number API](https://emergencynumberapi.com/) | Emergency numbers | For fetching emergency numbers according to the user location |

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB ( Atlas connection)

 ## Test Credentials (for OTP module)

- Phone Number: 6789065432
- OTP: 890765

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/sridurgeshv/April-Challenge.git
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
   node server.js
   ```
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

## Discord Handles

@ritika12 @sunnyunam








