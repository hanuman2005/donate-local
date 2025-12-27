// src/components/Tracking/DriverMode.js - Driver view for managing pickups
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { scheduleAPI } from "../../services/api";
import { useSocket } from "../../context/SocketContext";

// Fix Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.25rem 1.5rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.375rem;
  border-radius: 12px;
`;

const StatusButton = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: ${(props) => (props.$active ? "white" : "transparent")};
  color: ${(props) => (props.$active ? "#667eea" : "rgba(255, 255, 255, 0.8)")};

  &:hover {
    background: ${(props) =>
      props.$active ? "white" : "rgba(255, 255, 255, 0.1)"};
  }
`;

const MapSection = styled.div`
  flex: 1;
  position: relative;
  min-height: 300px;
`;

const LocationIndicator = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: var(--bg-card);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-lg);
`;

const PulsingDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? "#48bb78" : "#e53e3e")};
`;

const PickupQueue = styled.div`
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  max-height: 40%;
  overflow-y: auto;
`;

const QueueHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: var(--bg-card);
  z-index: 10;
`;

const QueueTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PickupCount = styled.span`
  padding: 0.25rem 0.75rem;
  background: var(--primary);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PickupCard = styled(motion.div)`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-secondary);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const PickupNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "var(--bg-secondary)"};
  color: ${(props) => (props.$active ? "white" : "var(--text-primary)")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
`;

const PickupDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const PickupTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PickupMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PickupActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: ${(props) =>
    props.$primary
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : props.$success
      ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
      : "var(--bg-secondary)"};
  color: ${(props) =>
    props.$primary || props.$success ? "white" : "var(--text-primary)"};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CurrentPickupBanner = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(72, 187, 120, 0.15) 0%,
    rgba(56, 161, 105, 0.15) 100%
  );
  border: 2px solid rgba(72, 187, 120, 0.3);
  border-radius: 16px;
  margin: 1rem;
  padding: 1rem;
`;

const BannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const BannerTitle = styled.div`
  font-weight: 700;
  color: #38a169;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BannerContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const BannerStat = styled.div`
  text-align: center;
