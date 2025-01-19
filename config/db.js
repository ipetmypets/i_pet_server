// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a Sequelize instance and connect to the MySQL database
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,  // Database name
  process.env.MYSQL_USER,      // Database username
  process.env.MYSQL_PASSWORD,  // Database password
  {
    host: process.env.MYSQL_HOST,  // Hostname (usually localhost)
    dialect: 'mysql',              // Database dialect
    logging: false,                // Disable query logging for production
  }
);

// Error handling function
const handleDBError = (err) => {
  console.error('Database connection error:', err.message);
  // Optionally log the full error object for debugging
  console.error(err);
};

// Database connection function
const connectDB = async () => {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (err) {
    // Log the error and stop the process
    handleDBError(err);
    process.exit(1); // Exit the process with failure
  }
};

// Export the Sequelize instance and the connectDB function
module.exports = { sequelize, connectDB };