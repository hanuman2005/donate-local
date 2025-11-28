// src/components/ScheduleModal/ProposeScheduleModal.js
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #718096;
    margin: 0;
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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const InfoBox = styled.div`
  background: #ebf8ff;
  border-left: 4px solid #4299e1;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0;
    color: #2c5282;
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
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    color: white;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
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

const ProposeScheduleModal = ({ listing, recipient, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pickupLocation: listing.pickupLocation || '',
    donorNotes: '',
  });

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/listings/${listing._id}/schedule`,
        {
          recipientId: recipient._id,
          ...formData,
        }
      );

      toast.success('✅ Pickup schedule proposed successfully!');
      
      if (onSuccess) {
        onSuccess(response.data.schedule);
      }
      
      onClose();
    } catch (error) {
      console.error('Propose schedule error:', error);
      toast.error(error.response?.data?.message || 'Failed to propose schedule');
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
            <h2>📅 Schedule Pickup</h2>
            <p>Propose a pickup time for {recipient.firstName}</p>
          </Header>

          <Content>
            <InfoBox>
              <p>
                💡 The recipient will receive a notification and must confirm this schedule. 
                You'll both get reminders 24 hours before pickup.
              </p>
            </InfoBox>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>📅 Pickup Date</Label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>⏰ Pickup Time</Label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>📍 Pickup Location</Label>
                <Input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="e.g., Main entrance, Room 205"
                />
              </FormGroup>

              <FormGroup>
                <Label>📝 Notes (Optional)</Label>
                <TextArea
                  name="donorNotes"
                  value={formData.donorNotes}
                  onChange={handleChange}
                  placeholder="Any special instructions or information..."
                  maxLength={500}
                />
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#a0aec0', marginTop: '0.25rem' }}>
                  {formData.donorNotes.length}/500
                </div>
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
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Proposing...' : '📅 Propose Schedule'}
            </Button>
          </ButtonGroup>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default ProposeScheduleModal;