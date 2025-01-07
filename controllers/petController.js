const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
  const { petName, petType, petPictures, petAge, petBreed, petDescription } = req.body;

  // Validate the URL (Optional)
  if (!petPictures || !isValidURL(petPictures)) {
    return res.status(400).json({ message: 'Invalid pet picture URL.' });
  }

  const newPetProfile = new PetProfile({
    user: req.user.id, // Extracted from the JWT middleware
    petName,
    petType,
    petPictures, // Save the manual URL here
    petAge,
    petBreed,
    petDescription,
  });

  await newPetProfile.save();

  res.status(201).json({
    message: 'Pet profile created successfully',
    petProfile: newPetProfile,
  });
};

const isValidURL = (url) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
};
