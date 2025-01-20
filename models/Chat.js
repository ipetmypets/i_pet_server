const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Chat = sequelize.define('Chat', {
  chatId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chatName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'chats',
  timestamps: true,
});

// Define associations
Chat.belongsToMany(User, { through: 'UserChats', as: 'participants', foreignKey: 'chatId' });
User.belongsToMany(Chat, { through: 'UserChats', as: 'chats', foreignKey: 'userId' });

module.exports = Chat;