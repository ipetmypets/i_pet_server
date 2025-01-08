const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const User = require('../models/User');  // Assuming you have a User model

const API_KEY = 'd9de14b33eb6ef3a291cbd94df9037d8';
const IMGHI_API_URL = 'https://api.imghippo.com/v1/upload';

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

    const form = new FormData();
    const imagePath = req.file.path;
    form.append('file', fs.createReadStream(imagePath));  // Make sure the field name is 'file'
    form.append('api_key', API_KEY); // Add your ImgHippo API Key

    const headers = {
      'Authorization': `Bearer API_KEY`, // If ImgHippo requires API key in authorization header
      ...form.getHeaders(),
    };

    // Upload image to ImgHippo API
    const response = await axios.post(IMGHI_API_URL, form, { headers });

    fs.unlinkSync(req.file.path);

    if (response.data && response.data.url) {
      const imageUrl = response.data.url;  

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
