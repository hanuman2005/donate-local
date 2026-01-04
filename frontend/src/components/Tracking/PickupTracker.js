// src/components/Tracking/PickupTracker.js - Real-time pickup tracking with live map
import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { scheduleAPI } from "../../services/api";
import { useSocket } from "../../context/SocketContext";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom driver icon
const driverIcon = new L.DivIcon({
  className: "driver-marker",
  html: `<div style="
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    border: 3px solid white;
  ">🚗</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Destination icon
const destinationIcon = new L.DivIcon({
  className: "destination-marker",
  html: `<div style="
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
    border: 3px solid white;
  ">📍</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border-radius: 20px;
  overflow: hidden;
`;

const Header = styled.div`
  background: var(--gradient-primary);
  color: var(--text-inverse);
  padding: 1.25rem 1.5rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => {
    switch (props.$status) {
      case "en_route":
        return "var(--warning)";
      case "arriving":
        return "var(--success)";
      case "arrived":
        return "var(--success-light)";
      default:
        return "var(--bg-card)";
    }
  }};
  color: var(--text-inverse);
`;

const ETABar = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ETAIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ETAContent = styled.div`
  flex: 1;
`;

const ETALabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
`;

const ETATime = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ETADistance = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const MapWrapper = styled.div`
  flex: 1;
  position: relative;
  min-height: 300px;
`;

const MapOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  gap: 0.5rem;
`;

const OverlayButton = styled(motion.button)`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const InfoPanel = styled(motion.div)`
  background: var(--bg-card);
  padding: 1.25rem;
  border-top: 1px solid var(--border-color);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`;

const InfoCard = styled.div`
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  text-align: center;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-top: 1rem;
`;

const DriverAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--text-on-primary, #fff);
  font-weight: 600;
`;

const DriverDetails = styled.div`
  flex: 1;
`;

const DriverName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const DriverMeta = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CallButton = styled(motion.button)`
  padding: 0.625rem;
  border: none;
  border-radius: 50%;
  background: var(--gradient-success, var(--primary));
  color: var(--text-on-primary, #fff);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Timeline = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const TimelineStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 12px;
    top: 30px;
    width: 2px;
    height: calc(100% - 10px);
    background: ${(props) =>
      props.$completed ? "var(--primary)" : "var(--border-color)"};
  }
`;

const TimelineDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) =>
    props.$completed
      ? "var(--gradient-primary)"
      : props.$active
      ? "var(--primary)"
      : "var(--bg-tertiary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--text-on-primary, #fff);
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineLabel = styled.div`
  font-weight: 500;
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-primary)"};
`;

const TimelineTime = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const LoadingState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const Spinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  margin-bottom: 1rem;
`;

// Map auto-center component
// Defensive: check coordinates before using (move to top-level)
const isValidLatLng = (pos) =>
  Array.isArray(pos) &&
  pos.length === 2 &&
  pos.every((v) => typeof v === "number" && !isNaN(v)) &&
  pos[0] >= -90 &&
  pos[0] <= 90 &&
  pos[1] >= -180 &&
  pos[1] <= 180;