`;

const BannerStatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const BannerStatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

// Map follow component
const FollowUserLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);

  return null;
};

const DriverMode = () => {
  const { socket } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [currentPickup, setCurrentPickup] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Start/stop location tracking
  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCurrentLocation(newLocation);

          // Send location to server
          if (currentPickup && socket) {
            socket.emit("update-driver-location", {
              scheduleId: currentPickup._id,
              location: newLocation,
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to get your location");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setWatchId(id);

      return () => {
        navigator.geolocation.clearWatch(id);
      };
    } else if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [isOnline, currentPickup, socket]);

  // Fetch assigned pickups
  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await scheduleAPI.getMySchedules({
          role: "driver",
          status: "confirmed",
        });
        setPickups(response.data || response.schedules || []);
      } catch (error) {
        console.error("Error fetching pickups:", error);
      }
    };

    if (isOnline) {
      fetchPickups();
    }
  }, [isOnline]);

  const handleStartPickup = async (pickup) => {
    try {
      await scheduleAPI.startPickup(pickup._id);
      setCurrentPickup(pickup);
      toast.success("Pickup started! Navigate to the location.");
    } catch (error) {
      toast.error("Failed to start pickup");
    }
  };

  const handleArrived = async () => {
    if (!currentPickup || !socket) return;

    socket.emit("driver-arrived", { scheduleId: currentPickup._id });
    toast.success("Notified: You've arrived!");
  };

  const handleCompletePickup = async () => {
    if (!currentPickup) return;

    try {
      await scheduleAPI.completeSchedule(currentPickup._id);
      toast.success("Pickup completed! 🎉");
      setCurrentPickup(null);
      // Refresh pickups
      const response = await scheduleAPI.getMySchedules({
        role: "driver",
        status: "confirmed",
      });
      setPickups(response.data || response.schedules || []);
    } catch (error) {
      toast.error("Failed to complete pickup");
    }
  };

  const formatDistance = useCallback(
    (pickup) => {
      if (!currentLocation || !pickup.pickupLocation?.coordinates) return "N/A";
      const [lng, lat] = pickup.pickupLocation.coordinates;
      const R = 6371; // Earth's radius in km
      const dLat = ((lat - currentLocation[0]) * Math.PI) / 180;
      const dLng = ((lng - currentLocation[1]) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((currentLocation[0] * Math.PI) / 180) *
          Math.cos((lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance < 1
        ? `${(distance * 1000).toFixed(0)}m`
        : `${distance.toFixed(1)}km`;
    },
    [currentLocation]
  );

  const openNavigation = (pickup) => {
    if (!pickup.pickupLocation?.coordinates) return;
    const [lng, lat] = pickup.pickupLocation.coordinates;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>🚗 Driver Mode</HeaderTitle>
        <StatusToggle>
          <StatusButton $active={!isOnline} onClick={() => setIsOnline(false)}>
            Offline
          </StatusButton>
          <StatusButton $active={isOnline} onClick={() => setIsOnline(true)}>
            Online
          </StatusButton>
        </StatusToggle>
      </Header>

      <MapSection>
        <MapContainer
          center={currentLocation || [37.7749, -122.4194]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {currentLocation && (
            <>
              <FollowUserLocation position={currentLocation} />
              <Marker position={currentLocation}>
                <Popup>Your Location</Popup>
              </Marker>
            </>
          )}

          {pickups.map((pickup) =>
            pickup.pickupLocation?.coordinates ? (
              <Marker
                key={pickup._id}
                position={[
                  pickup.pickupLocation.coordinates[1],
                  pickup.pickupLocation.coordinates[0],
                ]}
              >
                <Popup>
                  <strong>{pickup.listing?.title || "Pickup"}</strong>
                  <br />
                  {pickup.pickupAddress}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>

        <LocationIndicator
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <PulsingDot
            $active={isOnline && currentLocation}
            animate={
              isOnline && currentLocation
                ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
            {isOnline
              ? currentLocation
                ? "Location Active"
                : "Getting location..."
              : "Offline"}
          </span>
        </LocationIndicator>
      </MapSection>

      <PickupQueue>
        {currentPickup && (
          <CurrentPickupBanner
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BannerHeader>
              <BannerTitle>🎯 Current Pickup</BannerTitle>
              <ActionButton
                $success
                onClick={handleCompletePickup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Complete ✓
              </ActionButton>
            </BannerHeader>
            <BannerContent>
              <BannerStat>
                <BannerStatValue>
                  {formatDistance(currentPickup)}
                </BannerStatValue>
                <BannerStatLabel>Distance</BannerStatLabel>
              </BannerStat>
              <BannerStat>
                <BannerStatValue>
                  {currentPickup.confirmedTime || currentPickup.proposedTime}
                </BannerStatValue>
                <BannerStatLabel>Scheduled</BannerStatLabel>
              </BannerStat>
              <BannerStat>
                <ActionButton
                  onClick={handleArrived}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📍 Arrived
                </ActionButton>
              </BannerStat>
            </BannerContent>
          </CurrentPickupBanner>
        )}

        <QueueHeader>
          <QueueTitle>📋 Pickup Queue</QueueTitle>
          <PickupCount>{pickups.length}</PickupCount>
        </QueueHeader>

        <AnimatePresence>
          {pickups.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <p>No pickups assigned</p>
              <p style={{ fontSize: "0.875rem" }}>
                {isOnline
                  ? "New pickups will appear here"
                  : "Go online to receive pickups"}
              </p>
            </EmptyState>
          ) : (
            pickups.map((pickup, index) => (
              <PickupCard
                key={pickup._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <PickupNumber $active={currentPickup?._id === pickup._id}>
                  {index + 1}
                </PickupNumber>
                <PickupDetails>
                  <PickupTitle>
                    {pickup.listing?.title || "Donation Pickup"}
                  </PickupTitle>
                  <PickupMeta>
                    <span>📍 {formatDistance(pickup)}</span>
                    <span>
                      ⏰ {pickup.confirmedTime || pickup.proposedTime}
                    </span>
                  </PickupMeta>
                </PickupDetails>
                <PickupActions>
                  <ActionButton
                    onClick={() => openNavigation(pickup)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗺️
                  </ActionButton>
                  {!currentPickup && (
                    <ActionButton
                      $primary
                      onClick={() => handleStartPickup(pickup)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start
                    </ActionButton>
                  )}
                </PickupActions>
              </PickupCard>
            ))
          )}
        </AnimatePresence>
      </PickupQueue>
    </Container>
  );
};

export default DriverMode;
