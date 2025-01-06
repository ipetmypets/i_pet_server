const PetProfile = require('../models/PetProfile');
const { validationResult } = require('express-validator'); // For request validation

exports.createPetProfile = async (req, res) => {
  const { petName, petType, petAge, petBreed, petPictures, petDescription } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create new pet profile
    const newPetProfile = new PetProfile({
      user: req.user.id, // Assuming `req.user` is populated via authentication middleware
      petName,
      petType,
      petAge,
      petBreed,
      petPictures,
      petDescription,
    });

    // Save to the database
    await newPetProfile.save();

    // Send success response
    res.status(201).json({
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
