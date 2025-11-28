// ==============================
// backend/routes/aiMatching.js 
// ==============================
const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getMatchSuggestions,
  assignTopMatch,
} = require('../controllers/aiMatchingController');

const router = express.Router();

/**
 * @route   GET /api/listings/:id/match-suggestions
 * @desc    Get AI match suggestions for a listing
 * @access  Private (Donor)
 */
router.get('/listings/:id/match-suggestions', auth, getMatchSuggestions);

/**
 * @route   POST /api/listings/:id/assign-top-match
 * @desc    Auto-assign to top AI match
 * @access  Private (Donor)
 */
router.post('/listings/:id/assign-top-match', auth, assignTopMatch);

module.exports = router;