const MapController = ({ driverPosition, destinationPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (isValidLatLng(driverPosition) && isValidLatLng(destinationPosition)) {
      const bounds = L.latLngBounds([driverPosition, destinationPosition]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (isValidLatLng(driverPosition)) {
      map.setView(driverPosition, 15);
    }
  }, [driverPosition, destinationPosition, map]);

  return null;
};

const PICKUP_STAGES = [
  { id: "confirmed", label: "Pickup Confirmed", icon: "✓" },
  { id: "en_route", label: "Driver En Route", icon: "🚗" },
  { id: "arriving", label: "Almost There", icon: "📍" },
  { id: "arrived", label: "Arrived", icon: "🎉" },
  { id: "completed", label: "Completed", icon: "✅" },
];

const PickupTracker = ({ scheduleId, onClose }) => {
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [currentStage, setCurrentStage] = useState("confirmed");
  const mapRef = useRef(null);

  // Fetch initial pickup status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await scheduleAPI.getPickupStatus(scheduleId);
        const data = response.data || response;
        setSchedule(data.schedule);
        setDriverLocation(data.driverLocation);
        setEta(data.eta);
        setDistance(data.distance);
        setCurrentStage(data.status || "confirmed");
      } catch (error) {
        console.error("Error fetching pickup status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [scheduleId]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.emit("join-tracking", scheduleId);

    socket.on("driver-location-update", (data) => {
      if (data.scheduleId === scheduleId) {
        setDriverLocation(data.location);
        setEta(data.eta);
        setDistance(data.distance);
      }
    });

    socket.on("pickup-status-update", (data) => {
      if (data.scheduleId === scheduleId) {
        setCurrentStage(data.status);
      }
    });

    return () => {
      socket.emit("leave-tracking", scheduleId);
      socket.off("driver-location-update");
      socket.off("pickup-status-update");
    };
  }, [socket, scheduleId]);

  const getStageIndex = (stage) => {
    return PICKUP_STAGES.findIndex((s) => s.id === stage);
  };

  const formatETA = useCallback((minutes) => {
    if (!minutes) return "Calculating...";
    if (minutes < 1) return "< 1 min";
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  }, []);

  const formatDistance = useCallback((meters) => {
    if (!meters) return "";
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  }, []);

  const centerOnDriver = () => {
    if (mapRef.current && validDriverLocation) {
      mapRef.current.setView(validDriverLocation, 15);
    }
  };

  const centerOnDestination = () => {
    if (mapRef.current && destinationCoords) {
      mapRef.current.setView(destinationCoords, 15);
    }
  };

  const getStatusLabel = () => {
    switch (currentStage) {
      case "en_route":
        return "Driver is on the way";
      case "arriving":
        return "Driver is nearby";
      case "arrived":
        return "Driver has arrived!";
      case "completed":
        return "Pickup Complete";
      default:
        return "Preparing for pickup";
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <Spinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p style={{ color: "var(--text-secondary)" }}>
            Loading tracking info...
          </p>
        </LoadingState>
      </Container>
    );
  }

  // Default fallback coordinates (India center - can be adjusted)
  const DEFAULT_COORDS = [20.5937, 78.9629];

  // Validate coordinates - check if they are valid and not at [0, 0]
  const isValidCoords = (coords) => {
    if (!coords || !Array.isArray(coords)) return false;
    if (coords.length < 2) return false;
    // Check for [0, 0] which usually indicates failed geocoding
    if (coords[0] === 0 && coords[1] === 0) return false;
    // Check for valid latitude/longitude ranges
    const [lng, lat] = coords;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    return true;
  };

  // Defensive: get valid destination coordinates
  const destinationCoords =
    schedule &&
    schedule.pickupLocation &&
    Array.isArray(schedule.pickupLocation.coordinates) &&
    isValidCoords(schedule.pickupLocation.coordinates)
      ? [
          Number(schedule.pickupLocation.coordinates[1]),
          Number(schedule.pickupLocation.coordinates[0]),
        ]
      : DEFAULT_COORDS;

  // Defensive: get valid driver location
  const validDriverLocation =
    driverLocation &&
    Array.isArray(driverLocation) &&
    isValidCoords(driverLocation)
      ? [Number(driverLocation[0]), Number(driverLocation[1])]
      : null;

  const currentStageIndex = getStageIndex(currentStage);

  return (
    <Container>
      <Header>
        <HeaderTop>
          <Title>🚗 Live Tracking</Title>
          <StatusBadge $status={currentStage}>{getStatusLabel()}</StatusBadge>
        </HeaderTop>

        <ETABar>
          <ETAIcon>⏱️</ETAIcon>
          <ETAContent>
            <ETALabel>Estimated Arrival</ETALabel>
            <ETATime>{formatETA(eta)}</ETATime>
            <ETADistance>{formatDistance(distance)}</ETADistance>
          </ETAContent>
          <AnimatePresence>
            {currentStage === "arriving" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--success-bg, var(--primary))",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-on-primary, #fff)",
                }}
              >
                🔔 Almost there!
              </motion.div>
            )}
          </AnimatePresence>
        </ETABar>
      </Header>

      <MapWrapper>
        <MapContainer
          center={validDriverLocation || destinationCoords || DEFAULT_COORDS}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {isValidLatLng(validDriverLocation) &&
            isValidLatLng(destinationCoords) && (
              <MapController
                driverPosition={validDriverLocation}
                destinationPosition={destinationCoords}
              />
            )}

          {isValidLatLng(validDriverLocation) && (
            <Marker position={validDriverLocation} icon={driverIcon}>
              <Popup>
                <strong>Driver Location</strong>
                <br />
                {formatDistance(distance)}
              </Popup>
            </Marker>
          )}

          {isValidLatLng(destinationCoords) && (
            <Marker position={destinationCoords} icon={destinationIcon}>
              <Popup>
                <strong>Pickup Location</strong>
                <br />
                {schedule?.pickupAddress || "Pickup point"}
              </Popup>
            </Marker>
          )}

          {isValidLatLng(validDriverLocation) &&
            isValidLatLng(destinationCoords) && (
              <Polyline
                positions={[validDriverLocation, destinationCoords]}
                color="var(--primary)"
                weight={4}
                opacity={0.7}
                dashArray="10, 10"
              />
            )}
        </MapContainer>

        <MapOverlay>
          <OverlayButton
            onClick={centerOnDriver}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚗 Driver
          </OverlayButton>
          <OverlayButton
            onClick={centerOnDestination}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📍 Destination
          </OverlayButton>
        </MapOverlay>
      </MapWrapper>

      <InfoPanel
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <InfoGrid>
          <InfoCard>
            <InfoIcon>📦</InfoIcon>
            <InfoLabel>Item</InfoLabel>
            <InfoValue>{schedule?.listing?.title || "Donation"}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>📅</InfoIcon>
            <InfoLabel>Scheduled</InfoLabel>
            <InfoValue>
              {schedule?.confirmedTime || schedule?.proposedTime || "TBD"}
            </InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>📍</InfoIcon>
            <InfoLabel>Distance</InfoLabel>
            <InfoValue>{formatDistance(distance) || "N/A"}</InfoValue>
          </InfoCard>
        </InfoGrid>

        {schedule?.driver && (
          <DriverInfo>
            <DriverAvatar>
              {schedule.driver.name?.charAt(0) || "D"}
            </DriverAvatar>
            <DriverDetails>
              <DriverName>{schedule.driver.name || "Driver"}</DriverName>
              <DriverMeta>
                <span>⭐ {schedule.driver.rating?.toFixed(1) || "4.8"}</span>
                <span>•</span>
                <span>{schedule.driver.completedPickups || "50"}+ pickups</span>
              </DriverMeta>
            </DriverDetails>
            <CallButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Call Driver"
            >
              📞
            </CallButton>
          </DriverInfo>
        )}

        <Timeline>
          <TimelineTitle>Pickup Progress</TimelineTitle>
          {PICKUP_STAGES.map((stage, index) => (
            <TimelineStep
              key={stage.id}
              $completed={index < currentStageIndex}
              $active={index === currentStageIndex}
            >
              <TimelineDot
                $completed={index < currentStageIndex}
                $active={index === currentStageIndex}
              >
                {index < currentStageIndex ? "✓" : stage.icon}
              </TimelineDot>
              <TimelineContent>
                <TimelineLabel $active={index === currentStageIndex}>
                  {stage.label}
                </TimelineLabel>
                {index === currentStageIndex && (
                  <TimelineTime>In progress</TimelineTime>
                )}
                {index < currentStageIndex && (
                  <TimelineTime>Completed</TimelineTime>
                )}
              </TimelineContent>
            </TimelineStep>
          ))}
        </Timeline>
      </InfoPanel>
    </Container>
  );
};

export default PickupTracker;
