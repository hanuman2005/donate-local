import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { impactAPI } from "../../services/api";
import { io } from "socket.io-client";
import styled from "styled-components";
import { toast } from "react-toastify";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const DigitalTwin = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [data, setData] = useState({ points: [], flows: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check for Mapbox token
    if (!mapboxgl.accessToken) {
      console.error("Mapbox token not found");
      toast.error("Map configuration error");
      setLoading(false);
      return;
    }

    // Initialize map
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-98, 39],
        zoom: 4,
      });

      map.current.on("load", () => {
        fetchData();
      });
    }

    // Socket.IO listener
    const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

    socket.on("digitalTwin.update", (update) => {
      if (update?.location) {
        addPulsingMarker(update.location);
      }
    });

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await impactAPI.getDigitalTwin();

      if (response.data?.data) {
        setData(response.data.data);
        renderHeatmap(response.data.data.points || []);
        renderFlows(response.data.data.flows || []);
      }
    } catch (error) {
      console.error("Failed to fetch digital twin data:", error);
      toast.error("Failed to load map data");
    } finally {
      setLoading(false);
    }
  };

  const renderHeatmap = (points) => {
    if (!points || points.length === 0 || !map.current) return;

    if (!map.current.getSource("impacts")) {
      map.current.addSource("impacts", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points.map((p) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [p.lng || 0, p.lat || 0],
            },
            properties: {
              count: p.count || 0,
              co2: p.impact?.co2SavedKg || 0,
            },
          })),
        },
      });

      map.current.addLayer({
        id: "impacts-heat",
        type: "heatmap",
        source: "impacts",
        paint: {
          "heatmap-weight": ["get", "count"],
          "heatmap-intensity": 1,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "var(--heatmap-0)",
            0.2,
            "var(--heatmap-1)",
            0.4,
            "var(--heatmap-2)",
            0.6,
            "var(--heatmap-3)",
            0.8,
            "var(--heatmap-4)",
            1,
            "var(--heatmap-5)",
          ],
          "heatmap-radius": 30,
        },
      });
    }
  };

  const renderFlows = (flows) => {
    if (!flows || flows.length === 0 || !map.current) return;

    flows.forEach((flow, index) => {
      const id = `flow-${index}`;

      if (!map.current.getSource(id) && flow.from && flow.to) {
        map.current.addSource(id, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [flow.from, flow.to],
            },
          },
        });

        map.current.addLayer({
          id: id,
          type: "line",
          source: id,
          paint: {
            "line-color": "var(--flow-line-color)",
            "line-width": 2,
            "line-opacity": 0.6,
          },
        });
      }
    });
  };

  const addPulsingMarker = (coordinates) => {
    if (!coordinates || !map.current) return;

    const el = document.createElement("div");
    el.className = "pulse-marker";

    new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map.current);

    setTimeout(() => el.remove(), 5000);
  };

  return (
    <Container>
      <Header>
        <Title>🌍 Digital Twin Impact Dashboard</Title>
        <Stats>
          <Stat>
            <Value>
              {(data.points || []).reduce((s, p) => s + (p.count || 0), 0)}
            </Value>
            <Label>Donations</Label>
          </Stat>
          <Stat>
            <Value>
              {(data.points || [])
                .reduce((s, p) => s + (p.impact?.co2SavedKg || 0), 0)
                .toFixed(1)}
              kg
            </Value>
            <Label>CO₂ Saved</Label>
          </Stat>
        </Stats>
      </Header>
      <MapContainer ref={mapContainer} />
      {loading && <LoadingOverlay>Loading map data...</LoadingOverlay>}
    </Container>
  );
};

// Styled components (same as before, plus:)
const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
          {loading && (
            <LoadingOverlay>
              <LoadingSkeleton width="100%" height="8rem" />
              <span aria-live="polite">Loading digital twin...</span>
            </LoadingOverlay>
          )}
  color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  font-size: 1.2rem;
  z-index: 1000;
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: var(--gradient-primary);
  padding: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem 0;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: 800;
`;

const Label = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const MapContainer = styled.div`
  flex: 1;
`;

export default DigitalTwin;
