//routes/auth.js
const express = require("express");
const { body } = require("express-validator");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").isLength({ max: 50 }),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("userType")
    .optional()
    .isIn(["donor", "recipient", "both"])
    .withMessage("Invalid user type"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

module.exports = router;
