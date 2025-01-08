const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const User = require('../models/User');
const mongoose = require('mongoose'); 

const API_KEY = 'd9de14b33eb6ef3a291cbd94df9037d8';
const IMGHI_URL = 'https://api.imghippo.com/v1/upload';

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
const getOwnerProfile = async (req, res) => {
  try {
   
    const userId = req.params.userId; // Get userId from URL parameter

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Find user by _id
    const user = await User.findById(userId).select('username profile_pic Location'); // Fetch specific fields (username, profile_pic, Location)

    // If user is not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      username: user.username,
      profile_pic: user.profile_pic,
      location: user.Location,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    });
  }
};


const uploadUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const form = new FormData();
    const imagePath = req.file.path;
    form.append('file', fs.createReadStream(imagePath));  // Ensure the field name is correct
    form.append('api_key', API_KEY); // Add ImgHippo API Key

    const headers = {
      'Authorization': `Bearer ${API_KEY}`, // Correct Authorization header
      ...form.getHeaders(),
    };

    const response = await axios.post(IMGHI_URL, form, { headers });

    if (response.data.success && response.data.data.url) {
      const imageUrl = response.data.data.url;

      // Update the user with the new profile image URL
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profile_pic: imageUrl },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the updated user profile picture URL
      return res.json({
        success: true,
        message: 'Image uploaded and profile updated successfully',
        imageUrl: updatedUser.profile_pic,
      });
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error during image upload:', error); // Log the error for debugging
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};


module.exports = {
  getUserProfile,
  getOwnerProfile,
  uploadUserImage
};
