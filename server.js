const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const petRoutes = require('./routes/pet');
const relationshipRoutes = require('./routes/relationship');
const chatRoutes = require('./routes/chat'); // Add chat routes
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
app.use('/relationship', relationshipRoutes);
app.use('/chat', chatRoutes); // Register chat routes

app.get('/api', (req, res) => {
    res.json({ message: "Welcome to the iPetMyPets API!" });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinChat', (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`User joined chat ${chatId}`);
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(`chat_${chatId}`);
    console.log(`User left chat ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
// Start server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});