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
  background: var(--bg-primary);
  padding: 8rem 2rem 4rem;
  
  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 3rem;

  h1 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0 0 1rem 0;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.95;
    color: var(--text-secondary);
  }
`;

const Card = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  
  h2 {
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

const Button = styled.button.withConfig({ shouldForwardProp })`
  background: var(--gradient-primary);
  color: var(--text-inverse);
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-light);
  }

  .value {
    font-size: 2.5rem;
    font-weight: 900;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
  cursor: pointer;
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateX(4px);
  }

  h3 {
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 700;
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
      font-weight: 500;
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
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--primary-light);
      border-radius: var(--radius-sm);
      
      &:hover {
        background: var(--primary);
      }
    }
  }

  .pickup-item {
    padding: 0.75rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-fast);
    
    &:hover {
      background: var(--bg-hover);
      transform: translateX(4px);
    }
  }
`;

const MapWrapper = styled.div`
  height: 500px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-top: 2rem;
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--border-color);
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: var(--radius-xl);
  }
`;

const GreenCard = styled(Card)`
  background: var(--gradient-primary);
  color: var(--text-inverse);
  
  h3 {
    color: var(--text-inverse);
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
  }
  
  .value {
    color: var(--text-inverse) !important;
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: unset !important;
  }
  
  .label {
    color: rgba(255, 255, 255, 0.9) !important;
  }
`;

const routeColors = [
  "var(--primary)",
  "var(--success)",
  "var(--warning)",
  "var(--info)",
  "var(--error)",
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
    lat: 16.5062,
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

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <LoadingSkeleton width="100%" height="8rem" />
            <p aria-live="polite" style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
              Loading route optimizer...
            </p>
          </div>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
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

              <GreenCard>
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
              </GreenCard>

              <h2 style={{ color: "var(--text-primary)", marginTop: "2rem" }}>
                Optimized Routes
              </h2>
              {optimizedRoutes.routes.map((route, index) => (
                <RouteCard
                  key={index}
                  style={{
                    borderLeft: `4px solid ${
                      routeColors[index % routeColors.length]
                    }`,
                    boxShadow:
                      selectedRouteIdx === index
                        ? "0 0 0 3px var(--primary)"
                        : undefined,
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

              <MapWrapper>
                <MapContainer
                  center={
                    depot && depot.lat && depot.lon
                      ? [depot.lat, depot.lon]
                      : [0, 0]
                  }
                  zoom={12}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "var(--radius-xl)",
                  }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {depot && depot.lat && depot.lon && (
                    <Marker
                      position={[depot.lat, depot.lon]}
                      icon={L.divIcon({
                        html: '<div style="background:var(--primary);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:18px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);">🏢</div>',
                        className: "depot-marker",
                        iconSize: [28, 28],
                        iconAnchor: [14, 14],
                      })}
                    >
                      <Popup>Depot: {depot.name}</Popup>
                    </Marker>
                  )}
                  {optimizedRoutes.routes.map((route, idx) => {
                    const points = [
                      depot && depot.lat && depot.lon
                        ? [depot.lat, depot.lon]
                        : [0, 0],
                      ...route.pickups
                        .filter(
                          (p) =>
                            p.location && p.location.lat && p.location.lon
                        )
                        .map((p) => [p.location.lat, p.location.lon]),
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
                          dashArray:
                            selectedRouteIdx === idx ? null : "6 12",
                        }}
                      />
                    );
                  })}
                  {selectedRouteIdx !== null &&
                    optimizedRoutes.routes[selectedRouteIdx].pickups
                      .filter(
                        (pickup) =>
                          pickup.location &&
                          pickup.location.lat &&
                          pickup.location.lon
                      )
                      .map((pickup, i) => (
                        <Marker
                          key={i}
                          position={[
                            pickup.location.lat,
                            pickup.location.lon,
                          ]}
                          icon={L.divIcon({
                            html: `<div style="background:var(--success);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:15px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);">${
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
                      ))}
                </MapContainer>
              </MapWrapper>
            </>
          )}
        </Card>
      </Container>
    </PageContainer>
  );
};

export default RouteOptimizer;