const express = require('express');
const router = express.Router();
const { getPetProfiles, uploadPetPicture } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/profiles', checkAuth, getPetProfiles);
router.post('/uploadPet', checkAuth, upload.single('petPicture'), uploadPhotoAndCreatePet);
module.exports = router;