// routes/emergencyNumbers.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Cache for emergency numbers to reduce API calls
const emergencyNumbersCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Get emergency numbers for a specific country
router.get('/:countryCode', async (req, res) => {
  try {
    const countryCode = req.params.countryCode.toLowerCase();
    
    // Check if we have cached data for this country
    if (emergencyNumbersCache.has(countryCode)) {
      const cachedData = emergencyNumbersCache.get(countryCode);
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        return res.json(cachedData.data);
      }
      // Cache expired, remove it
      emergencyNumbersCache.delete(countryCode);
    }

    // Fetch country data from the EmergencyNumberAPI
    const response = await axios.get('https://emergencynumberapi.com/api/data/all');
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid API response format');
    }

    // Find the country in the response
    const countryData = response.data.find(item => 
      item.Country && 
      item.Country.ISOCode && 
      item.Country.ISOCode.toLowerCase() === countryCode
    );

    if (!countryData) {
      return res.status(404).json({ 
        message: 'Country not found',
        error: `No emergency numbers found for country code: ${countryCode}`
      });
    }

    // Format the data to match the expected structure
    const formattedData = {
      disclaimer: "The data from this API is provided without any claims of accuracy, you should use this data as guidance, and do your own due diligence.",
      error: "",
      data: {
        country: {
          name: countryData.Country.Name,
          ISOCode: countryData.Country.ISOCode,
          ISONumeric: countryData.Country.ISONumeric
        },
        ambulance: {
          all: countryData.Ambulance?.All || [],
          gsm: countryData.Ambulance?.GSM || null,
          fixed: countryData.Ambulance?.Fixed || null
        },
        fire: {
          all: countryData.Fire?.All || [],
          gsm: countryData.Fire?.GSM || null,
          fixed: countryData.Fire?.Fixed || null
        },
        police: {
          all: countryData.Police?.All || [],
          gsm: countryData.Police?.GSM || null,
          fixed: countryData.Police?.Fixed || null
        },
        dispatch: {
          all: countryData.Dispatch?.All || [],
          gsm: countryData.Dispatch?.GSM || null,
          fixed: countryData.Dispatch?.Fixed || null
        },
        member_112: countryData.Member_112 || false,
        localOnly: countryData.LocalOnly || false,
        nodata: countryData.NoData || false
      }
    };

    // Cache the result
    emergencyNumbersCache.set(countryCode, {
      timestamp: Date.now(),
      data: formattedData
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching emergency numbers:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch emergency numbers', 
      error: error.message 
    });
  }
});

module.exports = router;