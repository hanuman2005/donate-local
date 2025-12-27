// src/components/QRCode/styledComponents.js
import styled, { keyframes } from "styled-components";

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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const QRContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.4s ease;
`;

export const QRWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  margin: 1.5rem 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const QRImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 12px;
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  color: #2d3748;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 700;
`;

export const Description = styled.p`
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: center;
  margin: 1rem 0;

  strong {
    color: #2d3748;
    font-weight: 600;
  }
`;

export const Button = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  padding: 0.875rem 1.5rem;
  margin: 0.5rem 0;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${(props) =>
    props.$primary
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  `
      : `
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;

    &:hover:not(:disabled) {
      border-color: #667eea;
      background: #edf2f7;
    }
  `}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const InfoCard = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.25rem;
  margin: 1.5rem 0;
  border: 1px solid #e2e8f0;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  color: #718096;
  font-weight: 600;
  font-size: 0.95rem;
`;

export const Value = styled.span`
  color: #2d3748;
  font-weight: 500;
  font-size: 0.95rem;
  text-align: right;
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  margin: 2rem auto;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;

  ${Button} {
    margin: 0;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) => {
    switch (props.$status) {
      case "pending":
        return `
          background: #feebc8;
          color: #c05621;
        `;
      case "completed":
        return `
          background: #c6f6d5;
          color: #2f855a;
        `;
      case "expired":
        return `
          background: #fed7d7;
          color: #c53030;
        `;
      case "error":
        return `
          background: #fed7d7;
          color: #c53030;
        `;
      default:
        return `
          background: #bee3f8;
          color: #2c5282;
        `;
    }
  }}
`;

export const ExpiryTimer = styled.span`
  font-weight: 700;
  font-size: 1rem;

  ${(props) =>
    props.$expired
      ? `
    color: #e53e3e;
  `
      : `
    color: #38a169;
  `}
`;
