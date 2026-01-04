// src/components/ListingCard/styledComponents.js - THEME INTEGRATED
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

export const CardContainer = styled.div`
  background: var(--bg-card);
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: var(--bg-secondary);

  @media (max-width: 768px) {
    height: 180px;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${CardContainer}:hover & {
    transform: scale(1.08);
  }
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-on-primary);

  span {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
  }

  p {
    font-size: 0.95rem;
    font-weight: 600;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    span {
      font-size: 3rem;
    }
    p {
      font-size: 0.85rem;
    }
  }
`;

export const StatusBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => {
    const color = props.color || 'var(--success)';
    return color;
  }};
  color: var(--text-on-primary);
  padding: 0.5rem 0.875rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: var(--shadow-button);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.7rem;
  }
`;

export const CategoryBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--bg-card);
  color: var(--primary);
  padding: 0.5rem 0.875rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: capitalize;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--border);

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }
`;

export const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 0.75rem;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

export const CardDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
`;

export const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 2px solid var(--border);
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const MetaIcon = styled.span`
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export const MetaText = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

export const CardFooter = styled.div`
  padding: 1.25rem 1.5rem;
  border-top: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--bg-secondary);

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
  }
`;

export const ContactButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  font-size: 1rem;
  font-weight: 700;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  box-shadow: var(--shadow-button);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button-hover);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.75rem 1.25rem;
    min-height: 44px;
  }
`;

export const ViewButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--primary);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.65rem 1rem;
  }
`;

export const OwnerActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
`;

export const EditButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--success);
  color: var(--text-on-primary);
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-sm);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
    box-shadow: var(--shadow-button);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.65rem 0.875rem;
  }
`;

export const DeleteButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--danger);
  color: var(--text-on-primary);
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-sm);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
    box-shadow: var(--shadow-button);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.65rem 0.875rem;
  }
`;

export const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid transparent;
  border-top: 3px solid currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const QuickClaimButton = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: var(--text-on-primary);
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: var(--bg-disabled, #cbd5e0);
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.875rem 1.25rem;
  }
`;

// Additional utility component for QR Scan button
export const QRScanButton = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-button);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button-hover);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.75rem 1rem;
  }
`;