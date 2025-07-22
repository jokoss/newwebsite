const { Sequelize } = require('sequelize');
const path = require('path');

// Force production environment for Railway
process.env.NODE_ENV = 'production';

console.log('🚀 RAILWAY MIGRATION: Forcing production environment');
console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);

// Import the migration script after setting environment
require('./migrate-motzz-data.js');
