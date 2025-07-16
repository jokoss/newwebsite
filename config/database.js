const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

// Use PostgreSQL for production and SQLite for development/testing
if (process.env.NODE_ENV === 'production') {
  // Use DATABASE_URL provided by Render
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Render PostgreSQL
      }
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
  console.log('Using PostgreSQL database in production');
} else {
  // Use SQLite for development/testing
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
  console.log('Using SQLite database in development');
}

module.exports = sequelize;
