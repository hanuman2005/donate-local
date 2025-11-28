// backend/routes/schedules.js - NEW FILE
const express = require('express');
const { body, param } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  proposeSchedule,
  confirmSchedule,
  cancelSchedule,
  completeSchedule,
  getMySchedules,
  getUpcomingSchedules,
  getScheduleById,
} = require('../controllers/scheduleController');

const router = express.Router();

// Validation middleware
const proposeScheduleValidation = [
  body('recipientId')
    .notEmpty()
    .withMessage('Recipient is required')
    .isMongoId()
    .withMessage('Invalid recipient ID'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('time')
    .notEmpty()
    .withMessage('Time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (use HH:MM)'),
  body('pickupLocation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Pickup location too long'),
  body('donorNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

const confirmScheduleValidation = [
  body('confirmationNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

const cancelScheduleValidation = [
  body('cancellationReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
];

// Routes

/**
 * @route   POST /api/listings/:id/schedule
 * @desc    Propose a pickup schedule for a listing
 * @access  Private (Donor)
 */
router.post(
  '/listings/:id/schedule',
  auth,
  proposeScheduleValidation,
  proposeSchedule
);

/**
 * @route   GET /api/schedules/my-schedules
 * @desc    Get all schedules for current user
 * @access  Private
 */
router.get('/schedules', auth, getMySchedules);

/**
 * @route   GET /api/schedules/upcoming
 * @desc    Get upcoming schedules for current user
 * @access  Private
 */
router.get('/schedules/upcoming', auth, getUpcomingSchedules);

/**
 * @route   GET /api/schedules/:id
 * @desc    Get single schedule details
 * @access  Private
 */
router.get('/schedules/:id', auth, getScheduleById);

/**
 * @route   PUT /api/schedules/:id/confirm
 * @desc    Confirm a proposed schedule
 * @access  Private (Recipient)
 */
router.put(
  '/schedules/:id/confirm',
  auth,
  confirmScheduleValidation,
  confirmSchedule
);

/**
 * @route   PUT /api/schedules/:id/cancel
 * @desc    Cancel a schedule
 * @access  Private (Donor or Recipient)
 */
router.put(
  '/schedules/:id/cancel',
  auth,
  cancelScheduleValidation,
  cancelSchedule
);

/**
 * @route   PUT /api/schedules/:id/complete
 * @desc    Mark schedule as completed
 * @access  Private (Donor)
 */
router.put('/schedules/:id/complete', auth, completeSchedule);

module.exports = router;

