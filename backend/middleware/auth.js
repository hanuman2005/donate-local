// middleware/auth.js - FIXED

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT token
const auth = async (req, res, next) => {
  let token;

  // Check for token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      console.log("🔑 Token received:", token.substring(0, 20) + "...");

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("✅ Token decoded:", decoded);

      // ✅ FIXED: Handle both userId and id from token
      const userId = decoded.userId || decoded.id;

      if (!userId) {
        console.error("❌ No userId in decoded token");
        return res.status(401).json({
          success: false,
          message: "Invalid token format",
        });
      }

      // Get user from database
      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        console.error("❌ User not found for id:", userId);
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (!req.user.isActive) {
        console.error("❌ User account is deactivated");
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      console.log("✅ User authenticated:", req.user.email);
      next();
    } catch (error) {
      console.error("❌ Auth middleware error:", error.message);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } else {
    console.error("❌ No token provided");
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};

// Admin authorization
const adminAuth = (req, res, next) => {
  // Check both 'role' and 'userType' fields for admin status
  const isAdmin =
    req.user && (req.user.role === "admin" || req.user.userType === "admin");

  if (isAdmin) {
    console.log("✅ Admin authorized:", req.user.email);
    next();
  } else {
    console.log(
      "❌ Admin check failed. userType:",
      req.user?.userType,
      "role:",
      req.user?.role
    );
    return res.status(403).json({
      success: false,
      message: "Not authorized as an admin",
    });
  }
};

module.exports = { auth, adminAuth };
