// ============================================
// src/components/RatingModal/index.jsx - NEW COMPONENT
// ============================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { motionVariants } from '../../animations/motionVariants';
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
  ReviewTextarea,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  Label,
} from './styledComponents';

const RatingModal = ({ isOpen, onClose, user, listingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/ratings/${user._id}`, {
        rating,
        review: review.trim(),
        listingId,
      });

      toast.success('Rating submitted successfully!');
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Submit rating error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setReview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <ModalContainer
          as={motion.div}
          variants={motionVariants.scalePop}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader>
            <h2>Rate {user?.firstName}</h2>
            <CloseButton
              as={motion.button}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
            >
              ✕
            </CloseButton>
          </ModalHeader>

          {/* Body */}
          <ModalBody>
            {/* User Info */}
            <UserInfo>
              <UserAvatar
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.firstName}
              />
              <UserName>
                {user?.firstName} {user?.lastName}
              </UserName>
            </UserInfo>

            {/* Rating Stars */}
            <RatingSection>
              <Label>Your Rating *</Label>
              <StarContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    as={motion.button}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    $filled={star <= (hoverRating || rating)}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {star <= (hoverRating || rating) ? '⭐' : '☆'}
                  </Star>
                ))}
              </StarContainer>
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    marginTop: '0.5rem', 
                    color: '#667eea',
                    fontWeight: '600',
                  }}
                >
                  {rating === 5 && '⭐ Excellent!'}
                  {rating === 4 && '👍 Very Good!'}
                  {rating === 3 && '😊 Good'}
                  {rating === 2 && '😐 Fair'}
                  {rating === 1 && '😞 Poor'}
                </motion.p>
              )}
            </RatingSection>

            {/* Review Text */}
            <div>
              <Label>
                Review (Optional)
                <span style={{ color: '#718096', fontSize: '0.85rem' }}>
                  {review.length}/500
                </span>
              </Label>
              <ReviewTextarea
                placeholder="Share your experience with this user..."
                value={review}
                onChange={(e) => setReview(e.target.value.slice(0, 500))}
                rows={4}
              />
            </div>

            {/* Buttons */}
            <ButtonGroup>
              <CancelButton
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </CancelButton>
              <SubmitButton
                as={motion.button}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting || rating === 0}
              >
                {submitting ? '⏳ Submitting...' : '✅ Submit Rating'}
              </SubmitButton>
            </ButtonGroup>
          </ModalBody>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default RatingModal;