// backend/routes/notifications.js 
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
} = require('../controllers/notificationController');

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for logged-in user
 * @access  Private
 * @query   ?type=new_listing&unreadOnly=true&limit=50&page=1
 */
router.get('/', auth, getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/unread-count', auth, getUnreadCount);

/**
 * @route   PUT /api/notifications/:notificationId/read
 * @desc    Mark specific notification as read
 * @access  Private
 */
router.put('/:notificationId/read', auth, markAsRead);

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/mark-all-read', auth, markAllAsRead);

/**
 * @route   DELETE /api/notifications/:notificationId
 * @desc    Delete specific notification
 * @access  Private
 */
router.delete('/:notificationId', auth, deleteNotification);

/**
 * @route   DELETE /api/notifications/clear-read
 * @desc    Clear all read notifications
 * @access  Private
 */
router.delete('/clear-read', auth, clearReadNotifications);

module.exports = router;