const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  joinQueue,
  leaveQueue,
  getQueueStatus,
  cancelAssignment
} = require('../controllers/queueController');

// Queue management
router.post('/listings/:id/queue/join', protect, joinQueue);
router.delete('/listings/:id/queue/leave', protect, leaveQueue);
router.get('/listings/:id/queue/status', protect, getQueueStatus);

// Donor actions
router.post('/listings/:id/cancel-assignment', protect, cancelAssignment);

module.exports = router;