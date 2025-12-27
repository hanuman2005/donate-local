// backend/routes/admin.js - Admin Routes
const express = require("express");
const { body, query } = require("express-validator");
const { auth, adminAuth } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  suspendUser,
  warnUser,
  unsuspendUser,
  updateUserRole,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getFlaggedContent,
  removeFlaggedContent,
  restoreFlaggedContent,
  getAdminLogs,
  getAdminDashboardStats,
  getAllReports,
  bulkUserAction,
  // Content Moderation
  getPendingModerationListings,
  moderateListing,
  getModerationStats,
} = require("../controllers/adminController");

const router = express.Router();

// All routes require auth + admin
router.use(auth, adminAuth);

// ================================
// Dashboard Stats
// ================================
/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Get admin dashboard overview stats
 * @access  Private (Admin)
 */
router.get("/dashboard-stats", getAdminDashboardStats);

// ================================
// User Management
// ================================
/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filters
 * @access  Private (Admin)
 */
router.get(
  "/users",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("search").optional().trim(),
    query("status").optional().isIn(["active", "suspended", "all"]),
    query("userType")
      .optional()
      .isIn(["donor", "recipient", "both", "admin", "all"]),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "trustScore", "rating", "name"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  getAllUsers
);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details (admin view)
 * @access  Private (Admin)
 */
router.get("/users/:id", getUserById);

/**
 * @route   PUT /api/admin/users/:id/suspend
 * @desc    Suspend a user
 * @access  Private (Admin)
 */
router.put(
  "/users/:id/suspend",
  [
    body("reason").notEmpty().withMessage("Suspension reason is required"),
    body("days").optional().isInt({ min: 1, max: 365 }),
  ],
  suspendUser
);

/**
 * @route   PUT /api/admin/users/:id/unsuspend
 * @desc    Unsuspend a user
 * @access  Private (Admin)
 */
router.put("/users/:id/unsuspend", unsuspendUser);

/**
 * @route   PUT /api/admin/users/:id/warn
 * @desc    Send warning to a user
 * @access  Private (Admin)
 */
router.put(
  "/users/:id/warn",
  [
    body("reason").notEmpty().withMessage("Warning reason is required"),
    body("type")
      .optional()
      .isIn(["policy_violation", "spam", "inappropriate", "other"]),
  ],
  warnUser
);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin)
 */
router.put(
  "/users/:id/role",
  [body("userType").isIn(["donor", "recipient", "both", "admin"])],
  updateUserRole
);

/**
 * @route   POST /api/admin/users/bulk-action
 * @desc    Perform bulk action on users
 * @access  Private (Admin)
 */
router.post(
  "/users/bulk-action",
  [
    body("userIds").isArray({ min: 1 }).withMessage("User IDs required"),
    body("action").isIn(["suspend", "unsuspend", "warn", "delete"]),
    body("reason").optional().trim(),
  ],
  bulkUserAction
);

// ================================
// Verification Management
// ================================
/**
 * @route   GET /api/admin/verifications
 * @desc    Get pending verification requests
 * @access  Private (Admin)
 */
router.get(
  "/verifications",
  [
    query("status").optional().isIn(["pending", "approved", "rejected", "all"]),
    query("type").optional().isIn(["identity", "address", "phone", "all"]),
  ],
  getPendingVerifications
);

/**
 * @route   PUT /api/admin/verifications/:id/approve
 * @desc    Approve verification request
 * @access  Private (Admin)
 */
router.put(
  "/verifications/:id/approve",
  [body("notes").optional().trim()],
  approveVerification
);

/**
 * @route   PUT /api/admin/verifications/:id/reject
 * @desc    Reject verification request
 * @access  Private (Admin)
 */
router.put(
  "/verifications/:id/reject",
  [body("reason").notEmpty().withMessage("Rejection reason required")],
  rejectVerification
);

// ================================
// Flagged Content
// ================================
/**
 * @route   GET /api/admin/flagged-content
 * @desc    Get flagged listings and reviews
 * @access  Private (Admin)
 */
router.get(
  "/flagged-content",
  [
    query("type").optional().isIn(["listing", "review", "all"]),
    query("status").optional().isIn(["pending", "removed", "restored", "all"]),
  ],
  getFlaggedContent
);

/**
 * @route   PUT /api/admin/flagged-content/:id/remove
 * @desc    Remove flagged content
 * @access  Private (Admin)
 */
router.put(
  "/flagged-content/:id/remove",
  [
    body("reason").notEmpty().withMessage("Removal reason required"),
    body("contentType").isIn(["listing", "review"]),
  ],
  removeFlaggedContent
);

/**
 * @route   PUT /api/admin/flagged-content/:id/restore
 * @desc    Restore flagged content
 * @access  Private (Admin)
 */
router.put(
  "/flagged-content/:id/restore",
  [
    body("notes").optional().trim(),
    body("contentType").isIn(["listing", "review"]),
  ],
  restoreFlaggedContent
);

// ================================
// Reports (extending existing)
// ================================
/**
 * @route   GET /api/admin/reports
 * @desc    Get all reports with filters
 * @access  Private (Admin)
 */
router.get(
  "/reports",
  [
    query("status")
      .optional()
      .isIn(["pending", "reviewing", "resolved", "dismissed", "all"]),
    query("type").optional().isIn(["listing", "user", "review", "all"]),
    query("priority")
      .optional()
      .isIn(["low", "medium", "high", "critical", "all"]),
  ],
  getAllReports
);

// ================================
// Admin Logs
// ================================
/**
 * @route   GET /api/admin/logs
 * @desc    Get admin action logs
 * @access  Private (Admin)
 */
router.get(
  "/logs",
  [
    query("action").optional(),
    query("adminId").optional(),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
  ],
  getAdminLogs
);

// ================================
// Content Moderation
// ================================
/**
 * @route   GET /api/admin/moderation/pending
 * @desc    Get listings pending moderation
 * @access  Private (Admin)
 */
router.get("/moderation/pending", getPendingModerationListings);

/**
 * @route   GET /api/admin/moderation/stats
 * @desc    Get moderation statistics
 * @access  Private (Admin)
 */
router.get("/moderation/stats", getModerationStats);

/**
 * @route   PUT /api/admin/moderation/:id
 * @desc    Approve or reject a listing
 * @access  Private (Admin)
 */
router.put(
  "/moderation/:id",
  [
    body("action").isIn(["approve", "reject"]).withMessage("Invalid action"),
    body("notes").optional().trim(),
  ],
  moderateListing
);

module.exports = router;
