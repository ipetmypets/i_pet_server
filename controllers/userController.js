
const User = require('../models/User');
const upload = require('../middleware/upload');
const multer = require('multer');

// Get logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      profile_pic: user.profile_pic,
      location: user.location, // Include location data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get another user's profile by ID
const getOwnerProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId, { attributes: ['username', 'profile_pic', 'location'] });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      username: user.username,
      profile_pic: user.profile_pic,
      location: user.location,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    });
  }
};
// Upload user image and update profile picture URL
const uploadUserImage = (req, res) => {
  upload.single('profilePic')(req, res, async (err) => {
    if (err) {
      // Handle specific multer errors
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Multer error: ${err.message}`,
        });
      }

      // Handle other unexpected errors
      return res.status(500).json({
        success: false,
        message: `Unexpected error: ${err.message || 'Unknown error'}`,
      });
    }

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;

    try {
      const [updated] = await User.update(
        { profile_pic: imageUrl },
        { where: { userId: req.user.userId } }
      );

      if (updated === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({
        success: true,
        message: 'Image uploaded and profile updated successfully',
        imageUrl,
      });
    } catch (error) {
      console.error('Error during image upload:', error); // Log the error for debugging
      return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
  });
};


module.exports = { getUserProfile, getOwnerProfile, uploadUserImage };