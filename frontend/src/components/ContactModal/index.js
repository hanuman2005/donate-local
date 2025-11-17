// ============================================
// src/components/ContactModal/index.jsx - WITH MOTION
// ============================================
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { motionVariants } from '../../animations/motionVariants';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #718096;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
    color: #2d3748;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 800;
`;

const ModalSubtitle = styled.p`
  color: #718096;
  margin-bottom: 2rem;
`;

const FormField = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: #c6f6d5;
  color: #2f855a;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ContactInfo = styled(motion.div)`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.95rem;

  p {
    margin-bottom: 0.75rem;
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
