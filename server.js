const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const petRoutes = require('./routes/pet');
const messageRoutes = require('./routes/message');
const matchRoutes = require('./routes/match');
const upload = require('./routes/upload');  // Import upload route

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/pet', petRoutes);
app.use('/message', messageRoutes);
app.use('/match', matchRoutes);
app.use('/uploads', express.static(path.join(upload, 'uploads')));  // Use the new upload routes

app.get('/api', (req, res) => {
    res.json({ message: "Welcome to the iPetMyPets API!" });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
