// src/components/FiltersPanel/styledComponents.js - ENHANCED
import styled from "styled-components";

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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(30%, -30%);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
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
    0%,
    100% {
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

// ✅ NEW: Search Bar
export const SearchBar = styled.div`
  position: relative;
  z-index: 10;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3.5rem 1rem 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 1.1rem;
  font-family: inherit;
  font-weight: 500;
  background: white;
  color: #2d3748;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: white;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const SearchButton = styled.button.withConfig({ shouldForwardProp })`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ✅ NEW: Search History Dropdown
export const SearchHistoryDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
`;

export const HistoryItem = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  padding: 1rem;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  border-bottom: 1px solid #f7fafc;

  &:hover {
    background: #f7fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ClearHistoryButton = styled.button.withConfig({
  shouldForwardProp,
})`
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #fed7d7;
  }
`;

// ✅ NEW: Multi-Select Categories
export const MultiSelectContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
`;

export const CategoryTag = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 2px solid
    ${(props) => (props.$selected ? "white" : "rgba(255, 255, 255, 0.3)")};
  background: ${(props) =>
    props.$selected ? "white" : "rgba(255, 255, 255, 0.15)"};
  color: ${(props) => (props.$selected ? "#667eea" : "white")};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${(props) =>
      props.$selected ? "white" : "rgba(255, 255, 255, 0.25)"};
    border-color: white;
    transform: translateY(-2px);
  }
`;

// ✅ NEW: Advanced Toggle
export const AdvancedToggle = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  position: relative;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: white;
  }
`;

export const SaveSearchButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.75rem 1.5rem;
  background: rgba(72, 187, 120, 0.2);
  border: 2px solid rgba(72, 187, 120, 0.4);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(72, 187, 120, 0.3);
    transform: translateY(-2px);
  }
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

  &[type="range"] {
    padding: 0;
    height: 8px;
    cursor: pointer;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled.button.withConfig({ shouldForwardProp })`
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
  `
      : ""}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  `
      : ""}
`;

export const LocationIcon = styled.span`
  font-size: 1.2rem;
`;

export const LocationText = styled.span`
  flex: 1;
`;

// ✅ NEW: Date Range Picker
export const DateRangeContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const DateInputGroup = styled.div`
  flex: 1;
  min-width: 140px;
`;

export const DateLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

export const DateInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: white;
    background: rgba(255, 255, 255, 0.2);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

// ✅ NEW: Saved Searches
export const SavedSearchesContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  z-index: 1;
`;

export const SavedSearchesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const SavedSearchesTitle = styled.h4`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;


export const SavedSearchList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SavedSearchItem = styled.div.withConfig({ shouldForwardProp })`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 0.8rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

export const DeleteSavedSearch = styled.button.withConfig({
  shouldForwardProp,
})`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #ff6b6b;
  }
`;

// ✅ NEW: Search Alerts Toggle
export const AlertToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(72, 187, 120, 0.2);
  border: 2px solid rgba(72, 187, 120, 0.4);
  border-radius: 10px;
  color: white;
`;

export const AlertCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #48bb78;
  cursor: pointer;
`;

export const AlertLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
`;
