import React, { useEffect } from 'react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from './styledComponents';

// Track how many modals are open
let modalCount = 0;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer = null,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  // Handle escape key and body scroll lock
  useEffect(() => {
    if (isOpen) {
      modalCount++;
      
      // Only lock scroll if this is the first modal
      if (modalCount === 1) {
        document.body.classList.add('modal-open');
      }

      const handleEscape = (e) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        modalCount--;
        
        // Only unlock scroll if no modals are open
        if (modalCount === 0) {
          document.body.classList.remove('modal-open');
        }
      };
    }
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer size={size} onClick={(e) => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalCloseButton 
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </ModalCloseButton>
          </ModalHeader>
        )}
        
        <ModalBody hasHeader={!!title} hasFooter={!!footer}>
          {children}
        </ModalBody>
        
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;