require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/database');

// Get the migration file
const migrationFile = require('../migrations/20250708_create_blog_posts_table');

async function executeMigration() {
  try {
    console.log('Starting blog posts table migration...');
    
    // Execute the migration
    await migrationFile.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('Blog posts table migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error executing blog posts migration:', error);
    process.exit(1);
  }
}

// Run the migration
executeMigration();
