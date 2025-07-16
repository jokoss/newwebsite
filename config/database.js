const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for development/testing
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;
