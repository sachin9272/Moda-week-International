import express from 'express';
import {
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications
router.get('/', getAllNotifications);

// Mark single notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

export default router;
