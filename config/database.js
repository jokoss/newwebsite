const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

// Use PostgreSQL for production and SQLite for development/testing
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
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
} else if (process.env.NODE_ENV === 'production') {
  // Fallback to SQLite for production if DATABASE_URL is not set
  console.log('DATABASE_URL not set. Falling back to SQLite in production (not recommended)');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
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
