// src/pages/MyPickups/styledComponents.js - Updated with Theme Variables
import styled from "styled-components";
import { motion } from "framer-motion";

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

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-primary);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const Title = styled.h1`
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 800;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-light);
  }
`;

export const ListingTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  background: ${(props) =>
    props.$status === "pending" ? "var(--warning)" : "var(--success)"};
  color: var(--text-inverse);
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-light);
  
  &:last-of-type {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  color: var(--text-secondary);
  font-weight: 500;
`;

export const Value = styled.span`
  color: var(--text-primary);
  font-weight: 600;
`;

export const Button = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  padding: 0.75rem;
  background: var(--gradient-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  font-size: 0.95rem;

  &:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-lg);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const SecondaryButton = styled(Button)`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  box-shadow: none;
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--primary);
    color: var(--primary);
  }
`;

export const QRSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--border-color);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);

  h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.75rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.05rem;
    line-height: 1.6;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    
    h2 {
      font-size: 1.5rem;
    }
  }
`;