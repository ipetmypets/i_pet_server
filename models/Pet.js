const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Pet = sequelize.define('Pet', {
  petId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    defaultValue: () => `PET${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Generate unique petID on creation
  },
  ownerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'userId',
    },
  },
  petName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  petType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  petPictures: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  petAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  petBreed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  petDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pets',
  timestamps: true,
});

module.exports = Pet;