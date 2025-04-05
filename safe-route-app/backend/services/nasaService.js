const axios = require('axios');

const NASA_API_KEY = process.env.NASA_API_KEY;
const EONET_BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3';

/**
 * Get active disasters from NASA EONET API
 * @param {Object} params - Query parameters
 * @param {Number} params.days - Number of days to look back
 * @param {String} params.status - Event status (open, closed)
 * @param {Array} params.categories - Event categories to filter
 * @returns {Promise} Promise with disaster data
 */
const getActiveDisasters = async (params = {}) => {
  try {
    const { days = 20, status = 'open', categories = [] } = params;
    
    let url = `${EONET_BASE_URL}/events`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('days', days);
    queryParams.append('status', status);
    
    if (categories.length > 0) {
      queryParams.append('categories', categories.join(','));
    }
    
    if (NASA_API_KEY) {
      queryParams.append('api_key', NASA_API_KEY);
    }
    
    url = `${url}?${queryParams.toString()}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching disasters from NASA EONET:', error);
    throw error;
  }
};

/**
 * Get disaster categories from NASA EONET API
 * @returns {Promise} Promise with categories data
 */
const getDisasterCategories = async () => {
  try {
    const url = `${EONET_BASE_URL}/categories`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching disaster categories:', error);
    throw error;
  }
};

module.exports = {
  getActiveDisasters,
  getDisasterCategories
};