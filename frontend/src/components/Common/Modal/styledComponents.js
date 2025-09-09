import styled from 'styled-components';

const getSizeValue = (size) => {
  const sizes = {
    small: '400px',
    medium: '600px',
    large: '800px',
    xlarge: '1000px'
  };
  return sizes[size] || sizes.medium;
};

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 10vh;
  }
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: ${props => getSizeValue(props.size)};
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    max-height: 85vh;
    margin: 0;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f7fafc;
    color: #4a5568;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalBody = styled.div`
  padding: ${props => {
    let vertical = '2rem';
    let horizontal = '2rem';
    
    if (!props.hasHeader && !props.hasFooter) {
      vertical = '2rem';
    } else if (!props.hasHeader || !props.hasFooter) {
      vertical = '1.5rem';
    } else {
      vertical = '1.5rem';
    }
    
    return `${vertical} ${horizontal}`;
  }};
  flex: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    flex-direction: column-reverse;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;