const User = require('../models/User');  // Assuming you have a User model

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');  // Exclude password from profile

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      email: user.email,
      profile_pic: user.profile_pic,
      location: user.Location,  // Include location data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  const { username, email, profile_pic } = req.body;

  try {
    const user = await User.findById(req.user.id); // Assuming `req.user.id` is set by `checkAuth`

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (profile_pic) user.profile_pic = profile_pic;

    await user.save(); // Save the updated user document

    res.status(200).json({
      message: 'User profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
