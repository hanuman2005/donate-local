// src/components/ContactModal/index.jsx - THEME INTEGRATED
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { motionVariants } from '../../animations/motionVariants';

const motionProps = [
  "initial", "animate", "exit", "variants", "transition", "whileHover",
  "whileTap", "whileFocus", "whileDrag", "whileInView", "drag",
  "dragConstraints", "dragElastic", "dragMomentum", "layout", "layoutId",
  "onAnimationStart", "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

const ModalOverlay = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid var(--border);

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-secondary);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ModalSubtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const FormField = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
  background: var(--bg-secondary);
  color: var(--text-primary);

  &::placeholder {
    color: var(--text-placeholder);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--shadow-input-focus);
    background: var(--bg-card);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s;
  background: var(--bg-secondary);
  color: var(--text-primary);

  &::placeholder {
    color: var(--text-placeholder);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--shadow-input-focus);
    background: var(--bg-card);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: all 0.3s;

  &:hover:not(:disabled) {
    box-shadow: var(--shadow-button-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: var(--bg-success, #c6f6d5);
  color: var(--success);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 2px solid var(--success);
`;

const ContactInfo = styled(motion.div)`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.95rem;

  p {
    margin-bottom: 0.75rem;
    color: var(--text-primary);
    
    strong {
      color: var(--primary);
    }
  }
`;

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          variants={motionVariants.modalBackdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={onClose}
        >
          <ModalContent
            variants={motionVariants.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton 
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </CloseButton>
            
            <ModalTitle>💬 Get in Touch</ModalTitle>
            <ModalSubtitle>We'd love to hear from you!</ModalSubtitle>

            <AnimatePresence>
              {isSuccess && (
                <SuccessMessage
                  variants={motionVariants.scalePop}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  ✅ Message sent successfully! We'll get back to you soon.
                </SuccessMessage>
              )}
            </AnimatePresence>

            <motion.form 
              onSubmit={handleSubmit}
              variants={motionVariants.staggerContainerFast}
              initial="hidden"
              animate="show"
            >
              <FormField variants={motionVariants.fadeSlideUp}>
                <Label htmlFor="name">Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </FormField>

              <FormField variants={motionVariants.fadeSlideUp}>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </FormField>

              <FormField variants={motionVariants.fadeSlideUp}>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </FormField>

              <FormField variants={motionVariants.fadeSlideUp}>
                <Label htmlFor="message">Message *</Label>
                <TextArea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  required
                />
              </FormField>

              <SubmitButton 
                type="submit" 
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? '📤 Sending...' : '📨 Send Message'}
              </SubmitButton>
            </motion.form>

            <ContactInfo variants={motionVariants.fadeSlideUp}>
              <p><strong>📧 Email:</strong> support@foodshare.com</p>
              <p><strong>📞 Phone:</strong> +91 98765 43210</p>
            </ContactInfo>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;