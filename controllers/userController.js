const User = require('../models/User');  // Assuming you have a User model

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // The user id is attached to the request after authentication via JWT
    const userId = req.user.id;

    // Find the user from the database
    const user = await User.findById(userId).select('-password');  // Exclude password from profile

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user profile
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
};
