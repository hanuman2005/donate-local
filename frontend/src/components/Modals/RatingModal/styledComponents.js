// ============================================
// src/components/RatingModal/styledComponents.js - ENHANCED
// ============================================
import styled from "styled-components";

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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
`;

export const ModalContainer = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  border: 2px solid var(--border);

  @media (max-width: 768px) {
    border-radius: 20px;
    max-width: 95%;
  }
`;

export const ModalHeader = styled.div`
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    h2 {
      font-size: 1.3rem;
    }
  }
`;

export const CloseButton = styled.button.withConfig({ shouldForwardProp })`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--text-on-primary);
  font-size: 1.75rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-weight: 300;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 2px solid var(--border);
`;

export const UserAvatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary);
  box-shadow: var(--shadow-card);

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

export const UserName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

export const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 2px solid var(--border);
`;

export const StarContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 3rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    font-size: 2.5rem;
  }
`;

export const Star = styled.button.withConfig({ shouldForwardProp })`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
  font-size: 3rem;
  line-height: 1;

  ${(props) =>
    props.$filled
      ? `
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
    opacity: 1;
  `
      : `
    opacity: 0.3;
    filter: grayscale(100%);
  `}

  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
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

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const ReviewTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s;
  background: var(--bg-secondary);
  color: var(--text-primary);
  line-height: 1.6;

  &::placeholder {
    color: var(--text-placeholder);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--shadow-input-focus);
    background: var(--bg-card);
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.875rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
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
  box-shadow: var(--shadow-button);

  &:hover:not(:disabled) {
    box-shadow: var(--shadow-button-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
  }
`;

export const CancelButton = styled.button.withConfig({ shouldForwardProp })`
  flex: 1;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--primary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
  }
`;
