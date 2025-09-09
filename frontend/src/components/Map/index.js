import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  MapPlaceholder,
  LoadingMessage,
  MapControls,
  ControlButton,
  Legend,
  LegendItem,
  MarkerInfo,
  InfoTitle,
  InfoCategory,
  InfoDistance
} from './styledComponents';

// Mock Google Maps implementation since we can't load external scripts
// In a real app, you would use Google Maps API or similar
const Map = ({ 
  listings = [], 
  userLocation = null, 
  height = '400px',
  onMarkerClick = null 
}) => {
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const getCategoryColor = (category) => {
    const colors = {
      produce: '#48bb78',
      dairy: '#4299e1',
      bakery: '#ed8936',
      canned: '#9f7aea',
      frozen: '#38b2ac',
      household: '#718096',
      other: '#f56565'
    };
    return colors[category] || colors.other;
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      produce: '🥕',
      dairy: '🥛',
      bakery: '🍞',
      canned: '🥫',
      frozen: '🧊',
      household: '🏠',
      other: '📦'
    };
    return emojis[category] || emojis.other;
  };

  const handleMarkerClick = (listing) => {
    setSelectedMarker(listing);
    if (onMarkerClick) {
      onMarkerClick(listing);
    }
  };

  const centerMap = () => {
    // Simulate centering the map on user location
    if (userLocation) {
      console.log('Centering map on user location:', userLocation);
    }
  };

  if (!mapLoaded) {
    return (
      <MapContainer height={height}>
        <LoadingMessage>
          <div>🗺️</div>
          <p>Loading map...</p>
        </LoadingMessage>
      </MapContainer>
    );
  }

  return (
    <MapContainer height={height} ref={mapRef}>
      {/* Mock Map Display */}
      <MapPlaceholder>
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#4a5568'
        }}>
          📍 Interactive Map View
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#4299e1',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              border: '3px solid white',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              zIndex: 10
            }}
          >
            📍
          </div>
        )}

        {/* Listing Markers */}
        {listings.map((listing, index) => {
          // Generate random positions for demo (in real app, use actual coordinates)
          const randomX = 20 + Math.random() * 60;
          const randomY = 20 + Math.random() * 60;

          return (
            <div
              key={listing._id || index}
              onClick={() => handleMarkerClick(listing)}
              style={{
                position: 'absolute',
                left: `${randomX}%`,
                top: `${randomY}%`,
                background: getCategoryColor(listing.category),
                color: 'white',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                zIndex: selectedMarker?._id === listing._id ? 20 : 5
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              {getCategoryEmoji(listing.category)}
            </div>
          );
        })}

        {/* Selected Marker Info */}
        {selectedMarker && (
          <MarkerInfo
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px'
            }}
          >
            <InfoTitle>{selectedMarker.title}</InfoTitle>
            <InfoCategory>
              {getCategoryEmoji(selectedMarker.category)} {selectedMarker.category}
            </InfoCategory>
            {userLocation && (
              <InfoDistance>
                {(() => {
                  const coords = selectedMarker.location?.coordinates;
                  if (Array.isArray(coords) && coords.length === 2) {
                    const dist = calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      coords[1],
                      coords[0]
                    );
                    return `📏 ~${dist.toFixed(2)} km away`;
                  }
                  return '📏 Distance unavailable';
                })()}
              </InfoDistance>
            )}
            <button
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedMarker(null)}
            >
              View Details
            </button>
          </MarkerInfo>
        )}
      </MapPlaceholder>

      {/* Map Controls */}
      <MapControls>
        {userLocation && (
          <ControlButton onClick={centerMap} title="Center on my location">
            🎯
          </ControlButton>
        )}
        <ControlButton onClick={() => setSelectedMarker(null)} title="Clear selection">
          ✕
        </ControlButton>
      </MapControls>

      {/* Legend */}
      <Legend>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Categories</h4>
        {Object.entries({
          produce: 'Fresh Produce',
          dairy: 'Dairy',
          bakery: 'Bakery',
          canned: 'Canned Goods',
          household: 'Household',
          other: 'Other'
        }).map(([category, label]) => (
          <LegendItem key={category}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: getCategoryColor(category)
              }}
            />
            <span>{getCategoryEmoji(category)} {label}</span>
          </LegendItem>
        ))}
      </Legend>
    </MapContainer>
  );
};

export default Map;