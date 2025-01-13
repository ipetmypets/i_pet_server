const express = require('express');
const router = express.Router();
const { getPetProfiles, uploadPetPicture } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

// Set up Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
router.get('/profiles', checkAuth, getPetProfiles);
router.post('/uploadPet', checkAuth, upload.single('petPicture'), uploadPetPicture);

module.exports = router;
