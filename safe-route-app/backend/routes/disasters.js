const express = require('express');
const router = express.Router();
const disasterController = require('../controllers/disasterController');

// Get all active disasters
router.get('/', disasterController.getDisasters);

// Get disaster categories
router.get('/categories', disasterController.getCategories);

module.exports = router;