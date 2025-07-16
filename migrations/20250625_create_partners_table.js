const { Sequelize } = require('sequelize');
const { sequelize } = require('../models');

async function up() {
  try {
    // Check if the partners table already exists
    const [results] = await sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='partners'
    `);

    if (results.length === 0) {
      // Create the partners table
      await sequelize.query(`
        CREATE TABLE partners (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          logo TEXT,
          website TEXT,
          description TEXT,
          displayOrder INTEGER DEFAULT 0,
          isActive BOOLEAN DEFAULT 1,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Partners table created successfully');
    } else {
      console.log('Partners table already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating partners table:', error);
    return false;
  }
}

async function down() {
  try {
    // Drop the partners table
    await sequelize.query('DROP TABLE IF EXISTS partners');
    console.log('Partners table dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping partners table:', error);
    return false;
  }
}

module.exports = { up, down };
