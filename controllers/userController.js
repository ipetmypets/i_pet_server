const axios = require('axios');
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
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded file and convert it to Base64
    const imageFile = fs.readFileSync(req.file.path, { encoding: 'base64' });

    // Send the image to ImgBB
    const response = await axios.post('https://api.imgbb.com/1/upload', null, {
      params: {
        key: IMGBB_API_KEY,
        image: imageFile,
      },
    });

    // Clean up the temporary file
    fs.unlinkSync(req.file.path);

    if (response.data && response.data.status === 200) {
      // Save the image URL to the user's record in the database
      const imageUrl = response.data.data.url;
      // Assuming you have a User model and user ID is in req.userId
      // Update the user in the database
      await User.findByIdAndUpdate(req.userId, { profileImage: imageUrl });

      return res.json({
        success: true,
        message: 'Image uploaded successfully',
        imageUrl,
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
