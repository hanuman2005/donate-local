// backend/routes/qr.js
const express = require('express');
const router = express.Router();

// ✅ FIX: Destructure auth from the middleware object
const { auth } = require('../middleware/auth');

const {
  generateQR,
  verifyQR,
  getTransaction,
  getMyTransactions,
  downloadQR
} = require('../controllers/qrController');

/**
 * @route   POST /api/qr/generate
 * @desc    Generate QR code for a listing
 * @access  Private (Donor only)
 */
router.post('/generate', auth, generateQR);

/**
 * @route   POST /api/qr/verify
 * @desc    Verify QR code and complete transaction
 * @access  Private (Donor or Recipient)
 */
router.post('/verify', auth, verifyQR);

/**
 * @route   GET /api/qr/transaction/:id
 * @desc    Get transaction details by ID
 * @access  Private (Transaction participants only)
 */
router.get('/transaction/:id', auth, getTransaction);

/**
 * @route   GET /api/qr/my-transactions
 * @desc    Get all transactions for logged-in user
 * @access  Private
 * @query   ?status=pending&role=donor
 */
router.get('/my-transactions', auth, getMyTransactions);

/**
 * @route   GET /api/qr/download/:transactionId
 * @desc    Download QR code as PNG image
 * @access  Private (Donor only)
 */
router.get('/download/:transactionId', auth, downloadQR);

module.exports = router;