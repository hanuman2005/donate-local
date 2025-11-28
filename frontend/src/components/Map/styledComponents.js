// src/components/Map/styledComponents.js - UPDATED FOR LEAFLET
import styled from 'styled-components';

export const MapWrapper = styled.div`
  width: 100%;
  height: ${props => props.height || '500px'};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  /* Leaflet popup custom styling */
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .leaflet-popup-content {
    margin: 12px;
    font-family: inherit;
  }

  /* Custom marker animation */
  .custom-marker {
    animation: markerPop 0.3s ease-out;
  }

  @keyframes markerPop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* User marker pulse animation */
  .user-marker {
    animation: userPulse 2s infinite;
  }

  @keyframes userPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.6;
    }
  }

  /* Zoom controls styling */
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
    border-radius: 8px !important;
    overflow: hidden;
  }

  .leaflet-control-zoom a {
    border: none !important;
    background: white !important;
    color: #4a5568 !important;
    font-size: 18px !important;
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    
    &:hover {
      background: #f7fafc !important;
    }
  }

  /* Attribution styling */
  .leaflet-control-attribution {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(10px);
    border-radius: 8px 0 0 0 !important;
    font-size: 10px !important;
  }
`;

export const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 12px;

  div {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
  }

  p {
    font-size: 1.1rem;
    font-weight: 500;
    color: #475569;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #e53e3e;
  background: #fed7d7;
  border-radius: 12px;

  div {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
    padding: 0 2rem;
  }
`;

export const MapControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`;

export const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f7fafc;
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

export const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-size: 0.85rem;
  max-width: 200px;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h4 {
    color: #2d3748;
    font-weight: 600;
    margin: 0 0 8px 0;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    bottom: 60px;
    right: 10px;
    max-width: 150px;
    padding: 0.75rem;
    font-size: 0.75rem;

    h4 {
      font-size: 12px;
      margin-bottom: 6px;
    }
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateX(3px);
    color: #2d3748;
  }

  span {
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.2;
  }

  @media (max-width: 768px) {
    gap: 0.4rem;
    margin-bottom: 0.4rem;

    span {
      font-size: 0.7rem;
    }
  }
`;

export const MarkerInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  max-width: 320px;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: calc(100% - 40px);
    padding: 1rem;
  }
`;

export const InfoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const InfoCategory = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const InfoDistance = styled.div`
  font-size: 0.85rem;
  color: #4299e1;
  font-weight: 600;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const InfoButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;