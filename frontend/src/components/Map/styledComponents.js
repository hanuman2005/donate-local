// src/components/Map/styledComponents.js - THEME INTEGRATED
import styled from "styled-components";

const motionProps = [
  "initial", "animate", "exit", "variants", "transition", "whileHover",
  "whileTap", "whileFocus", "whileDrag", "whileInView", "drag",
  "dragConstraints", "dragElastic", "dragMomentum", "layout", "layoutId",
  "onAnimationStart", "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

export const MapWrapper = styled.div`
  width: 100%;
  height: ${(props) => props.height || "500px"};
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-card);
  border: 2px solid var(--border);

  /* Leaflet popup custom styling */
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .leaflet-popup-content {
    margin: 12px;
    font-family: inherit;
  }

  .leaflet-popup-tip {
    background: var(--bg-card);
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
    box-shadow: var(--shadow-button) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }

  .leaflet-control-zoom a {
    border: none !important;
    background: var(--bg-card) !important;
    color: var(--text-primary) !important;
    font-size: 18px !important;
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;

    &:hover {
      background: var(--bg-hover) !important;
    }
  }

  /* Attribution styling */
  .leaflet-control-attribution {
    background: var(--bg-card) !important;
    color: var(--text-secondary) !important;
    backdrop-filter: blur(10px);
    border-radius: 8px 0 0 0 !important;
    font-size: 10px !important;
    border: 1px solid var(--border) !important;
  }

  .leaflet-control-attribution a {
    color: var(--primary) !important;
  }

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

export const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: 16px;

  div {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  p {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    div {
      font-size: 2.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--danger);
  background: var(--bg-danger, #fed7d7);
  border-radius: 16px;
  border: 2px solid var(--danger);

  div {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    padding: 0 2rem;
    color: var(--danger);
  }

  @media (max-width: 768px) {
    div {
      font-size: 2.5rem;
    }
    p {
      font-size: 1rem;
      padding: 0 1rem;
    }
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

export const ControlButton = styled.button.withConfig({ shouldForwardProp })`
  width: 44px;
  height: 44px;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow-button);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  color: var(--text-primary);

  &:hover {
    background: var(--bg-hover);
    transform: scale(1.1);
    box-shadow: var(--shadow-button-hover);
    border-color: var(--primary);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
`;

export const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  border: 2px solid var(--border);
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
    color: var(--text-primary);
    font-weight: 700;
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
  color: var(--text-secondary);
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateX(3px);
    color: var(--text-primary);
  }

  span {
    font-size: 0.8rem;
    font-weight: 600;
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
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: var(--shadow-lg);
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
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const InfoCategory = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const InfoDistance = styled.div`
  font-size: 0.9rem;
  color: var(--primary);
  font-weight: 700;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const InfoButton = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  margin-top: 12px;
  padding: 0.75rem 1.25rem;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-button);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button-hover);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
  }
`;