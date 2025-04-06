const express = require('express');
const router = express.Router();

// In-memory storage for demo (replace with DB in production)
const registeredNumbers = new Set();

router.post('/', (req, res) => {
  const { phoneNumber } = req.body;
  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  if (registeredNumbers.has(phoneNumber)) {
    return res.status(200).json({ message: 'Number already registered' });
  }

  registeredNumbers.add(phoneNumber);
  return res.status(201).json({ message: 'Mobile number registered successfully' });
});

module.exports = router;
