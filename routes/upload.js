const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create 'uploads' and 'uploads/profile-pictures' directory if they don't exist
const uploadDir = 'uploads/profile-pictures';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where uploaded files should be stored
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Make each file's name unique by appending the current timestamp
    cb(null, Date.now() + path.extname(file.originalname)); // Original file extension
  }
});

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;  // Allowed image file types
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
router.post('/upload-profile', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Construct the file URL assuming the server is publicly accessible
  const fileUrl = `https://your-domain.com/uploads/profile-pictures/${req.file.filename}`;

  // Respond with the URL of the uploaded file
  res.status(200).json({
    message: 'Profile picture uploaded successfully!',
    fileUrl: fileUrl
  });
});

module.exports = router;
