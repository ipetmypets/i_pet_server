const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
  const { petName, petType, petAge, petBreed, petDescription } = req.body;

  try {
    const newPetProfile = new PetProfile({
      user: req.user.id,
      petName,
      petType,
      petAge,
      petBreed,
      petDescription,
    });
    await newPetProfile.save();
    res.status(201).json(newPetProfile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
