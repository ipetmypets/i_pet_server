const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const User = require('../models/User');  // Assuming you have a User model

const clientId = process.env.IMGUR_CLIENT_ID;

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

    // Create a form to upload the image to Imgur
    const form = new FormData();
    const imagePath = req.file.path;
    form.append('image', fs.createReadStream(imagePath)); // Add the image to the form
    form.append('type', 'file');  // Tell Imgur this is a file upload
    form.append('privacy', 'hidden'); // Make the image hidden
    const albumId = 'AB9GVcX'; // Replace with the actual album ID
    form.append('album', albumId); // Add the image to a specific album

    const headers = {
      'Authorization': `Client-ID ${clientId}`,
      ...form.getHeaders(),
    };

    const response = await axios.post('https://api.imgur.com/3/image', form, { headers });

    fs.unlinkSync(req.file.path);  // Delete the temporary file from the server

    if (response.data && response.data.success) {
      const imageUrl = response.data.data.link; // Get the uploaded image URL
      const imageId = response.data.data.id; // Get the uploaded image ID (for deletion later)
      const userId = req.user.id; // Assuming the user is authenticated and `req.user` is available

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.profile_pic) {
        const oldImageId = user.profile_pic.split('/').pop().split('.')[0];  // Extract the image ID
        await axios.delete(`https://api.imgur.com/3/image/${oldImageId}`, {
          headers: { Authorization: `Client-ID ${clientId}` },
        });
      }

      user.profile_pic = imageUrl; // Store the new image URL
      await user.save(); // Save the updated user

      return res.json({
        success: true,
        message: 'Profile image uploaded successfully',
        imageUrl: user.profile_pic, // Return the updated profile picture URL
      });
    } else {
      throw new Error('Failed to upload image to Imgur');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  getUserProfile,
  uploadUserImage
};
