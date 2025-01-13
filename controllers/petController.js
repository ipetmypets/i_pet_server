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
    const response = await axios.post(IMGHI_URL, form, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        ...form.getHeaders(),
      },
    });

    const petPictureUrl = response.data.url;
    if (!petPictureUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload the image. ImgHippo API did not return a URL.',
      });
    }

    const { petName, petType, petAge, petBreed, petDescription } = req.body;

    if (!petName || !petType || !petAge || !petBreed || !petDescription) {
      return res.status(400).json({
        success: false,
        message: 'Missing required pet profile fields',
      });
    }

    const newPetProfile = new PetProfile({
      user: req.user.id,
      petName,
      petType,
      petPictures: petPictureUrl,
      petAge,
      petBreed,
      petDescription,
    });

    await newPetProfile.save();

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



exports.getPetProfiles = async (req, res) => {
  try {
    const petProfiles = await PetProfile.find({
      user: { $ne: req.user.id }   // Exclude the logged-in user's pet profiles
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