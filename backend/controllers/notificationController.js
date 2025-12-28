import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.userId });
        res.status(200).json({ success: true, message: 'Notifications fetched successfully.', notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        if(!notificationId) return res.status(400).json({ success: false, message: 'Notification ID is required.' });

        const notification = await Notification.findById(notificationId);
        if(!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
        if(notification.to.toString() !== req.userId.toString())
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this notification.' });

        await notification.deleteOne();
        res.status(200).json({ success: true, message: 'Notification deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};