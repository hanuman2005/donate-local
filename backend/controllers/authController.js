// controllers/authController.js - FIXED

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userType,
      address,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !userType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userType,
      address: address || "",
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      location: {
        type: "Point",
        coordinates: [81.5212, 16.5449], // Bhimavaram, AP (corrected coordinates)
      },
    });

    await user.save();
    console.log("✅ User registered:", email);

    // ✅ FIXED: Return 'user' instead of 'data'
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        address: user.address,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("🔐 Login attempt:", email);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("✅ Login successful:", email);

    // ✅ FIXED: Return 'user' instead of 'data'
    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        address: user.address,
        avatar: user.avatar,
        bio: user.bio,
        rating: user.rating,
        ratingsCount: user.ratingsCount,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // ✅ FIXED: Use req.user._id instead of req.user.id
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ Get me:", user.email);

    // ✅ FIXED: Return 'user' instead of 'data'
    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        address: user.address,
        avatar: user.avatar,
        bio: user.bio,
        rating: user.rating,
        ratingsCount: user.ratingsCount,
        listingsCount: user.listingsCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Get me error:", error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, address, bio } = req.body;

    // ✅ FIXED: Use req.user._id instead of req.user.id
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    await user.save();

    console.log("✅ Profile updated:", user.email);

    // ✅ FIXED: Return 'user' instead of 'data'
    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        address: user.address,
        avatar: user.avatar,
        bio: user.bio,
        rating: user.rating,
        ratingsCount: user.ratingsCount,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};