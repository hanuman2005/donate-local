// src/components/ReportModal/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const Overlay = styled(motion.div)`
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
  z-index: 2000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  padding: 2rem;
  border-radius: 20px 20px 0 0;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }
`;

const Content = styled.div`
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #f56565;
    box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #f56565;
    box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
  }
`;

const WarningBox = styled.div`
  background: #fff5f5;
  border-left: 4px solid #f56565;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0;
    color: #742a2a;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    color: white;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    
    &:hover {
      background: #edf2f7;
    }
  `}
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.85rem;
  color: #a0aec0;
  margin-top: 0.25rem;
`;

const ReportModal = ({ type = 'listing', targetId, targetTitle, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    message: '',
    additionalInfo: '',
  });

  const reasons = {
    listing: [
      { value: '', label: 'Select a reason' },
      { value: 'spam', label: '🚫 Spam or Duplicate' },
      { value: 'fraud', label: '⚠️ Fraudulent Activity' },
      { value: 'inappropriate_content', label: '🔞 Inappropriate Content' },
      { value: 'misleading_information', label: '❌ Misleading Information' },
      { value: 'unsafe_item', label: '☣️ Unsafe Item' },
      { value: 'fake_listing', label: '🎭 Fake Listing' },
      { value: 'other', label: '📝 Other' },
    ],
    user: [
      { value: '', label: 'Select a reason' },
      { value: 'harassment', label: '😡 Harassment' },
      { value: 'fraud', label: '⚠️ Fraudulent Behavior' },
      { value: 'spam', label: '🚫 Spam' },
      { value: 'inappropriate_content', label: '🔞 Inappropriate Content' },
      { value: 'other', label: '📝 Other' },
    ],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = type === 'listing' 
        ? `/api/reports/listing/${targetId}`
        : `/api/reports/user/${targetId}`;

      await axios.post(endpoint, formData);

      toast.success('✅ Report submitted successfully. Our team will review it.');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Report error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <h2>🚨 Report {type === 'listing' ? 'Listing' : 'User'}</h2>
            <p>{targetTitle}</p>
          </Header>

          <Content>
            <WarningBox>
              <p>
                ⚠️ False reports may result in account penalties. Please only report genuine concerns.
              </p>
            </WarningBox>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>📋 Reason for Report *</Label>
                <Select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  {reasons[type].map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>📝 Detailed Explanation * (10-500 characters)</Label>
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about why you're reporting this..."
                  maxLength={500}
                  required
                />
                <CharCount>
                  {formData.message.length}/500
                </CharCount>
              </FormGroup>

              <FormGroup>
                <Label>ℹ️ Additional Information (Optional)</Label>
                <TextArea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any other relevant details..."
                  maxLength={1000}
                  style={{ minHeight: '80px' }}
                />
                <CharCount>
                  {formData.additionalInfo.length}/1000
                </CharCount>
              </FormGroup>
            </form>
          </Content>

          <ButtonGroup>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              $primary
              onClick={handleSubmit}
              disabled={loading || !formData.reason || !formData.message}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Submitting...' : '🚨 Submit Report'}
            </Button>
          </ButtonGroup>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default ReportModal;