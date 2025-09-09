// routes/listings.js
const express = require("express");
const { body } = require("express-validator");
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
} = require("../controllers/listingController");

const router = express.Router();

// Validation rules
const listingValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 }),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 }),
  body("category").isIn([
    "produce",
    "canned-goods",
    "dairy",
    "bakery",
    "household-items",
    "clothing",
    "other",
  ]),
  body("quantity").notEmpty().withMessage("Quantity is required"),
  body("coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be an array of [longitude, latitude]"),
];

// Routes
router.post(
  "/",
  auth,
  upload.array("images", 5),
  listingValidation,
  createListing
);

// ✅ Place the more specific route before the general one
router.get("/nearby", getNearbyListings);

// Place the general route after
router.get("/", getListings);
router.get("/user", auth, getUserListings);
router.get("/:id", getListingById);

router.put("/:id", auth, upload.array("images", 5), updateListing);
router.delete("/:id", auth, deleteListing);
router.post("/:id/interest", auth, expressInterest);
router.post("/:id/assign", auth, assignListing);
router.put("/:id/complete", auth, completeListing);

module.exports = router;