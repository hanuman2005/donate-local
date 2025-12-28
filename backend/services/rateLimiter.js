// backend/services/rateLimiter.js
const rateLimit = require("express-rate-limit");
const redisClient = require("../config/redis");
const { RedisStore } = require("rate-limit-redis");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

module.exports = limiter;
