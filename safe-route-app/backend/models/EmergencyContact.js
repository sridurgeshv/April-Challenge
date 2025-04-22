const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: false
  },
  deviceToken: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  uniqueCode: {
    type: String,
    required: false
  },
  telegramChatId: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema);