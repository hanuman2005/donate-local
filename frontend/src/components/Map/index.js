// src/components/Map/index.js - LEAFLET IMPLEMENTATION
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapWrapper,
  MapControls,
  ControlButton,
  Legend,
  LegendItem,
  LoadingMessage,
  MarkerInfo,
  InfoTitle,
  InfoCategory,
  InfoDistance,
} from "./styledComponents";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons by category
const createCustomIcon = (emoji, color) => {
  return L.divIcon({
    html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${emoji}</div>`,
    className: "custom-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const getCategoryIcon = (category) => {
  const icons = {
    produce: { emoji: "🥕", color: "#48bb78" },
    dairy: { emoji: "🥛", color: "#4299e1" },
    bakery: { emoji: "🍞", color: "#ed8936" },
    "canned-goods": { emoji: "🥫", color: "#9f7aea" },
    "household-items": { emoji: "🏠", color: "#718096" },
    clothing: { emoji: "👕", color: "#f56565" },
    other: { emoji: "📦", color: "#a0aec0" },
  };
  return icons[category] || icons.other;
};

// User location marker
const userIcon = L.divIcon({
  html: `<div style="
    background: #4299e1;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 10px rgba(66,153,225,0.5);
    animation: pulse 2s infinite;
  "></div>
  <style>
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }
  </style>`,
  className: "user-marker",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Calculate distance between two points
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Component to recenter map
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const Map = ({
  listings = [],
  userLocation = null,
  height = "500px",
  onMarkerClick = null,
  showRadius = true,
  radiusKm = 5,
}) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  // Set initial map center
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    } else if (listings.length > 0) {
      const firstListing = listings[0];
      const coords = firstListing.location?.coordinates;
      if (coords && coords.length === 2) {
        // MongoDB: [lng, lat] -> Leaflet: [lat, lng]
        setMapCenter([coords[1], coords[0]]);
      }
    } else {
      // Default: India center
      setMapCenter([20.5937, 78.9629]);
    }
  }, [userLocation, listings]);

  const handleMarkerClick = (listing) => {
    setSelectedListing(listing);
    if (onMarkerClick) {
      onMarkerClick(listing);
    }
  };

  const centerOnUser = () => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  };

  if (!mapCenter) {
    return (
      <MapWrapper height={height}>
        <LoadingMessage>
          <div>🗺️</div>
          <p>Loading map...</p>
        </LoadingMessage>
      </MapWrapper>
    );
  }

  return (
    <MapWrapper height={height}>
      <MapContainer
        center={mapCenter}
        zoom={userLocation ? 13 : 6}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={mapCenter} />

        {/* User location marker */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <strong>📍 Your Location</strong>
              </Popup>
            </Marker>

            {/* Radius circle */}
            {showRadius && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: "#4299e1",
                  fillColor: "#4299e1",
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />
            )}
          </>
        )}

        {/* Listing markers */}
        {listings.map((listing) => {
          const coords = listing.location?.coordinates;

          // Skip invalid coordinates
          if (
            !coords ||
            coords.length !== 2 ||
            (coords[0] === 0 && coords[1] === 0)
          ) {
            return null;
          }

          // MongoDB: [lng, lat] -> Leaflet: [lat, lng]
          const position = [coords[1], coords[0]];
          const iconData = getCategoryIcon(listing.category);
          const icon = createCustomIcon(iconData.emoji, iconData.color);

          // Calculate distance from user
          let distance = null;
          if (userLocation) {
            distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              position[0],
              position[1]
            );
          }

          return (
            <Marker
              key={listing._id}
              position={position}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(listing),
              }}
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                    {listing.title}
                  </h3>
                  <p style={{ margin: "4px 0", color: "#666" }}>
                    {iconData.emoji} {listing.category}
                  </p>
                  <p style={{ margin: "4px 0", color: "#666" }}>
                    📦 Quantity: {listing.quantity} {listing.unit || "items"}
                  </p>
                  {distance && (
                    <p
                      style={{
                        margin: "4px 0",
                        color: "#4299e1",
                        fontWeight: "bold",
                      }}
                    >
                      📏 {distance.toFixed(2)} km away
                    </p>
                  )}
                  <p
                    style={{
                      margin: "8px 0 4px 0",
                      fontSize: "14px",
                      color: "#888",
                    }}
                  >
                    📍 {listing.pickupLocation}
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = `/listings/${listing._id}`)
                    }
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      background: "#4299e1",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Controls */}
      <MapControls>
        {userLocation && (
          <ControlButton onClick={centerOnUser} title="Center on my location">
            🎯
          </ControlButton>
        )}
        <ControlButton
          onClick={() => setSelectedListing(null)}
          title="Clear selection"
        >
          ✕
        </ControlButton>
      </MapControls>

      {/* Legend */}
      <Legend>
        <h4
          style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}
        >
          Categories
        </h4>
        {Object.entries({
          produce: "🥕 Fresh Produce",
          dairy: "🥛 Dairy",
          bakery: "🍞 Bakery",
          "canned-goods": "🥫 Canned Goods",
          "household-items": "🏠 Household",
          clothing: "👕 Clothing",
          other: "📦 Other",
        }).map(([category, label]) => {
          const iconData = getCategoryIcon(category);
          return (
            <LegendItem key={category}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: iconData.color,
                  border: "2px solid white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              />
              <span style={{ fontSize: "13px" }}>{label}</span>
            </LegendItem>
          );
        })}
      </Legend>

      {/* Selected listing info */}
      {selectedListing && (
        <MarkerInfo
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
          }}
        >
          <InfoTitle>{selectedListing.title}</InfoTitle>
          <InfoCategory>
            {getCategoryIcon(selectedListing.category).emoji}{" "}
            {selectedListing.category}
          </InfoCategory>
          {userLocation && selectedListing.location?.coordinates && (
            <InfoDistance>
              📏{" "}
              {calculateDistance(
                userLocation.lat,
                userLocation.lng,
                selectedListing.location.coordinates[1],
                selectedListing.location.coordinates[0]
              ).toFixed(2)}{" "}
              km away
            </InfoDistance>
          )}
          <button
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              background: "#4299e1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%",
              fontSize: "14px",
              fontWeight: "500",
            }}
            onClick={() =>
              (window.location.href = `/listings/${selectedListing._id}`)
            }
          >
            View Details →
          </button>
        </MarkerInfo>
      )}
    </MapWrapper>
  );
};

export default Map;
