const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const PetProfile = require('../models/PetProfile');

const API_KEY = 'd9de14b33eb6ef3a291cbd94df9037d8';
const IMGHI_URL = 'https://api.imghippo.com/v1/upload';

exports.uploadPetPicture = async (req, res) => {
  const { petPicturePath } = req.body;
  

  console.log(petPicturePath);

  if (!petPicturePath || petPicturePath === '') {
    return res.status(400).json({
      success: false,
      message: 'No picture path provided',
    });
  }

  const form = new FormData();
  form.append('petPicturePath', fs.createReadStream(petPicturePath));
  form.append('apiKey', API_KEY);

  try {
    const response = await axios.post(IMGHI_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    const petPictureUrl = response.data.url; // Get the URL from the response
    res.status(200).json({
      success: true,
      petPictureUrl, // Return the URL for Dart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload image server',
      error: error.message,
    });
  }
};

exports.createPetProfile = async (req, res) => {
  const { petName, petType, petPicturePath, petAge, petBreed, petDescription } = req.body;

  // Check if the user has already created 5 profiles
  const profileCount = await PetProfile.countDocuments({ user: req.user.id });
  if (profileCount >= 5) {
    return res.status(400).json({
      success: false,
      message: 'You can only create up to 5 pet profiles',
    });
  }

  let petPictureUrl = petPicturePath;
  if (!petPictureUrl || petPictureUrl === '') {
    petPictureUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'; 
  } else {
    // Upload image to ImgHippo
    const form = new FormData();
    form.append('petPicturePath', fs.createReadStream(petPicturePath));
    form.append('apiKey', API_KEY);

    try {
      const response = await axios.post(IMGHI_URL, form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      petPictureUrl = response.data.url; // Get the URL from the response
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message,
      });
    }
  }

  const newPetProfile = new PetProfile({
    user: req.user.id, 
    petName,
    petType,
    petPictures: petPictureUrl,  // Ensure the final petPictures is used
    petAge,
    petBreed,
    petDescription,
    isActive: true,
  });

  try {
    await newPetProfile.save();
    res.status(201).json({
      success: true,
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
      petPictureUrl, // Return the URL for Dart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create pet profile',
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