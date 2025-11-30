// backend/routes/reports.js - NEW FILE
const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  reportListing,
  reportUser,
  getMyReports,
  getPendingReports,
  resolveReport,
} = require('../controllers/reportController');

const router = express.Router();

// Validation
const reportValidation = [
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isIn([
      'spam',
      'fraud',
      'inappropriate_content',
      'misleading_information',
      'unsafe_item',
      'harassment',
      'fake_listing',
      'other',
    ])
    .withMessage('Invalid reason'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be 10-500 characters'),
  body('additionalInfo')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Additional info too long'),
];

/**
 * @route   POST /api/reports/listing/:id
 * @desc    Report a listing
 * @access  Private
 */
router.post('/listing/:id', auth, reportValidation, reportListing);

/**
 * @route   POST /api/reports/user/:id
 * @desc    Report a user
 * @access  Private
 */
router.post('/user/:id', auth, reportValidation, reportUser);

/**
 * @route   GET /api/reports/my-reports
 * @desc    Get user's submitted reports
 * @access  Private
 */
router.get('/my-reports', auth, getMyReports);

/**
 * @route   GET /api/reports/admin/pending
 * @desc    Get pending reports (admin)
 * @access  Private (Admin)
 */
router.get('/admin/pending', auth, getPendingReports);

/**
 * @route   PUT /api/reports/:id/resolve
 * @desc    Resolve a report (admin)
 * @access  Private (Admin)
 */
router.put(
  '/:id/resolve',
  auth,
  [
    body('resolution')
      .notEmpty()
      .isIn(['warning_sent', 'content_removed', 'account_suspended', 'no_action', 'other'])
      .withMessage('Invalid resolution'),
    body('adminNotes').optional().trim().isLength({ max: 500 }),
  ],
  resolveReport
);

module.exports = router;

