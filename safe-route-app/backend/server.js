// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://ritika66:ritika12@cluster0.oaefvoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Handle CORS preflight requests
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors());

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SafeRoute API' });
});

// New route to proxy GDACS RSS feed
app.get('/api/disaster-alerts', async (req, res) => {
  try {
    const response = await axios.get('https://www.gdacs.org/xml/rss.xml');
    res.set('Content-Type', 'application/xml');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching GDACS RSS feed:', error.message);
    res.status(500).json({ message: 'Failed to fetch disaster alerts', error: error.message });
  }
});

app.use('/api/register', require('./routes/register'));
app.use('/api/disasters', require('./routes/disasters'));
app.use('/api/emergency-contacts', require('./routes/emergencyContacts'));
app.use('/api/emergency-numbers', require('./routes/emergencyNumbers')); // Add the new route

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});