const fs = require('fs');
const path = require('path');
const PetProfile = require('../models/Pet');
const upload = require('../middleware/upload');
const { Op } = require('sequelize');

// Upload pet picture temporarily and return the URL
exports.uploadPetPicture = (req, res) => {
  console.log('Starting file upload'); // Debugging statement
  upload.single('petPicture')(req, res, (err) => {
    if (err) {
      console.error('Error during file upload:', err); // Debugging statement
      // Handle specific multer errors
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Multer error: ${err.message}`,
        });
      }

      // Handle other unexpected errors
      return res.status(500).json({
        success: false,
        message: `Unexpected error: ${err.message || 'Unknown error'}`,
      });
    }

    // Check if the file was uploaded
    if (!req.file) {
      console.log('No file uploaded'); // Debugging statement
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const tempFilePath = req.file.path;
    const tempFileName = req.file.filename;
    const petPictureUrl = `${req.protocol}://${req.get('host')}/uploads/temp/${tempFileName}`;
    console.log('File uploaded successfully:', petPictureUrl); // Debugging statement

    res.status(200).json({
      success: true,
      petPictureUrl,
      tempFilePath,
      tempFileName,
    });
  });
};

// Create a new pet profile
exports.createPetProfile = async (req, res) => {
  const { petName, petType, petAge, petBreed, petDescription, tempFilePath, tempFileName } = req.body;

  // Validate the required fields
  if (!petName || !petType || !petAge || !petBreed || !petDescription || !tempFilePath || !tempFileName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required pet profile fields',
    });
  }

  // Parse pet age as an integer
  const parsedPetAge = parseInt(petAge, 10);
  if (isNaN(parsedPetAge)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid value for petAge. It must be a number.',
    });
  }

  // Check if the user already has 5 pet profiles
  const profileCount = await PetProfile.count({ where: { ownerId: req.user.userId } });
  if (profileCount >= 5) {
    return res.status(400).json({
      success: false,
      message: 'You can only create up to 5 pet profiles',
    });
  }

  // Create a new PetProfile object
  const newPetProfile = new PetProfile({
    ownerId: req.user.userId,
    petName,
    petType,
    petPictures: '',  // Placeholder for the image URL
    petAge: parsedPetAge,
    petBreed,
    petDescription,
  });

  try {
    // Save the new pet profile to the database
    await newPetProfile.save();

    // Rename and move the uploaded file to include the petId
    const newFileName = `${newPetProfile.petId}${path.extname(tempFileName)}`;
    const oldFilePath = path.join(__dirname, '..', 'uploads', 'pets', tempFileName);
    const newFilePath = path.join(__dirname, '..', 'uploads', 'pets', newFileName);
    fs.renameSync(oldFilePath, newFilePath);

    // Update the pet profile with the new file name
    newPetProfile.petPictures = `${req.protocol}://${req.get('host')}/uploads/pets/${newFileName}`;
    await newPetProfile.save();

    // Return success response with the created pet profile
    res.status(201).json({
      success: true,
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
    });
  } catch (error) {
    console.error('Error during profile creation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pet profile',
      error: error.message,
    });
  }
};


// Get pet profiles (excluding the logged-in user's pet profiles)
exports.getPetProfiles = async (req, res) => {
  try {
    const { type } = req.query;
    let petProfiles;

    if (type === 'own') {
      // Fetch pet profiles that belong to the logged-in user
      petProfiles = await PetProfile.findAll({ where: { ownerId: req.user.userId } });
    } else {
      // Fetch pet profiles that do not belong to the logged-in user
      petProfiles = await PetProfile.findAll({ where: { ownerId: { [Op.ne]: req.user.userId } } });
    }

    res.status(200).json({
      success: true,
      petProfiles,
    });
  } catch (error) {
    console.error('Error fetching pet profiles:', error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pet profiles',
      error: error.message,
    });
  }
};

// Delete a pet profile
exports.deletePetProfile = async (req, res) => {
  const { petId } = req.params;

  if (!petId) {
    return res.status(400).json({
      success: false,
      message: 'Pet ID is required',
    });
  }

  try {
    const petProfile = await PetProfile.findOne({ where: { petId, ownerId: req.user.userId } });
    if (!petProfile) {
      return res.status(404).json({
        success: false,
        message: 'Pet profile not found or you are not authorized to delete it',
      });
    }

    // Delete the pet profile
    await PetProfile.destroy({ where: { petId, ownerId: req.user.userId } });

    // Delete the associated photo
    const photoPath = path.join(__dirname, '..', 'uploads', 'pets', path.basename(petProfile.petPictures));
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }

    res.status(200).json({
      success: true,
      message: 'Pet profile deleted successfully',
    });
  } catch (error) {
    console.error('Error during profile deletion:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while deleting the profile.',
    });
  }
};