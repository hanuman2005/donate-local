// ============================================
// src/components/RatingModal/styledComponents.js - NEW FILE
// ============================================
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

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-overlay-bg, rgba(0, 0, 0, 0.6));
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContainer = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
`;

export const CloseButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--modal-close-bg, rgba(255, 255, 255, 0.2));
  border: none;
  color: var(--text-on-primary);
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: var(--modal-close-hover-bg, rgba(255, 255, 255, 0.3));
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 16px;
`;

export const UserAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--bg-card);
  box-shadow: var(--shadow-md);
`;

export const UserName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const StarContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 3rem;
`;

export const Star = styled.button.withConfig({ shouldForwardProp })`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
  font-size: 3rem;

  ${(props) =>
    props.$filled
      ? "filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));"
      : "opacity: 0.3;"}

  &:hover {
    transform: scale(1.2);
  }
`;

export const Label = styled.label`
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const ReviewTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--modal-focus-shadow, rgba(102, 126, 234, 0.1));
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const SubmitButton = styled.button.withConfig({ shouldForwardProp })`
  flex: 1;
  padding: 1rem 2rem;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    box-shadow: var(--shadow-lg);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button.withConfig({ shouldForwardProp })`
  flex: 1;
  padding: 1rem 2rem;
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
