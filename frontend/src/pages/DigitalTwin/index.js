import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { impactAPI } from '../../services/api';
import { io } from 'socket.io-client';
import styled from 'styled-components';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const DigitalTwin = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [data, setData] = useState({ points: [], flows: [] });

  useEffect(() => {
    // Initialize map
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98, 39],
        zoom: 4
      });

      map.current.on('load', () => {
        fetchData();
      });
    }

    // Socket.IO listener
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on('digitalTwin.update', (update) => {
      addPulsingMarker(update.location);
    });

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    const response = await impactAPI.getDigitalTwin();
    setData(response.data.data);
    renderHeatmap(response.data.data.points);
    renderFlows(response.data.data.flows);
  };

  const renderHeatmap = (points) => {
    if (!map.current.getSource('impacts')) {
      map.current.addSource('impacts', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: points.map(p => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [p.lng, p.lat]
            },
            properties: {
              count: p.count,
              co2: p.impact.co2SavedKg
            }
          }))
        }
      });

      map.current.addLayer({
        id: 'impacts-heat',
        type: 'heatmap',
        source: 'impacts',
        paint: {
          'heatmap-weight': ['get', 'count'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': 30
        }
      });
    }
  };

  const renderFlows = (flows) => {
    flows.forEach((flow, index) => {
      const id = `flow-${index}`;
      
      if (!map.current.getSource(id)) {
        map.current.addSource(id, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [flow.from, flow.to]
            }
          }
        });

        map.current.addLayer({
          id: id,
          type: 'line',
          source: id,
          paint: {
            'line-color': '#00f2fe',
            'line-width': 2,
            'line-opacity': 0.6
          }
        });
      }
    });
  };

  const addPulsingMarker = (coordinates) => {
    const el = document.createElement('div');
    el.className = 'pulse-marker';
    
    new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map.current);

    setTimeout(() => el.remove(), 5000);
  };

  return (
    <Container>
      <Header>
        <Title>🌍 Digital Twin Impact Dashboard</Title>
        <Stats>
          <Stat>
            <Value>{data.points.reduce((s, p) => s + p.count, 0)}</Value>
            <Label>Donations</Label>
          </Stat>
          <Stat>
            <Value>
              {data.points.reduce((s, p) => s + p.impact?.co2SavedKg || 0, 0).toFixed(1)}kg
            </Value>
            <Label>CO₂ Saved</Label>
          </Stat>
        </Stats>
      </Header>
      <MapContainer ref={mapContainer} />
    </Container>
  );
};

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