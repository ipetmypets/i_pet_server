const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { receiver, content } = req.body;

  try {
    const message = new Message({
      sender: req.user.id,
      receiver,
      content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
};
