// backend/routes/emergencyContacts.js
const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');
const shortid = require('shortid');

router.get('/', async (req, res) => {
  try {
    const contacts = await EmergencyContact.find(); // In future, filter by userId
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { name, phoneNumber, relationship, bloodGroup } = req.body;
  const uniqueCode = shortid.generate();
  try {
    const newContact = new EmergencyContact({
      name,
      phoneNumber,
      relationship,
      bloodGroup,
      uniqueCode,
      // userId: req.user.id // Uncomment when authentication is implemented
    });
    const contact = await newContact.save();
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    await EmergencyContact.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error('Delete error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 