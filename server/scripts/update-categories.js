const { Category } = require('../models');
const sequelize = require('../config/database');

async function updateCategories() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get all categories
    const categories = await Category.findAll();
    console.log(`Found ${categories.length} categories`);

    // Update all categories to active and ensure they have proper display order
    let updatedCount = 0;
    for (const [index, category] of categories.entries()) {
      let updated = false;
      
      // Ensure active is true
      if (!category.active) {
        category.active = true;
        updated = true;
      }
      
      // Ensure display order is set
      if (category.displayOrder === null || category.displayOrder === undefined) {
        category.displayOrder = index + 1;
        updated = true;
      }
      
      // Save if changes were made
      if (updated) {
        await category.save();
        updatedCount++;
        console.log(`Updated category: ${category.name} (ID: ${category.id})`);
      }
    }

    console.log(`Updated ${updatedCount} categories`);
    console.log('All categories are now active and have display order set');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error updating categories:', error);
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing database connection:', e);
    }
    process.exit(1);
  }
}

// Run the function
updateCategories();
