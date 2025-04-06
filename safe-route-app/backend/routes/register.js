const express = require('express');
const router = express.Router();

const otpStore = new Map(); // phoneNumber -> { otp, expiry }
const registeredNumbers = new Set();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

router.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  const otp = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 min

  otpStore.set(phoneNumber, { otp, expiry });

  // Simulate sending OTP
  console.log(`OTP for ${phoneNumber}: ${otp}`);

  return res.status(200).json({ message: 'OTP sent successfully' });
});

router.post('/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  const record = otpStore.get(phoneNumber);

  if (!record) {
    return res.status(400).json({ message: 'OTP not found or expired. Please request again.' });
  }

  if (Date.now() > record.expiry) {
    otpStore.delete(phoneNumber);
    return res.status(400).json({ message: 'OTP expired. Please request again.' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (registeredNumbers.has(phoneNumber)) {
    return res.status(200).json({ message: 'Number already registered' });
  }

  registeredNumbers.add(phoneNumber);
  otpStore.delete(phoneNumber);

  return res.status(201).json({ message: 'Mobile number registered successfully' });
});

module.exports = router;
