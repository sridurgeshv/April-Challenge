// src/services/disasterService.js
import axios from 'axios';

// Point to your backend API, not directly to NASA
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

export const fetchDisasters = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/disasters`, { 
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch disasters');
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch categories');
  }
};