import styled from "styled-components";

export const FiltersWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto 3rem auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const FiltersContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.25);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: end;
  position: relative;
  overflow: hidden;
  animation: slideDown 0.5s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    padding: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1.25rem;
  }
`;

export const FiltersTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const FiltersSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const FilterIcon = styled.span`
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

export const ActiveFiltersCount = styled.span`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
`;

export const Label = styled.label`
  font-weight: 700;
  color: white;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1.2rem;
  }
`;

export const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.95);
  color: #2d3748;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: white;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: white;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
    background: white;
  }

  option {
    padding: 0.5rem;
    font-weight: 500;
  }
`;

export const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.95);
  color: #2d3748;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: white;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
    background: white;
  }

  &::placeholder {
    color: #a0aec0;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: brightness(0) invert(0.5);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  grid-column: span 2;

  @media (max-width: 1024px) {
    grid-column: span 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled.button`
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  ${(props) =>
    props.$primary
      ? `
    background: white;
    color: #667eea;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `
      : props.$secondary
      ? `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      border-color: white;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `
      : ""}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;

  ${(props) =>
    props.$success
      ? `
    background: rgba(72, 187, 120, 0.2);
    border: 2px solid rgba(72, 187, 120, 0.4);
    color: white;
  `
      : props.$error
      ? `
    background: rgba(229, 62, 62, 0.2);
    border: 2px solid rgba(229, 62, 62, 0.4);
    color: white;
    grid-column: span 2;
    
    @media (max-width: 1024px) {
      grid-column: span 1;
    }
  `
      : ""}
`;

export const LocationIcon = styled.span`
  font-size: 1.2rem;
`;

export const LocationText = styled.span`
  flex: 1;
`;