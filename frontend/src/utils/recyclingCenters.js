// src/utils/recyclingCenters.js

/**
 * Get user's current geolocation
 * @returns {Promise<{lat: number, lon: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Map waste material to recycling facility search terms
 * @param {string} material - Material type from AI analysis
 * @returns {string} Search query for Nominatim API
 */
const getMaterialSearchQuery = (material) => {
  const materialMap = {
    'E-Waste': 'electronics recycling',
    'Plastic': 'plastic recycling',
    'Paper/Cardboard': 'paper recycling',
    'Glass': 'glass recycling',
    'Metal': 'metal recycling scrap',
    'Cloth/Textile': 'textile recycling clothing donation',
    'Organic Waste': 'composting facility',
    'Other': 'recycling center',
  };

  return materialMap[material] || 'recycling center';
};

/**
 * Get material icon for display
 * @param {string} material - Material type
 * @returns {string} Emoji icon
 */
export const getMaterialIcon = (material) => {
  const iconMap = {
    'E-Waste': '💻',
    'Plastic': '♻️',
    'Paper/Cardboard': '📄',
    'Glass': '🍾',
    'Metal': '🔩',
    'Cloth/Textile': '👕',
    'Organic Waste': '🌱',
    'Other': '📦',
  };

  return iconMap[material] || '♻️';
};

/**
 * Fetch nearby recycling centers from OpenStreetMap Nominatim API
 * @param {string} material - Material type (E-Waste, Plastic, etc.)
 * @param {Object} userLocation - User's coordinates {lat, lon}
 * @returns {Promise<Array>} Array of nearby centers with details
 */
export const fetchNearbyCenters = async (material, userLocation) => {
  try {
    const searchQuery = getMaterialSearchQuery(material);
    const { lat, lon } = userLocation;

    // OpenStreetMap Nominatim API (Free, no API key needed!)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `format=json` +
        `&q=${encodeURIComponent(searchQuery)}` +
        `&lat=${lat}` +
        `&lon=${lon}` +
        `&addressdetails=1` +
        `&limit=10` +
        `&bounded=1` +
        `&viewbox=${lon - 0.5},${lat - 0.5},${lon + 0.5},${lat + 0.5}`,
      {
        headers: {
          'User-Agent': 'ShareTogether-WasteAnalyzer/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recycling centers');
    }

    const data = await response.json();

    // Process and enrich results
    const centers = data
      .map((place) => {
        const placeLat = parseFloat(place.lat);
        const placeLon = parseFloat(place.lon);
        const distance = calculateDistance(lat, lon, placeLat, placeLon);

        return {
          id: place.place_id,
          name: place.display_name.split(',')[0] || 'Recycling Center',
          fullAddress: place.display_name,
          lat: placeLat,
          lon: placeLon,
          distance: distance,
          distanceText: formatDistance(distance),
          type: place.type,
          googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLon}`,
        };
      })
      .filter((center) => center.distance <= 50) // Within 50km
      .sort((a, b) => a.distance - b.distance) // Sort by nearest first
      .slice(0, 5); // Top 5 results

    return centers;
  } catch (error) {
    console.error('Error fetching recycling centers:', error);
    throw error;
  }
};

/**
 * Fallback: Get generic recycling centers if material-specific search fails
 * @param {Object} userLocation - User's coordinates {lat, lon}
 * @returns {Promise<Array>} Array of generic recycling centers
 */
export const fetchGenericCenters = async (userLocation) => {
  return fetchNearbyCenters('Other', userLocation);
};

/**
 * Get distance between user and a specific location
 * @param {Object} userLocation - {lat, lon}
 * @param {Object} centerLocation - {lat, lon}
 * @returns {string} Formatted distance
 */
export const getDistanceToCenter = (userLocation, centerLocation) => {
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    centerLocation.lat,
    centerLocation.lon
  );
  return formatDistance(distance);
};