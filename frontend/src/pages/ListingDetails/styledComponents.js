// src/pages/ListingDetails/styledComponents.js - FIXED FOR SIDEBAR LAYOUT
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

export const DetailsContainer = styled.div`
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  transition: all var(--transition-base);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

export const BackButton = styled.button.withConfig({ shouldForwardProp })`
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(-4px);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.6rem 0.8rem;
  }
`;

export const Card = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: var(--radius-lg);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  font-size: 0.95rem;
  font-weight: 700;
  background: ${(props) => {
    switch (props.$status) {
      case "available":
        return "var(--success)";
      case "pending":
        return "var(--warning)";
      case "completed":
        return "var(--info)";
      case "expired":
        return "var(--error)";
      default:
        return "#a0aec0";
    }
  }};
  color: white;
  margin-bottom: 1.5rem;
  text-transform: capitalize;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

export const DetailSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }
`;

export const Label = styled.p`
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Value = styled.p`
  color: var(--text-primary);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled.button.withConfig({ shouldForwardProp })`
  flex: 1;
  min-width: 150px;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-md);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-xl);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
`;

export const WantButton = styled(ActionButton)`
  background: var(--gradient-success);
  color: white;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
  }
`;

export const ContactButton = styled(ActionButton)`
  background: var(--gradient-info);
  color: white;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
  }
`;

export const EditButton = styled(ActionButton)`
  background: var(--success);
  color: white;

  &:hover:not(:disabled) {
    background: var(--success-light);
  }
`;

export const DeleteButton = styled(ActionButton)`
  background: var(--error);
  color: white;

  &:hover:not(:disabled) {
    background: var(--error-light);
  }
`;

export const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageItem = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--border-color);

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

export const QRSection = styled.div`
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  color: white;
  margin-top: 2rem;
  box-shadow: var(--shadow-lg);
  text-align: center;

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
    opacity: 0.95;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    h3 {
      font-size: 1.3rem;
    }
  }
`;

export const QueueSection = styled(QRSection)`
  margin-top: 2rem;
  text-align: left;

  h3 {
    text-align: center;
  }
`;

export const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const QueueItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all var(--transition-base);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const QueueUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const QueueUserName = styled.div`
  font-weight: 600;
  font-size: 1.05rem;
`;

export const QueueTimestamp = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

export const PositionBadge = styled.span`
  background: ${(props) =>
    props.$isUser ? "var(--success)" : "rgba(255, 255, 255, 0.25)"};
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  color: var(--error);
  font-size: 1.3rem;
  font-weight: 600;
  background: var(--error-bg);
  border-radius: var(--radius-xl);
  border: 2px solid var(--error);
  margin: 2rem auto;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    font-size: 1.1rem;
  }
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

export const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
`;
