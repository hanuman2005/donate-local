// routes/users.js
const express = require("express");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getUserProfile,
  rateUser,
  getUserRatings,
  updateProfileImage,
  searchUsers,
} = require("../controllers/userController");

const router = express.Router();

// Routes
router.get("/search", searchUsers);
router.get("/:id", getUserProfile);
router.get("/:id/ratings", getUserRatings);
router.post("/:id/rate", auth, rateUser);
router.put("/profile-image", auth, upload.single("image"), updateProfileImage);

module.exports = router;
