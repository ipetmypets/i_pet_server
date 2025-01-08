const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const User = require('../models/User');  // Assuming you have a User model

const IMGBUR_CLIENT_ID = '755588a3e569d6a';
//const IMGBB_API_KEY = '5d863b76f3ea83add6aeec050f9493d5';
//const IMG_ALBUM_ID = 'profile_photo';

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
    form.append('image', fs.createReadStream(imagePath)); // Add the image to the form

    // Set the authorization headers with the Imgur client ID
    const headers = {
      'Authorization': `Client-ID ${IMGBUR_CLIENT_ID}`,
      ...form.getHeaders(),
    };

    // Upload image to Imgur API
    const response = await axios.post('https://api.imgur.com/3/image', form, { headers });

    fs.unlinkSync(req.file.path); // Remove the uploaded file from the server after uploading

    if (response.data && response.data.success) {
      const imageUrl = response.data.data.link; // Get the uploaded image URL from the response

      // Update the user's profile with the new image URL
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        { profile_pic: imageUrl },  // Store the image URL in the user model
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
