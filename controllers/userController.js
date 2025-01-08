const axios = require('axios');
const fs = require('fs');
const path = require('path');
const User = require('../models/User'); // Assuming you have a User model

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub personal access token
const GITHUB_USERNAME = process.env.GITHUB_USERNAME; // Your GitHub username
const GITHUB_REPO = process.env.GITHUB_REPO; // Your GitHub repository name
const GITHUB_BRANCH = 'main'; // Branch you want to upload to
const IMAGE_FOLDER_PATH = 'images/'; // Folder where you want to store the image

// Function to upload file to GitHub using GitHub API
const uploadToGitHub = async (filePath, fileName) => {
  try {
    const fileContent = fs.readFileSync(filePath); // Read the file content

    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${IMAGE_FOLDER_PATH}${fileName}`;

    // GitHub API payload to upload the file
    const data = {
      message: `Add profile picture ${fileName}`, // Commit message
      content: fileContent.toString('base64'), // Convert the file content to base64
    };

    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    };

    // Make a PUT request to GitHub API to upload the image
    const response = await axios.put(url, data, { headers });

    if (response.status === 201) {
      const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${IMAGE_FOLDER_PATH}${fileName}`;
      console.log('File uploaded successfully!', fileUrl);
      return fileUrl; // Return the raw URL of the image
    } else {
      throw new Error('Failed to upload the image to GitHub');
    }
  } catch (error) {
    console.error('Error uploading file to GitHub:', error);
    throw new Error('File upload failed');
  }
};

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

// Upload user image and update profile with GitHub URL
const uploadUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;  // Path to the uploaded file
    const fileName = req.file.originalname;  // Original file name

    // Step 1: Upload the file to GitHub and get the raw URL
    const profilePicUrl = await uploadToGitHub(filePath, fileName);

    // Step 2: Save the image URL to the user's profile
    const userId = req.user.id; // Assuming the user is authenticated

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile with the new image URL
    user.profile_pic = profilePicUrl;
    await user.save(); // Save the updated user profile

    return res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: user.profile_pic, // Return the updated profile picture URL
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  getUserProfile,
  uploadUserImage
};
