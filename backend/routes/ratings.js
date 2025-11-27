// ============================================
// backend/routes/ratings.js - NEW FILE
// ============================================
const express = require('express');
const { body, param } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  rateUser,
  getUserReviews,
  reportReview,
} = require('../controllers/ratingController');

const router = express.Router();

// Validation
const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review cannot exceed 500 characters'),
  body('listingId')
    .optional()
    .isMongoId()
    .withMessage('Invalid listing ID'),
];

const reportValidation = [
  body('reason')
    .notEmpty()
    .withMessage('Report reason is required')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
];

// @route   POST /api/ratings/:userId
// @desc    Rate a user
// @access  Private
router.post('/:userId', auth, ratingValidation, rateUser);

// @route   GET /api/ratings/:userId
// @desc    Get user's reviews
// @access  Public
router.get('/:userId', getUserReviews);

// @route   POST /api/ratings/:userId/reviews/:reviewId/report
// @desc    Report a review
// @access  Private
router.post('/:userId/reviews/:reviewId/report', auth, reportValidation, reportReview);

module.exports = router;