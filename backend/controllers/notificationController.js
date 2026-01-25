import Notification from '../models/notificationModel.js';

// Get all notifications (for admin)
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(50);  // Limit to last 50 notifications

        const unreadCount = await Notification.countDocuments({ isRead: false });

        res.status(200).json({
            status: 'success',
            unreadCount,
            data: notifications
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                status: 'fail',
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: notification
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({
                status: 'fail',
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Notification deleted'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Create a notification (internal use)
export const createNotification = async (data) => {
    try {
        const notification = await Notification.create(data);
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};
