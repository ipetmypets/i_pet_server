const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, profile_pic, password, longitude, latitude } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      profile_pic,
      password: hashedPassword,
     location: longitude && latitude ? { longitude, latitude } : null, // Ensure this is an object with both fields
    });

    const token = jwt.sign({ userId: newUser.userId, username: newUser.username }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the user's password exists
    if (!user.password) {
      return res.status(500).json({ message: 'User password is missing in the database' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET);

    // Respond with the token and user data
    res.status(200).json({ token, user: { userId: user.userId, email: user.email } });
  } catch (err) {
    console.error('Login error:', err); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};