const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const User = require('../models/User');  // Assuming you have a User model

const IMGBB_API_KEY = '5d863b76f3ea83add6aeec050f9493d5';

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

// Controller for uploading a user's profile image
const uploadUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const form = new FormData();
    const imagePath = req.file.path;
    form.append('image', fs.createReadStream(imagePath)); 
    form.append('key', IMGBB_API_KEY);

    const response = await axios.post('https://api.imgbb.com/1/upload', form, {
      headers: {
        ...form.getHeaders(), 
      },
    });

    fs.unlinkSync(req.file.path);

    if (response.data && response.data.status === 200) {
      const imageUrl = response.data.data.url;

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
        imageUrl: updatedUser.profile_pic, 
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
