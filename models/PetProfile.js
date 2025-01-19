const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PetProfile = sequelize.define('PetProfile', {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  petName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petPictures: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petAge: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  petBreed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petDescription: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'pet_profiles',
  timestamps: false
});

module.exports = PetProfile;