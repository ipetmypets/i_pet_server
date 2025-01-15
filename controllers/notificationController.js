const Notification = require('../models/Notification');

// Get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error('Error retrieving notifications:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};