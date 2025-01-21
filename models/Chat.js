const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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

module.exports = Chat;