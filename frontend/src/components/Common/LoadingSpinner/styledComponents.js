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
  background: var(--bg-overlay);
  backdrop-filter: blur(4px);
  z-index: 9999;
  gap: 1rem;`
;

// Update to use theme variables:
export const Spinner = styled.div`
  width: ${props => getSizeValue(props.size)};
  height: ${props => getSizeValue(props.size)};
  border: 3px solid var(--border-color);
  border-top: 3px solid ${props => props.color || 'var(--primary)'};
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
`;

export const SpinnerText = styled.div`
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
`;