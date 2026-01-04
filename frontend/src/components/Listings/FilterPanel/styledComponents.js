// src/components/FiltersPanel/styledComponents.js - REDESIGNED
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
    margin-bottom: 2rem;
  }
`;

export const FiltersContainer = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`;

export const FiltersTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const FiltersSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const FilterIcon = styled.span`
  font-size: 2rem;
  background: var(--gradient-primary);
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  animation: pulse 3s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: var(--shadow-sm);
    }
    50% {
      transform: scale(1.05);
      box-shadow: var(--shadow-button);
    }
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.75rem;
  }
`;

export const ActiveFiltersCount = styled.span`
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
`;

// ========== SEARCH BAR ==========
export const SearchBar = styled.div`
  position: relative;
  z-index: 10;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 4rem 1.25rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: 16px;
  font-size: 1.05rem;
  font-family: inherit;
  font-weight: 500;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary);
    background: var(--bg-card);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: var(--shadow-input-focus);
  }

  &::placeholder {
    color: var(--text-placeholder);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem 3.5rem 1rem 1.25rem;
  }
`;

export const SearchButton = styled.button.withConfig({ shouldForwardProp })`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--gradient-primary);
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
  color: var(--text-on-primary);
  box-shadow: var(--shadow-button);

  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.05);
    box-shadow: var(--shadow-button-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    right: 0.5rem;
  }
`;

// ========== SEARCH HISTORY ==========
export const SearchHistoryDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  max-height: 320px;
  overflow-y: auto;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 3px;
  }
`;

export const HistoryItem = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);

  &:hover {
    background: var(--bg-secondary);
    padding-left: 1.5rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ClearHistoryButton = styled.button.withConfig({
  shouldForwardProp,
})`
  background: transparent;
  border: 2px solid var(--danger);
  color: var(--danger);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: var(--danger);
    color: var(--text-on-primary);
  }
`;

// ========== CATEGORIES ==========
export const MultiSelectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }
`;

export const CategoryTag = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 2px solid
    ${(props) => (props.$selected ? "var(--primary)" : "var(--border)")};
  background: ${(props) =>
    props.$selected ? "var(--gradient-primary)" : "var(--bg-secondary)"};
  color: ${(props) =>
    props.$selected ? "var(--text-on-primary)" : "var(--text-primary)"};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$selected ? "var(--shadow-button-hover)" : "var(--shadow-sm)"};
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.75rem 0.875rem;
  }
`;

// ========== ADVANCED TOGGLE ==========
export const AdvancedToggle = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.875rem 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: var(--gradient-primary);
    color: var(--text-on-primary);
    border-color: var(--primary);
    transform: translateX(5px);
  }
`;

// ========== ADVANCED FILTERS CONTAINER ==========
export const AdvancedFiltersContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  transition: max-height 0.3s ease;
  background: var(--bg-card, #fff);
  color: var(--text-primary, #222);
  padding: 1.5rem;
  border-radius: 12px;
`;

// ========== FILTER GROUP ==========
export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Label = styled.label`
  font-weight: 700;
  color: var(--text-primary);
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
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--bg-card);
    border-color: var(--primary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--shadow-input-focus);
    background: var(--bg-card);
  }

  option {
    padding: 0.5rem;
    font-weight: 500;
  }
`;

export const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-card);
    border-color: var(--primary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--shadow-input-focus);
    background: var(--bg-card);
  }

  &::placeholder {
    color: var(--text-placeholder);
  }

  &[type="range"] {
    padding: 0;
    height: 8px;
    cursor: pointer;
    accent-color: var(--primary);
  }

  &[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: ${(props) => (props.theme?.mode === "dark" ? "invert(1)" : "none")};
  }
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Button = styled.button.withConfig({ shouldForwardProp })`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.$primary
      ? `
    background: var(--gradient-primary);
    color: var(--text-on-primary);
    box-shadow: var(--shadow-button);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-button-hover);
    }
  `
      : props.$secondary
      ? `
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border);

    &:hover:not(:disabled) {
      background: var(--bg-hover);
      border-color: var(--primary);
    }
  `
      : ""}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 0.5rem;
  border: 2px solid;

  ${(props) =>
    props.$success
      ? `
    background: var(--bg-success, #d1fae5);
    border-color: var(--success);
    color: var(--success);
  `
      : props.$error
      ? `
    background: var(--bg-danger, #fee2e2);
    border-color: var(--danger);
    color: var(--danger);
  `
      : ""}
`;

export const LocationIcon = styled.span`
  font-size: 1.3rem;
`;

export const LocationText = styled.span`
  flex: 1;
`;

// ========== DATE RANGE ==========
export const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DateLabel = styled.label`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
`;

export const DateInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: var(--shadow-input-focus);
  }

  &::-webkit-calendar-picker-indicator {
    filter: ${(props) => (props.theme?.mode === "dark" ? "invert(1)" : "none")};
    cursor: pointer;
  }
`;

// ========== SAVED SEARCHES ==========
export const SavedSearchesContainer = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid var(--border);
`;

export const SavedSearchesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const SavedSearchesTitle = styled.h4`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SaveSearchButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.65rem 1.25rem;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SavedSearchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SavedSearchItem = styled.div.withConfig({ shouldForwardProp })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    background: var(--bg-hover);
    transform: translateX(5px);
  }

  strong {
    color: var(--text-primary);
    font-size: 0.95rem;
  }
`;

export const DeleteSavedSearch = styled.button.withConfig({
  shouldForwardProp,
})`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
  line-height: 1;

  &:hover {
    color: var(--danger);
    background: var(--bg-secondary);
  }
`;

// ========== SEARCH ALERTS ==========
export const AlertToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 12px;
  margin-top: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--success);
    background: var(--bg-success, #d1fae5);
  }
`;

export const AlertCheckbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: var(--success);
  cursor: pointer;
`;

export const AlertLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  color: var(--text-primary);
`;
