const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Chat = sequelize.define('Chat', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    defaultValue: () => `CHT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Generate unique chatID on creation
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'userId',
    },
  },
  receiverId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'userId',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chats',
  timestamps: false,
});

module.exports = Chat;