
// ============================================
// routes/analytics.js - NEW FEATURE
// ============================================
const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getUserAnalytics,
  getPlatformAnalytics
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/user', auth, getUserAnalytics);
router.get('/platform', auth, adminAuth, getPlatformAnalytics);

module.exports = router;