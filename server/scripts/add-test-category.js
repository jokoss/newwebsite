const { Category } = require('../models');
const sequelize = require('../config/database');

async function addTestCategory() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Check if test category already exists
    const existingCategory = await Category.findOne({
      where: { name: 'Test' }
    });
    
    if (existingCategory) {
      console.log('Test category already exists with ID:', existingCategory.id);
      
      // Make sure it's active
      if (!existingCategory.active) {
        existingCategory.active = true;
        await existingCategory.save();
        console.log('Category was inactive, now activated.');
      }
      
      return;
    }
    
    // Create the test category
    const testCategory = await Category.create({
      name: 'Test',
      description: 'Testing services for various analytical needs',
      imageUrl: '/images/categories/test.jpg',
      active: true,
      displayOrder: 5 // After the existing categories
    });
    
    console.log('Test category created successfully with ID:', testCategory.id);
    
    // Create some example subcategories
    const subcategories = [
      {
        name: 'Chemical Testing',
        description: 'Chemical composition and properties testing',
        active: true,
        displayOrder: 1,
        parentId: testCategory.id
      },
      {
        name: 'Physical Testing',
        description: 'Physical properties and characteristics testing',
        active: true,
        displayOrder: 2,
        parentId: testCategory.id
      },
      {
        name: 'Mechanical Testing',
        description: 'Strength, durability, and performance testing',
        active: true,
        displayOrder: 3,
        parentId: testCategory.id
      }
    ];
    
    for (const subcategoryData of subcategories) {
      const subcategory = await Category.create(subcategoryData);
      console.log(`Created subcategory: ${subcategory.name} with ID: ${subcategory.id}`);
    }
    
    console.log('Test category and subcategories created successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
addTestCategory();
