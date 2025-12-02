const express = require('express');
const router = express.Router();
const {generateUpcyclingIdeas} = require('../controllers/aiController');
const {auth} = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

console.log("AI Controller:", generateUpcyclingIdeas);


const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 requests per day
  message: 'Too many AI requests, please try again tomorrow'
});

router.post('/upcycle', auth, aiLimiter, generateUpcyclingIdeas);

module.exports = router;