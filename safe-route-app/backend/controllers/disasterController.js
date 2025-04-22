const nasaService = require('../services/nasaService');

const getDisasters = async (req, res, next) => {
  try {
    const { days, status, category, lat, lng, radius } = req.query;

    // Base parameters with defaults
    const params = {
      days: days && !isNaN(days) ? parseInt(days) : 30,
      status: status || 'open',
      category,
    };

    // Include lat, lng, and radius only if all three are provided
    if (lat && lng && radius) {
      params.lat = parseFloat(lat);
      params.lng = parseFloat(lng);
      params.radius = parseFloat(radius);
    }

    // Add bbox if available (for direct bbox queries)
    if (req.query.bbox) {
      params.bbox = Array.isArray(req.query.bbox)
        ? req.query.bbox.map(Number)
        : req.query.bbox.split(',').map(Number);
    }

    const data = await nasaService.getActiveDisasters(params);

    res.json({
      success: true,
      data,
      metadata: {
        count: data.events.length,
        radius: params.radius ? `${params.radius}km` : 'global', // Use params.radius for consistency
        lastUpdated: data.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Controller Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to process disaster data',
    });
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await nasaService.getDisasterCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { getDisasters, getCategories };