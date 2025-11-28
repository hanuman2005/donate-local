// ============================================
// routes/listings.js - COMPLETE & FIXED
// ============================================
const express = require("express");
const { body, query } = require("express-validator");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  expressInterest,
  assignListing,
  completeListing,
  getUserListings,
  getNearbyListings,
  searchListings,
  checkIn,
} = require("../controllers/listingController");
const queueController = require("../controllers/queueController");

const router = express.Router();

// ✅ FIXED: Validation rules matching what frontend actually sends
const listingValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("category")
    .isIn([
      "produce",
      "canned-goods",
      "dairy",
      "bakery",
      "household-items",
      "clothing",
      "other",
    ])
    .withMessage("Invalid category"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isFloat({ min: 0.1 })
    .withMessage("Quantity must be greater than 0"),
  body("unit")
    .optional()
    .isIn(["items", "kg", "lbs", "bags", "boxes", "servings"])
    .withMessage("Invalid unit"),
  body("pickupLocation")
    .notEmpty()
    .withMessage("Pickup location is required")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Pickup location must be between 3 and 200 characters"),
  body("expiryDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid expiry date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Expiry date must be in the future");
      }
      return true;
    }),
  body("additionalNotes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Additional notes cannot exceed 500 characters"),
];

// Validation for nearby listings
const nearbyValidation = [
  query("lat")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  query("lng")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  query("radius")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Radius must be between 1 and 100 km"),
];

// Validation for search
const searchValidation = [
  query("category")
    .optional()
    .isIn([
      "produce",
      "canned-goods",
      "dairy",
      "bakery",
      "household-items",
      "clothing",
      "other",
    ]),
  query("urgency").optional().isInt({ min: 1, max: 3 }),
  query("sortBy").optional().isIn(["newest", "oldest", "popular", "distance"]),
  query("lat").optional().isFloat({ min: -90, max: 90 }),
  query("lng").optional().isFloat({ min: -180, max: 180 }),
];

const expressInterestValidation = [
  body("message")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Message cannot exceed 200 characters"),
];

const assignValidation = [
  body("recipientId")
    .notEmpty()
    .withMessage("Recipient ID is required")
    .isMongoId()
    .withMessage("Invalid recipient ID"),
];

// ============================================
// ROUTES - Proper ordering is important!
// ============================================

// Search route (must be before /:id)
router.get("/search", searchValidation, searchListings);

// Nearby route (must be before /:id)
router.get("/nearby", nearbyValidation, getNearbyListings);

// User listings route (must be before /:id)
router.get("/user", auth, getUserListings);

// General listing routes
router.get("/", getListings);
router.get("/:id", getListingById);

// Create listing
router.post(
  "/",
  auth,
  upload.array("images", 5),
  listingValidation,
  createListing
);

// Update listing
router.put(
  "/:id",
  auth,
  upload.array("images", 5),
  listingValidation,
  updateListing
);

// Delete listing
router.delete("/:id", auth, deleteListing);

// Express interest
router.post("/:id/interest", auth, expressInterestValidation, expressInterest);

// Assign listing
router.post("/:id/assign", auth, assignValidation, assignListing);

// Complete listing
router.put("/:id/complete", auth, completeListing);

// Check-in listing
router.post("/:id/check-in", auth, checkIn);

router.post("/:id/queue/join", auth, queueController.joinQueue);
router.delete("/:id/queue/leave", auth, queueController.leaveQueue);
router.get("/:id/queue/status", auth, queueController.getQueueStatus);
router.post("/:id/queue/cancel", auth, queueController.cancelAssignment);

module.exports = router;
