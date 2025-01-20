const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { v4: uuidv4 } = require('uuid');  // Import UUID for unique IDs (optional)

// Define the User model with auto-increment `userID`
const User = sequelize.define('User', {
  
  // Auto-incrementing unique userID (formatted as USR0001, USR0002, etc.)
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    defaultValue: () => `USR${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Generate unique userID on creation
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_pic: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true, // Add timestamps to track createdAt and updatedAt
});

// Hook to automatically increment userID before creating a user
User.beforeCreate(async (user, options) => {
  const lastUser = await User.findOne({ order: [['userId', 'DESC']] });
  const nextUserId = lastUser ? parseInt(lastUser.userId.replace('USR', '')) + 1 : 1;
  user.userId = `USR${nextUserId.toString().padStart(4, '0')}`;
});

module.exports = User;
