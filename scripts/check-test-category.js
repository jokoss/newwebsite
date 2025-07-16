const { Category, Test } = require('../models');
const sequelize = require('../config/database');

async function checkTestCategory() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Find the "test" category
    const testCategory = await Category.findOne({
      where: { name: 'test' },
      include: [{
        model: Category,
        as: 'parent',
        attributes: ['id', 'name', 'active']
      }]
    });
    
    if (!testCategory) {
      console.log('No category with name "test" found in the database.');
      return;
    }
    
    console.log('Found category:', JSON.stringify(testCategory.toJSON(), null, 2));
    
    // Check if the category is active
    if (!testCategory.active) {
      console.log('Category is not active. Activating now...');
      testCategory.active = true;
      await testCategory.save();
      console.log('Category has been activated.');
    } else {
      console.log('Category is already active.');
    }
    
    // Check if it's a subcategory and verify parent status
    if (testCategory.parentId) {
      console.log(`This is a subcategory with parent ID: ${testCategory.parentId}`);
      
      if (testCategory.parent) {
        console.log(`Parent category: ${testCategory.parent.name}`);
        
        if (!testCategory.parent.active) {
          console.log('Parent category is not active. Parent needs to be active for subcategory to display.');
          console.log('Would you like to activate the parent category? (This script doesn\'t do this automatically)');
        }
      } else {
        console.log('Parent category not found. This could be an issue.');
      }
    } else {
      console.log('This is a top-level category.');
    }
    
    // Check for associated tests
    const tests = await Test.findAll({
      where: { categoryId: testCategory.id }
    });
    
    console.log(`Category has ${tests.length} associated tests.`);
    
    console.log('Check complete.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
checkTestCategory();
