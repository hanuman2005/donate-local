// backend/routes/schedules.js - NEW FILE
const express = require("express");
const { body, param } = require("express-validator");
const { auth } = require("../middleware/auth");
const {
  proposeSchedule,
  confirmSchedule,
  cancelSchedule,
  completeSchedule,
  getMySchedules,
  getUpcomingSchedules,
  getScheduleById,
  startPickup,
  updateDriverLocation,
  getPickupStatus,
} = require("../controllers/scheduleController");

const router = express.Router();

const confirmScheduleValidation = [
  body("confirmationNotes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

const cancelScheduleValidation = [
  body("cancellationReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Reason cannot exceed 500 characters"),
];

//Routes
/**
 * @route   GET /api/schedules
 * @desc    Get all schedules for current user
 * @access  Private
 */
router.get("/", auth, getMySchedules);

/**
 * @route   GET /api/schedules/my-schedules
 * @desc    Get all schedules for current user
 * @access  Private
 */
router.get("/my-schedules", auth, getMySchedules);

/**
 * @route   GET /api/schedules/upcoming
 * @desc    Get upcoming schedules for current user
 * @access  Private
 */
router.get("/upcoming", auth, getUpcomingSchedules);

/**
 * @route   GET /api/schedules/:id
 * @desc    Get single schedule details
 * @access  Private
 */
router.get("/:id", auth, getScheduleById);

/**
 * @route   PUT /api/schedules/:id/confirm
 * @desc    Confirm a proposed schedule
 * @access  Private (Recipient)
 */
router.put("/:id/confirm", auth, confirmScheduleValidation, confirmSchedule);

/**
 * @route   PUT /api/schedules/:id/cancel
 * @desc    Cancel a schedule
 * @access  Private (Donor or Recipient)
 */
router.put("/:id/cancel", auth, cancelScheduleValidation, cancelSchedule);

/**
 * @route   PUT /api/schedules/:id/complete
 * @desc    Mark schedule as completed
 * @access  Private (Donor)
 */
router.put("/:id/complete", auth, completeSchedule);

/**
 * @route   PUT /api/schedules/:id/start-pickup
 * @desc    Start a pickup (driver begins navigation)
 * @access  Private
 */
router.put("/:id/start-pickup", auth, startPickup);

/**
 * @route   PUT /api/schedules/:id/driver-location
 * @desc    Update driver location during pickup
 * @access  Private
 */
router.put("/:id/driver-location", auth, updateDriverLocation);

/**
 * @route   GET /api/schedules/:id/pickup-status
 * @desc    Get current pickup tracking status
 * @access  Private
 */
router.get("/:id/pickup-status", auth, getPickupStatus);

module.exports = router;
