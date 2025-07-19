const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

// Use PostgreSQL for production and SQLite for development/testing
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  // Use DATABASE_URL provided by Railway/Render
  console.log('Using PostgreSQL database in production with DATABASE_URL');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Railway/Render PostgreSQL
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else if (process.env.NODE_ENV === 'production') {
  // Fallback to SQLite for production if DATABASE_URL is not set
  console.log('DATABASE_URL not set. Using SQLite in production (Railway fallback)');
  const dbPath = path.join(__dirname, '../database.sqlite');
  console.log('SQLite database path:', dbPath);
  
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  // Use SQLite for development/testing
  console.log('Using SQLite database in development');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
}

module.exports = sequelize;
