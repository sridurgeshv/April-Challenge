const axios = require('axios');
const https = require('https');
const retry = require('async-retry');

const NASA_API_KEY = process.env.NASA_API_KEY || 'q8im2tVzRxHQlqvcCDul5w2kvUozSxhSwctV2jCH';
const EONET_BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3';

// Create configured axios instance
const nasaApi = axios.create({
  baseURL: EONET_BASE_URL,
  timeout: 15000, // Increased timeout to 15 seconds
  httpsAgent: new https.Agent({ 
    keepAlive: true,
    rejectUnauthorized: true,
    timeout: 15000
  }),
  headers: {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate'
  }
});

// Cache for fallback data
let cachedDisasters = {
  events: [],
  lastUpdated: null
};

const getActiveDisasters = async (params = {}) => {
  try {
    const { days = 30, status = 'open', category, bbox, lat, lng, radius, limit } = params;
    
    const queryParams = {
      days,
      status,
      ...(category && { category }),
      ...(limit && { limit }),
      ...(bbox && { bbox: Array.isArray(bbox) ? bbox.join(',') : bbox })
    };

    if (lat && lng && radius && !bbox) {
      queryParams.bbox = calculateBoundingBox(lat, lng, radius);
    }

    if (NASA_API_KEY && NASA_API_KEY !== 'q8im2tVzRxHQlqvcCDul5w2kvUozSxhSwctV2jCH') {
      queryParams.api_key = NASA_API_KEY;
    }

    // Implement retry logic with exponential backoff
    const response = await retry(
      async (bail) => {
        try {
          const res = await nasaApi.get('/events', { params: queryParams });
          return res;
        } catch (error) {
          if (error.response && error.response.status >= 500) {
            // Don't retry for 5xx errors
            bail(new Error('NASA API server error'));
            return;
          }
          throw error; // Retry for other errors
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (error) => {
          console.log(`Retrying NASA API call after error: ${error.message}`);
        }
      }
    );

    if (!response.data || !response.data.events) {
      throw new Error('Invalid response format from NASA API');
    }

    // Update cache
    cachedDisasters = {
      events: response.data.events,
      lastUpdated: new Date().toISOString()
    };

    return {
      ...cachedDisasters,
      count: response.data.events.length,
      isGlobal: !(lat && lng)
    };

  } catch (error) {
    console.error('NASA API Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Return cached data if available
    if (cachedDisasters.events.length > 0) {
      console.log('Returning cached disaster data');
      return {
        ...cachedDisasters,
        count: cachedDisasters.events.length,
        isGlobal: !(lat && lng),
        isCached: true
      };
    }

    // Fallback to sample data if no cache
    console.log('Returning fallback disaster data');
    return getFallbackDisasterData(params);
  }
};

// Helper function to calculate bounding box
const calculateBoundingBox = (lat, lng, radiusKm) => {
  const earthRadius = 6371;
  const deltaLat = (radiusKm / earthRadius) * (180 / Math.PI);
  const deltaLng = (radiusKm / (earthRadius * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);
  
  return [
    (lng - deltaLng).toFixed(6),
    (lat - deltaLat).toFixed(6),
    (lng + deltaLng).toFixed(6),
    (lat + deltaLat).toFixed(6)
  ].join(',');
};

const getDisasterCategories = async () => {
  try {
    const response = await nasaApi.get('/categories');
    return response.data;
  } catch (error) {
    console.error('NASA Categories Error:', error.message);
    throw new Error('Failed to fetch disaster categories');
  }
};

const getFallbackDisasterData = (params) => {
  // Sample data that matches NASA's response format
  return {
    events: [
      {
        id: 'fallback-1',
        title: 'Sample Wildfire',
        description: 'Fallback data - API unavailable',
        categories: [{ id: 'wildfires', title: 'Wildfires' }],
        geometry: [{
          coordinates: [0, 0],
          date: new Date().toISOString()
        }],
        sources: [{
          url: 'https://eonet.gsfc.nasa.gov'
        }]
      }
    ],
    count: 1,
    lastUpdated: new Date().toISOString(),
    isGlobal: true,
    isFallback: true
  };
};


module.exports = { getActiveDisasters, getDisasterCategories };