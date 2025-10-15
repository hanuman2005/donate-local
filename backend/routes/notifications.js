
// ============================================
// routes/notifications.js - NEW FEATURE
// ============================================
const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', auth, getNotifications);
router.put('/:notificationId/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);
router.delete('/:notificationId', auth, deleteNotification);

module.exports = router;
