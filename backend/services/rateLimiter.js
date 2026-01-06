// backend/services/rateLimiter.js
const rateLimit = require("express-rate-limit");

// Using in-memory store (default) - works perfectly for single-server deployments
// For multi-server deployments, consider using Redis or a database store
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

module.exports = limiter;
