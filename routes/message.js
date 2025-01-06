const express = require('express');
const Message = require('../models/Message');
const { checkAuth } = require('../middleware/authMiddleware'); // Middleware to protect routes

const router = express.Router();

// Send a message
router.post('/send', checkAuth, async (req, res) => {
  const { receiver, content } = req.body;
  const sender = req.user.id; // The user sending the message, from the JWT token

  try {
    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();
    res.status(200).json({ message: 'Message sent successfully', newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get messages between two users
router.get('/conversation/:userId', checkAuth, async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user.id; // The currently authenticated user

  try {
    if (userId === currentUser) {
      return res.status(400).json({ message: 'Cannot get conversation with yourself' });
    }

    // Find all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: userId },
        { sender: userId, receiver: currentUser },
      ],
    }).sort({ sentAt: 1 }); // Sort messages by sentAt in ascending order

    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving conversation' });
  }
});

// Delete a message (only the sender can delete their own messages)
router.delete('/:messageId', checkAuth, async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id; // The user performing the deletion

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own messages' });
    }

    await message.remove();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting message' });
  }
});

module.exports = router;
