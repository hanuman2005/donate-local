// src/utils/recyclingCenters.js

/**
 * Get search query based on material type
 */
export const getMaterialSearchQuery = (material) => {
  const queries = {
    'E-Waste': 'electronics recycling center',
    'Plastic': 'plastic recycling',
    'Paper/Cardboard': 'paper recycling bin',
    'Glass': 'glass recycling center',
    'Metal': 'scrap metal recycling',
    'Cloth/Textile': 'clothes donation center',
    'Organic Waste': 'compost center',
  };
  
  return queries[material] || 'recycling drop-off';
};

/**
 * Get user's current location
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Shorten display name for recycling center
 */
export const shortenCenterName = (displayName) => {
  if (!displayName) return 'Recycling Center';
  
  // Split by comma and take first 2-3 parts
  const parts = displayName.split(',').map(p => p.trim());
  
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(', ');
  
  // Return first part + city
  return `${parts[0]}, ${parts[parts.length - 2] || parts[1]}`;
};

/**
 * Fetch nearby recycling centers from OpenStreetMap Nominatim
 */
export const fetchNearbyCenters = async (material, userLocation) => {
  try {
    const query = getMaterialSearchQuery(material);
    const { latitude, longitude } = userLocation;

    // Build Nominatim API URL
    const baseUrl = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      format: 'json',
      q: `${query} near ${latitude},${longitude}`,
      limit: 5,
      addressdetails: 1,
    });

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: {
        'User-Agent': 'ShareTogether-WasteAnalyzer/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch centers');
    }

    const data = await response.json();

    // Transform and enrich data
    const centers = data.map((center) => {
      const centerLat = parseFloat(center.lat);
      const centerLon = parseFloat(center.lon);
      const distance = calculateDistance(
        latitude,
        longitude,
        centerLat,
        centerLon
      );

      return {
        id: center.place_id,
        name: shortenCenterName(center.display_name),
        fullName: center.display_name,
        latitude: centerLat,
        longitude: centerLon,
        distance: distance,
        distanceText: formatDistance(distance),
        type: center.type,
        address: center.address,
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${centerLat},${centerLon}`,
      };
    });

    // Sort by distance
    centers.sort((a, b) => a.distance - b.distance);

    return centers;
  } catch (error) {
    console.error('Error fetching recycling centers:', error);
    throw error;
  }
};

/**
 * Get icon for material type
 */
export const getMaterialIcon = (material) => {
  const icons = {
    'E-Waste': '💻',
    'Plastic': '♻️',
    'Paper/Cardboard': '📄',
    'Glass': '🍾',
    'Metal': '🔩',
    'Cloth/Textile': '👕',
    'Organic Waste': '🌱',
  };
  
  return icons[material] || '📍';
};