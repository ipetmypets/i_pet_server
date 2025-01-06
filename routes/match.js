const express = require('express');
const User = require('../models/User');
const Match = require('../models/Match');
const { sendNotification } = require('../notifications/notifications');

const router = express.Router();

// Mark a user as favorite
router.post('/favorite', async (req, res) => {
  const { userId, favoriteId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.favorites.includes(favoriteId)) {
      return res.status(400).json({ message: 'User already in favorites' });
    }

    // Add to favorites
    user.favorites.push(favoriteId);
    await user.save();

    // Check if the favorited user also marked the original user as favorite (match)
    const favoriteUser = await User.findById(favoriteId);
    if (favoriteUser.favorites.includes(userId)) {
      const newMatch = new Match({ user1: userId, user2: favoriteId });
      await newMatch.save();
      sendNotification(userId, `You have a new match with ${favoriteUser.username}`);
      sendNotification(favoriteId, `You have a new match with ${user.username}`);
    }

    res.status(200).json({ message: 'User marked as favorite' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

// Get all matches for a user
router.get('/matches/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('matches');
    if (!user) return res.status(400).json({ message: 'User not found' });

    res.status(200).json(user.matches);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
});

module.exports = router;
