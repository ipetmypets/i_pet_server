const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const PetProfile = require('../models/PetProfile');

const API_KEY = 'd9de14b33eb6ef3a291cbd94df9037d8';
const IMGHI_URL = 'https://api.imghippo.com/v1/upload';

// Upload pet picture and create a profile
exports.uploadPetPicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No picture path provided',
    });
  }

  console.log('Received file path:', req.file.path);
  console.log('Received fields:', req.body); // Log all fields received from the client

  const form = new FormData();
  const imagePath = req.file.path;
  form.append('file', fs.createReadStream(imagePath));
  form.append('api_key', API_KEY);

  try {
    // Upload the image to ImgHippo API
    const response = await axios.post(IMGHI_URL, form, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        ...form.getHeaders(),
      },
    });

    // Check if the ImgHippo API response contains a valid URL
    const petPictureUrl = response.data.url;

    console.log(peytPictureUrl);
    
    if (!petPictureUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload the image. ImgHippo API did not return a URL.',
      });
    }

    // Extract pet details from request body
    const { petName, petType, petAge, petBreed, petDescription } = req.body;

    // Validate the required fields
    if (!petName || !petType || !petAge || !petBreed || !petDescription) {
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
    const profileCount = await PetProfile.countDocuments({ user: req.user.id });
    if (profileCount >= 5) {
      return res.status(400).json({
        success: false,
        message: 'You can only create up to 5 pet profiles',
      });
    }

    // Create a new PetProfile object
    const newPetProfile = new PetProfile({
      user: req.user.id,
      petName,
      petType,
      petPictures: petPictureUrl,  // Use the uploaded image URL
      petAge: parsedPetAge,
      petBreed,
      petDescription,
    });

    // Save the new pet profile to the database
    await newPetProfile.save();

    // Return success response with the created pet profile
    res.status(201).json({
      success: true,
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
      petPictureUrl,
    });
  } catch (error) {
    console.error('Error during upload or profile creation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image or create pet profile',
      error: error.message,
    });
  }
};

// Get pet profiles (excluding the logged-in user's pet profiles)
exports.getPetProfiles = async (req, res) => {
  try {
    // Fetch pet profiles that do not belong to the logged-in user
    const petProfiles = await PetProfile.find({
      user: { $ne: req.user.id }  // Exclude the logged-in user's pet profiles
    });

    res.status(200).json({
      success: true,
      petProfiles,  // Return the list of pet profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pet profiles',
      error: error.message,
    });
  }
};
