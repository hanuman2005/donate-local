// backend/routes/wasteAnalysis.js

const express = require('express');
const router = express.Router();
const {
  saveAnalysis,
  getMyHistory,
  getAnalysisById,
  toggleSaveAnalysis,
  deleteAnalysis,
  createListingFromAnalysis,
  getMyImpact,
  getCommunityStats,
  getLeaderboard,
} = require('../controllers/wasteAnalysisController');
const { auth } = require('../middleware/auth');

// =====================
// ANALYSIS CRUD ROUTES
// =====================

// @route   POST /api/waste-analysis
// @desc    Save new waste analysis from TensorFlow.js frontend
// @access  Private (requires auth)
router.post('/', auth, saveAnalysis);

// @route   GET /api/waste-analysis/my-history
// @desc    Get user's analysis history with pagination & filters
// @access  Private
router.get('/my-history', auth, getMyHistory);

// @route   GET /api/waste-analysis/:id
// @desc    Get single analysis by ID
// @access  Private (owner only)
router.get('/:id', auth, getAnalysisById);

// @route   PUT /api/waste-analysis/:id/save
// @desc    Toggle save/bookmark an analysis
// @access  Private (owner only)
router.put('/:id/save', auth, toggleSaveAnalysis);

// @route   DELETE /api/waste-analysis/:id
// @desc    Delete an analysis
// @access  Private (owner only)
router.delete('/:id', auth, deleteAnalysis);

// =====================
// LISTING CONVERSION
// =====================

// @route   POST /api/waste-analysis/:id/create-listing
// @desc    Create donation listing from analysis
// @access  Private
router.post('/:id/create-listing', auth, createListingFromAnalysis);

// =====================
// STATS & LEADERBOARD
// =====================

// @route   GET /api/waste-analysis/stats/my-impact
// @desc    Get user's personal eco impact statistics
// @access  Private
router.get('/stats/my-impact', auth, getMyImpact);

// @route   GET /api/waste-analysis/stats/community
// @desc    Get community-wide statistics (public)
// @access  Public
router.get('/stats/community', getCommunityStats);

// @route   GET /api/waste-analysis/leaderboard
// @desc    Get eco score leaderboard (top users)
// @access  Public
// @query   ?limit=10&period=all|week|month
router.get('/leaderboard', getLeaderboard);

module.exports = router;