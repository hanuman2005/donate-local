import LoadingSkeleton from "../../components/Common/LoadingSkeleton.js";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { routeAPI } from "../../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Framer Motion props that should not be forwarded to the DOM
const motionProps = [
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--gradient-primary);
  padding: 8rem 2rem 4rem;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 3rem;

  h1 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0 0 1rem 0;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.95;
  }
`;

const Card = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-xl);
`;

const Button = styled.button.withConfig({ shouldForwardProp })`
  background: var(--gradient-primary);
  color: var(--text-button);
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: var(--bg-statcard);
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;

  .value {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }

  .label {
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-weight: 600;
  }
`;

const RouteCard = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary);

  h3 {
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }

  .route-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .info-item {
    .label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.3rem;
    }

    .value {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
  }

  .pickups-list {
    margin-top: 1rem;
    max-height: 200px;
    overflow-y: auto;
  }

  .pickup-item {
    padding: 0.75rem;
    background: white;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
`;

const MapWrapper = styled.div`
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 2rem;
`;

const routeColors = [
  "#4299e1",
  "#48bb78",
  "#ed8936",
  "#9f7aea",
  "#f56565",
  "#38a169",
  "#ecc94b",
  "#805ad5",
  "#d53f8c",
  "#2b6cb0",
];

const RouteOptimizer = () => {
  const [pickups, setPickups] = useState([]);
  const [optimizedRoutes, setOptimizedRoutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [depot] = useState({
    lat: 16.5062, // Default: Bhimavaram
    lon: 81.5217,
    name: "NGO Depot",
  });
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(null);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const response = await routeAPI.getMyAssignedPickups();
      setPickups(response.data.pickups || []);

      if (response.data.pickups?.length > 0) {
        toast.success(`Found ${response.data.pickups.length} assigned pickups`);
      }
    } catch (error) {
      console.error("Error fetching pickups:", error);
      toast.error("Failed to fetch assigned pickups");
    }
  };

  const handleOptimize = async () => {
    if (pickups.length === 0) {
      toast.warning("No pickups to optimize");
      return;
    }

    setLoading(true);

    try {
      const response = await routeAPI.optimizeRoutes({
        depot,
        pickupIds: pickups.map((p) => p.id),
        vehicleType: "medium_car",
        maxPickupsPerRoute: 10,
      });

      setOptimizedRoutes(response.data);
      toast.success("✅ Routes optimized successfully!");
    } catch (error) {
      console.error("Optimization error:", error);
      toast.error("Failed to optimize routes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <LoadingSkeleton width="100%" height="8rem" />
          <p aria-live="polite">Loading route optimizer...</p>
        </div>
      ) : (
        <Container>
          <Header>
            <h1>🚗 Smart Route Optimizer</h1>
            <p>AI-powered pickup route planning with CO₂ optimization</p>
          </Header>

          <Card>
            <h2>Assigned Pickups: {pickups.length}</h2>
            <Button
              onClick={handleOptimize}
              disabled={loading || pickups.length === 0}
            >
              {loading ? "🔄 Optimizing..." : "🤖 Optimize Routes with AI"}
            </Button>

            {optimizedRoutes && (
              <>
                <StatsGrid>
                  <StatCard>
                    <div className="value">
                      {optimizedRoutes.summary.totalRoutes}
                    </div>
                    <div className="label">Optimized Routes</div>
                  </StatCard>
                  <StatCard>
                    <div className="value">
                      {optimizedRoutes.summary.totalDistance}km
                    </div>
                    <div className="label">Total Distance</div>
                  </StatCard>
                  <StatCard>
                    <div className="value">
                      {optimizedRoutes.summary.totalCO2}kg
                    </div>
                    <div className="label">CO₂ Emissions</div>
                  </StatCard>
                  <StatCard>
                    <div className="value">
                      {optimizedRoutes.summary.estimatedTotalTime}min
                    </div>
                    <div className="label">Estimated Time</div>
                  </StatCard>
                </StatsGrid>

                <Card
                  style={{
                    background:
                      "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                    color: "white",
                  }}
                >
                  <h3>🌍 Environmental Savings</h3>
                  <StatsGrid>
                    <div>
                      <div className="value">
                        {optimizedRoutes.summary.optimization.distanceSavedKm}km
                      </div>
                      <div className="label">Distance Saved</div>
                    </div>
                    <div>
                      <div className="value">
                        {optimizedRoutes.summary.optimization.co2SavedKg}kg
                      </div>
                      <div className="label">CO₂ Saved</div>
                    </div>
                    <div>
                      <div className="value">
                        {optimizedRoutes.summary.optimization.percentageSaved}%
                      </div>
                      <div className="label">Efficiency Gain</div>
                    </div>
                  </StatsGrid>
                </Card>

                <h2>Optimized Routes</h2>
                {optimizedRoutes.routes.map((route, index) => (
                  <RouteCard
                    key={index}
                    style={{
                      borderLeft: `4px solid ${
                        routeColors[index % routeColors.length]
                      }`,
                      boxShadow:
                        selectedRouteIdx === index
                          ? "0 0 0 3px #4299e1"
                          : undefined,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedRouteIdx(index)}
                    tabIndex={0}
                    aria-label={`Show Route ${route.routeNumber} on map`}
                  >
                    <h3>Route {route.routeNumber}</h3>
                    <div className="route-info">
                      <div className="info-item">
                        <div className="label">Stops</div>
                        <div className="value">{route.stops}</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Distance</div>
                        <div className="value">{route.totalDistance}km</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Time</div>
                        <div className="value">{route.estimatedTime}min</div>
                      </div>
                      <div className="info-item">
                        <div className="label">CO₂</div>
                        <div className="value">
                          {route.emissions.co2EmittedKg}kg
                        </div>
                      </div>
                    </div>

                    <div className="pickups-list">
                      {route.pickups.map((pickup, i) => (
                        <div key={i} className="pickup-item">
                          {i + 1}. {pickup.donorName} - {pickup.itemTitle} (
                          {pickup.quantity} {pickup.unit || "items"})
                        </div>
                      ))}
                    </div>
                  </RouteCard>
                ))}

                {/* Map showing all routes, highlight selected */}
                <MapWrapper>
                  <MapContainer
                    center={[depot.lat, depot.lon]}
                    zoom={12}
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Depot marker */}
                    <Marker
                      position={[depot.lat, depot.lon]}
                      icon={L.divIcon({
                        html: '<div style="background:#4299e1;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:18px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);">🏢</div>',
                        className: "depot-marker",
                        iconSize: [28, 28],
                        iconAnchor: [14, 14],
                      })}
                    >
                      <Popup>Depot: {depot.name}</Popup>
                    </Marker>
                    {/* Draw all routes as polylines, highlight selected */}
                    {optimizedRoutes.routes.map((route, idx) => {
                      // Build polyline: depot -> pickups (in order) -> depot (optional)
                      const points = [
                        [depot.lat, depot.lon],
                        ...route.pickups.map((p) => [
                          p.location.lat,
                          p.location.lon,
                        ]),
                        // Optionally, return to depot:
                        //[depot.lat, depot.lon]
                      ];
                      return (
                        <Polyline
                          key={idx}
                          positions={points}
                          pathOptions={{
                            color: routeColors[idx % routeColors.length],
                            weight:
                              selectedRouteIdx === null ||
                              selectedRouteIdx === idx
                                ? 7
                                : 3,
                            opacity:
                              selectedRouteIdx === null ||
                              selectedRouteIdx === idx
                                ? 0.9
                                : 0.3,
                            dashArray: selectedRouteIdx === idx ? null : "6 12",
                          }}
                        />
                      );
                    })}
                    {/* Pickup markers for selected route */}
                    {selectedRouteIdx !== null &&
                      optimizedRoutes.routes[selectedRouteIdx].pickups.map(
                        (pickup, i) => (
                          <Marker
                            key={i}
                            position={[
                              pickup.location.lat,
                              pickup.location.lon,
                            ]}
                            icon={L.divIcon({
                              html: `<div style="background:#48bb78;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:15px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);">${
                                i + 1
                              }</div>`,
                              className: "pickup-marker",
                              iconSize: [24, 24],
                              iconAnchor: [12, 12],
                            })}
                          >
                            <Popup>
                              <strong>{pickup.donorName}</strong>
                              <br />
                              {pickup.itemTitle} ({pickup.quantity}{" "}
                              {pickup.unit || "items"})
                            </Popup>
                          </Marker>
                        )
                      )}
                  </MapContainer>
                </MapWrapper>
              </>
            )}
          </Card>
        </Container>
      )}
    </PageContainer>
  );
};

export default RouteOptimizer;
