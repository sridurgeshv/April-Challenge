const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');

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
  const { name, phoneNumber, relationship, bloodGroup } = req.body;

  try {
    const newContact = new EmergencyContact({
      name,
      phoneNumber,
      relationship,
      bloodGroup
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