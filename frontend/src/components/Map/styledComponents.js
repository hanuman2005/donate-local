import styled from 'styled-components';

export const MapContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '400px'};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  background: #f8fafc;

  div {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  p {
    font-size: 1.1rem;
    font-weight: 500;
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
  z-index: 100;
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
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
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
  z-index: 100;

  @media (max-width: 768px) {
    position: static;
    margin-top: 1rem;
    max-width: none;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  color: #4a5568;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

export const MarkerInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  z-index: 200;
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
`;

export const InfoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
`;

export const InfoCategory = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
`;

export const InfoDistance = styled.div`
  font-size: 0.85rem;
  color: #4299e1;
  font-weight: 500;
`;