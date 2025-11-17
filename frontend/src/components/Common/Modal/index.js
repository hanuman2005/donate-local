// ============================================
// src/components/Modal/index.jsx - WITH MOTION
// ============================================
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionVariants } from "../../animations/motionVariants";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "./styledComponents";

let modalCount = 0;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      modalCount++;

      if (modalCount === 1) {
        document.body.classList.add("modal-open");
      }

      const handleEscape = (e) => {
        if (closeOnEscape && e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        modalCount--;

        if (modalCount === 0) {
          document.body.classList.remove("modal-open");
        }
      };
    }
  }, [isOpen, onClose, closeOnEscape]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          as={motion.div}
          variants={motionVariants.modalBackdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={handleOverlayClick}
        >
          <ModalContainer
            as={motion.div}
            variants={motionVariants.modalContent}
            size={size}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
                <ModalCloseButton
                  as={motion.button}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
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

            {footer && <ModalFooter>{footer}</ModalFooter>}
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
