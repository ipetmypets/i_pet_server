const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create the 'uploads' folder if it doesn't exist
const uploadDir = 'uploads/profile-pictures';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where uploaded files should be stored
    cb(null, uploadDir);  // Store images in 'uploads/profile-pictures'
  },
  filename: (req, file, cb) => {
    // Make each file's name unique by appending the current timestamp
    cb(null, Date.now() + path.extname(file.originalname));  // Original file extension
  }
});

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
  console.log('Uploaded file details:', file);
  const allowedTypes = /jpeg|jpg|png|gif/;  // Allowed file types (image formats)
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);  // Accept file
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

// POST route to handle profile picture upload
router.post('/upload-profile', upload.single('profile_pic'), (req, res) => { // Use 'profile_pic' here
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Construct the file URL (assuming files are publicly accessible)
  const fileUrl = `https://i-pet-server.onrender.com/uploads/profile-pictures/${req.file.filename}`;

  // Respond with the URL of the uploaded file
  res.status(200).json({
    message: 'Profile picture uploaded successfully!',
    profilePic: fileUrl // Send the updated URL back
  });
});

module.exports = router;
