const nasaService = require('../services/nasaService');

/**
 * Get active disasters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getDisasters = async (req, res, next) => {
  try {
    const { days, status, categories } = req.query;
    
    const params = {
      days: days ? parseInt(days) : 20,
      status: status || 'open'
    };
    
    if (categories) {
      params.categories = categories.split(',');
    }
    
    const disasters = await nasaService.getActiveDisasters(params);
    res.json(disasters);
  } catch (error) {
    next(error);
  }
};

/**
 * Get disaster categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await nasaService.getDisasterCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDisasters,
  getCategories
};