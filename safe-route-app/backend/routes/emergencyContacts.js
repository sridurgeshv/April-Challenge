// backend/routes/emergencyContacts.js
const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');

// Get all emergency contacts (temporarily without user filtering)
router.get('/', async (req, res) => {
  try {
    const contacts = await EmergencyContact.find();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add new emergency contact
router.post('/', async (req, res) => {
  const { name, phoneNumber, relationship } = req.body;

  try {
    const newContact = new EmergencyContact({
      name,
      phoneNumber,
      relationship
    });

    const contact = await newContact.save();
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete emergency contact
router.delete('/:id', async (req, res) => {
  try {
    await EmergencyContact.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;