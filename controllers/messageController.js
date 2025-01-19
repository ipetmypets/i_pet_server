const Message = require('../models/Message');
const { Op } = require('sequelize');

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  try {
    const newMessage = await Message.create({
      sender_id,
      receiver_id,
      content
    });

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
};

// Get messages in a conversation
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentUserId, receiver_id: userId },
          { sender_id: userId, receiver_id: currentUserId }
        ]
      },
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const currentUserId = req.user.id;

  try {
    const message = await Message.findOne({
      where: {
        id: messageId,
        sender_id: currentUserId
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or you do not have permission to delete it' });
    }

    await message.destroy();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message', error: err.message });
  }
};