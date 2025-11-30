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

// Analysis CRUD
router.post('/', auth, saveAnalysis);
router.get('/my-history', auth, getMyHistory);
router.get('/:id', auth, getAnalysisById);
router.put('/:id/save', auth, toggleSaveAnalysis);
router.delete('/:id', auth, deleteAnalysis);

// Create listing from analysis
router.post('/:id/create-listing', auth, createListingFromAnalysis);

// Stats & Leaderboard
router.get('/stats/my-impact', auth, getMyImpact);
router.get('/stats/community', getCommunityStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;