const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

router.post('/trigger', async (req, res) => {
  try {
    const contacts = await EmergencyContact.find(); // In future, filter by userId with authentication
    const message = req.body.message || 'SOS! Emergency situation. Please help!';
    for (const contact of contacts) {
      if (contact.telegramChatId) {
        try {
          await bot.sendMessage(contact.telegramChatId, message);
        } catch (err) {
          console.error(`Failed to send message to ${contact.telegramChatId}:`, err);
        }
      }
    }
    res.json({ success: true, message: 'SOS messages sent' });
  } catch (err) {
    console.error('Error triggering SOS:', err);
    res.status(500).json({ success: false, message: 'Failed to send SOS messages' });
  }
});

module.exports = router;