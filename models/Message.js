const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Chat = require('./Chat');

const Message = sequelize.define('Message', {
  messageId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true, // Allow NULL values
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'messages',
  timestamps: true,
});

// Define associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'userId' });
Message.belongsTo(Chat, { as: 'chat', foreignKey: 'chatId' });
Chat.hasMany(Message, { as: 'messages', foreignKey: 'chatId' });
User.hasMany(Message, { as: 'messages', foreignKey: 'userId' });

module.exports = Message;