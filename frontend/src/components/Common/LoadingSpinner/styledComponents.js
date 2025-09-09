import styled from 'styled-components';

const getSizeValue = (size) => {
  const sizes = {
    small: '16px',
    medium: '32px',
    large: '48px',
    xlarge: '64px'
  };
  return sizes[size] || sizes.medium;
};

export const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const FullPageSpinner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 9999;
  gap: 1rem;
`;

export const Spinner = styled.div`
  width: ${props => getSizeValue(props.size)};
  height: ${props => getSizeValue(props.size)};
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${props => props.color || '#4facfe'};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const SpinnerText = styled.div`
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
`;