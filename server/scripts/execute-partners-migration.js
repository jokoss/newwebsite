const { sequelize } = require('../models');
const migration = require('../migrations/20250625_create_partners_table');

async function executeMigration() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Executing partners table migration...');
    const result = await migration.up();
    
    if (result) {
      console.log('Migration completed successfully!');
    } else {
      console.error('Migration failed.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

executeMigration();
