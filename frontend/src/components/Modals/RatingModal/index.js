// ============================================
// src/components/RatingModal/index.js - NEW COMPONENT
// ============================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ratingsAPI } from '../../../services/api';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  CloseButton,
  ModalBody,
  UserInfo,
  UserAvatar,
  UserName,
  RatingSection,
  StarContainer,
  Star,
  Label,
  ReviewTextarea,
  ButtonGroup,
  SubmitButton,
  CancelButton,
} from './styledComponents';

const RatingModal = ({ isOpen, onClose, user, listingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (review.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      await ratingsAPI.rateUser(user._id, {
        rating,
        review: review.trim(),
        listingId,
      });

      toast.success('✅ Rating submitted successfully!');
      
      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error) {
      console.error('Rating error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReview('');
    onClose();
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        $filled={star <= (hoveredRating || rating)}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        as={motion.button}
        whileHover={{ scale: 1.2, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        type="button"
      >
        ⭐
      </Star>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContainer
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <h2>⭐ Rate Your Experience</h2>
              <CloseButton
                as={motion.button}
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
              >
                ×
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <UserInfo
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <UserAvatar
                  src={
                    user.avatar ||
                    user.profileImage ||
                    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=667eea&color=fff&size=128`
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <UserName>
                  {user.firstName} {user.lastName}
                </UserName>
              </UserInfo>

              <RatingSection
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label>How was your experience?</Label>
                <StarContainer>{renderStars()}</StarContainer>
                {rating > 0 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--primary)',
                      margin: '0.5rem 0 0 0',
                    }}
                  >
                    {rating === 5 && '🌟 Excellent!'}
                    {rating === 4 && '😊 Great!'}
                    {rating === 3 && '👍 Good'}
                    {rating === 2 && '😐 Fair'}
                    {rating === 1 && '😞 Poor'}
                  </motion.p>
                )}
              </RatingSection>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label>
                  Share your feedback
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                    ({review.length}/500)
                  </span>
                </Label>
                <ReviewTextarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell others about your experience... (minimum 10 characters)"
                  maxLength={500}
                  rows={4}
                />
              </motion.div>

              <ButtonGroup
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CancelButton
                  as={motion.button}
                  onClick={handleClose}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                >
                  Cancel
                </CancelButton>
                <SubmitButton
                  as={motion.button}
                  onClick={handleSubmit}
                  disabled={loading || rating === 0 || review.trim().length < 10}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                >
                  {loading ? '📤 Submitting...' : '✅ Submit Rating'}
                </SubmitButton>
              </ButtonGroup>
            </ModalBody>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;