// src/pages/Listings/styledComponents.js - COMPLETE FILE FOR SIDEBAR LAYOUT
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

export const ListingsContainer = styled.div`
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 2rem;
  transition: all var(--transition-base);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: var(--bg-card);
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ToggleButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  background: ${(props) =>
    props.$active ? "var(--gradient-primary)" : "transparent"};
  color: ${(props) => (props.$active ? "white" : "var(--text-secondary)")};

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--gradient-primary)" : "var(--bg-hover)"};
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
`;

export const ContentWrapper = styled.div`
  margin-top: 2rem;
`;

export const MapWrapper = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: var(--radius-lg);
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  filter: grayscale(30%);

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

export const EmptyText = styled.div`
  font-size: 1.5rem;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const EmptySubtext = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

export const RetryButton = styled.button.withConfig({ shouldForwardProp })`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  background: var(--bg-primary);
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
`;

export const PageButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.75rem 2rem;
  background: ${(props) =>
    props.disabled ? "var(--bg-secondary)" : "var(--gradient-primary)"};
  color: ${(props) => (props.disabled ? "var(--text-secondary)" : "white")};
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-base);
  box-shadow: ${(props) => (props.disabled ? "none" : "var(--shadow-md)")};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) => (props.disabled ? "none" : "var(--shadow-xl)")};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PageInfo = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 150px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
