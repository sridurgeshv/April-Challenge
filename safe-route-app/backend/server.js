// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const EmergencyContact = require('./models/EmergencyContact');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://ritika66:ritika12@cluster0.oaefvoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Handle incoming messages to register chat IDs
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    const contact = await EmergencyContact.findOne({ uniqueCode: text });
    if (contact) {
      contact.telegramChatId = chatId;
      await contact.save();
      bot.sendMessage(chatId, 'You have been registered as an emergency contact. You will receive notifications in case of emergency.');
    } else {
      bot.sendMessage(chatId, 'Invalid code. Please enter the correct code provided by the user.');
    }
  } catch (err) {
    console.error('Error processing message:', err);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});

// CORS config
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

// GDACS RSS proxy
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

// Emergency numbers proxy
app.get('/api/country/:code', async (req, res) => {
  try {
    const response = await axios.get(`https://emergencynumberapi.com/api/country/${req.params.code}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching emergency numbers:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch emergency numbers',
      error: error.message,
    });
  }
});

// IP location proxy
app.get('/api/ip-location', async (req, res) => {
  try {
    const response = await axios.get('http://ip-api.com/json');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching IP location:', error.message);
    res.status(500).json({ message: 'Failed to fetch IP location', error: error.message });
  }
});

// Routes
app.use('/api/register', require('./routes/register'));
app.use('/api/disasters', require('./routes/disasters'));
app.use('/api/emergency-contacts', require('./routes/emergencyContacts'));
app.use('/api/sos', require('./routes/sos'));

// Error handler
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