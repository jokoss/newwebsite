const { Category } = require('../models');
const sequelize = require('../config/database');

async function checkCategoryDetails() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get all categories
    const categories = await Category.findAll();
    console.log(`Found ${categories.length} categories`);
    
    console.log('\nCategory Details:');
    console.log('=================');
    
    categories.forEach(category => {
      console.log(`ID: ${category.id}`);
      console.log(`Name: ${category.name}`);
      console.log(`Description: ${category.description}`);
      console.log(`Image URL: ${category.imageUrl}`);
      console.log(`Active: ${category.active}`);
      console.log(`Display Order: ${category.displayOrder}`);
      console.log(`Parent ID: ${category.parentId}`);
      console.log('=================');
    });

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking category details:', error);
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing database connection:', e);
    }
    process.exit(1);
  }
}

// Run the function
checkCategoryDetails();
