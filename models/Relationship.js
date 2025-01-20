const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Relationship = sequelize.define('Relationship', {
  relationId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    defaultValue: () => `REL${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Generate unique relationID on creation
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
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'relationships',
  timestamps: false,
});
Relationship.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Relationship.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = Relationship;