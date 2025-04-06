import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export const fetchDisasters = async (params = {}) => {
  try {
    // Validate required params
    if (params.lat && params.lng && !params.radius) {
      params.radius = 500; // Default 500km radius
    }

    const response = await api.get('/disasters', { params });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Invalid response from server');
    }

    return response.data.data;
  } catch (error) {
    console.error('API Request Failed:', {
      url: error.config?.url,
      params: error.config?.params,
      response: error.response?.data
    });
    
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to fetch disaster data'
    );
  }
};