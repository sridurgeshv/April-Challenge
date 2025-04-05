const axios = require('axios');

const NASA_API_KEY = process.env.NASA_API_KEY || 'q8im2tVzRxHQlqvcCDul5w2kvUozSxhSwctV2jCH'; // NASA provides a demo key
const EONET_BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3';

const getActiveDisasters = async (params = {}) => {
  try {
    const { days = 20, status = 'open', category } = params;
    
    let url = `${EONET_BASE_URL}/events`;
    const queryParams = new URLSearchParams();
    
    queryParams.append('days', days);
    queryParams.append('status', status);
    
    if (category) {
      queryParams.append('category', category);
    }
    
    if (NASA_API_KEY) {
      queryParams.append('api_key', NASA_API_KEY);
    }
    
    const response = await axios.get(`${url}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('NASA API Error:', error.message);
    throw new Error('Failed to fetch disaster data from NASA');
  }
};

const getDisasterCategories = async () => {
  try {
    const response = await axios.get(`${EONET_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('NASA API Error:', error.message);
    throw new Error('Failed to fetch disaster categories');
  }
};

module.exports = { getActiveDisasters, getDisasterCategories };