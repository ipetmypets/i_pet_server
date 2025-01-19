const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const petRoutes = require('./routes/pet');
const messageRoutes = require('./routes/message');
const relationshipRoutes = require('./routes/relationship');
const notificationRoutes = require('./routes/notification'); 

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// Connect to MySQL
connectDB();

// Sync Sequelize models with database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables created!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/pet', petRoutes);
app.use('/message', messageRoutes);
app.use('/relationship', relationshipRoutes);
app.use('/notification', notificationRoutes);

app.get('/api', (req, res) => {
    res.json({ message: "Welcome to the iPetMyPets API!" });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});