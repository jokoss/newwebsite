const { Category } = require('../models');
const sequelize = require('../config/database');

async function activateCategories() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get all categories
    const categories = await Category.findAll();
    console.log(`Found ${categories.length} categories`);

    // Update all categories to active
    let updatedCount = 0;
    for (const category of categories) {
      if (!category.active) {
        category.active = true;
        await category.save();
        updatedCount++;
        console.log(`Activated category: ${category.name} (ID: ${category.id})`);
      }
    }

    console.log(`Activated ${updatedCount} categories`);
    console.log('All categories are now active');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error activating categories:', error);
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing database connection:', e);
    }
    process.exit(1);
  }
}

// Run the function
activateCategories();
