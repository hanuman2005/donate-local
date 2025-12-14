const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  joinQueue,
  leaveQueue,
  getQueueStatus,
  cancelAssignment
} = require('../controllers/queueController');

router.post('/:id/join', auth, joinQueue);
router.post('/:id/leave', auth, leaveQueue);
router.get('/:id/status', auth, getQueueStatus);
router.post('/:id/cancel-assignment', auth, cancelAssignment);

module.exports = router;