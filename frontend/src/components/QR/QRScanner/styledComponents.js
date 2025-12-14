// src/components/QRScanner/styledComponents.js
import styled, { keyframes } from 'styled-components';

const scan = keyframes`
  0% { top: 0; }
  50% { top: calc(100% - 3px); }
  100% { top: 0; }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const dotPulse = keyframes`
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`;

export const ScannerContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
`;

export const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
  min-height: 300px;
  object-fit: cover;
`;

export const ScanOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border: 3px solid #667eea;
  border-radius: 16px;
  box-shadow: 
    0 0 0 9999px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(102, 126, 234, 0.5);

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid #667eea;
  }

  &::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
  }

  &::after {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
  }
`;

export const ScanLine = styled.div`
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent, 
    #667eea 30%, 
    #764ba2 50%, 
    #667eea 70%, 
    transparent
  );
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.8);
  animation: ${scan} 2s linear infinite;
`;

export const Button = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  margin-top: 1rem;
  border-radius: 12px;
  border: none;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  ` : `
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

export const Message = styled.div`
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
  animation: ${fadeIn} 0.3s ease;

  ${props => {
    switch(props.type) {
      case 'error':
        return `
          background: #fed7d7;
          color: #c53030;
          border: 2px solid #fc8181;
        `;
      case 'success':
        return `
          background: #c6f6d5;
          color: #2f855a;
          border: 2px solid #9ae6b4;
        `;
      case 'warning':
        return `
          background: #feebc8;
          color: #c05621;
          border: 2px solid #fbd38d;
        `;
      default:
        return `
          background: #bee3f8;
          color: #2c5282;
          border: 2px solid #90cdf4;
        `;
    }
  }}
`;

export const VerificationCard = styled.div`
  background: linear-gradient(135deg, #f7fafc 0%, #e6fffa 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 1.5rem;
  border: 3px solid #48bb78;
  animation: ${scaleIn} 0.4s ease;

  h3 {
    color: #2f855a;
    margin: 1rem 0 1.5rem;
    font-size: 1.5rem;
  }

  h4 {
    color: #2d3748;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  color: #718096;
  font-weight: 600;
`;

export const Value = styled.span`
  color: #2d3748;
  font-weight: 500;
  text-align: right;
`;

export const StatusIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const LoadingDots = styled.span`
  display: inline-block;

  &::after {
    content: '...';
    display: inline-block;
    animation: ${dotPulse} 1.4s infinite;
  }
`;