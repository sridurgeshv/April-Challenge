// backend/models/EmergencyContact.js
const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Changed from true to false
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
  deviceToken: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema);