import styled from "styled-components";

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-overlay);
  color: var(--text-inverse);
  padding: 2rem;
  border-radius: var(--radius-lg);
  font-size: 1.2rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-xl);
`;

export const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
`;

export const Header = styled.div`
  background: var(--gradient-primary);
  padding: 2rem;
  color: var(--text-inverse);
  box-shadow: var(--shadow-lg);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem 0;
  font-weight: 800;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const Stats = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const Stat = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
  }
`;

export const Value = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-inverse);
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const Label = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  color: var(--text-inverse);
  margin-top: 0.25rem;
`;

export const MapContainer = styled.div`
  flex: 1;
  position: relative;
  
  /* Mapbox GL custom theming */
  .mapboxgl-ctrl-group {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
  }
  
  .mapboxgl-ctrl button {
    background: var(--bg-card);
    color: var(--text-primary);
    
    &:hover {
      background: var(--bg-hover);
    }
  }
  
  .mapboxgl-popup-content {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-md);
  }
  
  .mapboxgl-popup-close-button {
    color: var(--text-primary);
    font-size: 1.5rem;
    padding: 0 0.5rem;
    
    &:hover {
      background: var(--bg-hover);
      color: var(--primary);
    }
  }
  
  /* Pulse marker animation */
  .pulse-marker {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    background: var(--primary);
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.7);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.7);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(var(--primary-rgb), 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
    }
  }
`;