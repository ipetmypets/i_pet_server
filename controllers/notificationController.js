const Notification = require('../models/Notification');

// Create a notification
exports.createNotification = async (req, res) => {
  const { user_id, message } = req.body;

  try {
    const newNotification = await Notification.create({
      user_id,
      message
    });

    res.status(201).json({ message: 'Notification created successfully', newNotification });
  } catch (err) {
    res.status(500).json({ message: 'Error creating notification', error: err.message });
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  const user_id = req.user.id;

  try {
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification as read', error: err.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
};