const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const User = require('../models/User');  // Assuming you have a User model

const IMGBUR_CLIENT_ID = '755588a3e569d6a';

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

const uploadUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
      
    }
    const albumId = req.body.albumId;
    if (!albumId) {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    const form = new FormData();
    const imagePath = req.file.path;
    form.append('image', fs.createReadStream(imagePath));
    form.append('album', albumId);

    const headers = {
      'Authorization': `Client-ID ${IMGBUR_CLIENT_ID}`,
      ...form.getHeaders(),
    };

    const response = await axios.post('https://api.imgur.com/3/image', form, { headers });
    fs.unlinkSync(req.file.path);

    if (response.data && response.data.success) {
      const imageUrl = response.data.data.link; 
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        { profile_pic: imageUrl }, 
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        success: true,
        message: 'Image uploaded and profile updated successfully',
        imageUrl: updatedUser.profile_pic, // The URL of the uploaded profile picture
      });
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  getUserProfile,
  uploadUserImage
};
