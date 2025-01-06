const Match = require('../models/Match');

exports.createMatch = async (req, res) => {
  const { user2 } = req.body;

  try {
    const match = new Match({
      user1: req.user.id,
      user2,
      status: 'pending',
    });
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: 'Error creating match' });
  }
};
