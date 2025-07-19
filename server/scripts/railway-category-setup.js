const { Category } = require('../models');
const sequelize = require('../config/database');

// Complete category data with proper images
const categoryData = [
  {
    id: 1,
    name: 'Biochemical Testing',
    description: 'Comprehensive analysis of biological materials for chemical properties and components.',
    imageUrl: '/images/categories/biochemical-testing.jpg',
    active: true,
    displayOrder: 1,
    parentId: null
  },
  {
    id: 2,
    name: 'Environmental Analysis',
    description: 'Detailed analysis of environmental samples including water, soil, and air quality testing.',
    imageUrl: '/images/categories/environmental-analysis.jpg',
    active: true,
    displayOrder: 2,
    parentId: null
  },
  {
    id: 3,
    name: 'Microbiological Testing',
    description: 'Identification and analysis of microorganisms in various samples.',
    imageUrl: '/images/categories/microbiological-testing.jpg',
    active: true,
    displayOrder: 3,
    parentId: null
  },
  {
    id: 4,
    name: 'Molecular Diagnostics',
    description: 'Advanced DNA and RNA-based testing for research and clinical applications.',
    imageUrl: '/images/categories/molecular-diagnostics.jpg',
    active: true,
    displayOrder: 4,
    parentId: null
  },
  {
    id: 5,
    name: 'Material Characterization',
    description: 'Analysis of material properties and composition for research and quality control.',
    imageUrl: '/images/categories/material-characterization.jpg',
    active: true,
    displayOrder: 5,
    parentId: null
  },
  {
    id: 6,
    name: 'Pharmaceutical Analysis',
    description: 'Testing and validation of pharmaceutical products and ingredients.',
    imageUrl: '/images/categories/pharmaceutical-analysis.jpg',
    active: true,
    displayOrder: 6,
    parentId: null
  },
  {
    id: 7,
    name: 'Food & Beverage Testing',
    description: 'Quality and safety testing for food and beverage products.',
    imageUrl: '/images/categories/food-beverage-testing.jpg',
    active: true,
    displayOrder: 7,
    parentId: null
  },
  {
    id: 8,
    name: 'Toxicology Screening',
    description: 'Detection and analysis of toxic substances in various sample types.',
    imageUrl: '/images/categories/toxicology-screening.jpg',
    active: true,
    displayOrder: 8,
    parentId: null
  }
];

async function setupCategories() {
  try {
    console.log('🔧 Railway Category Setup - Starting...');
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Get existing categories
    const existingCategories = await Category.findAll();
    console.log(`📊 Found ${existingCategories.length} existing categories`);

    // Display existing categories
    if (existingCategories.length > 0) {
      console.log('\n📋 Existing Categories:');
      existingCategories.forEach(cat => {
        console.log(`  - ID: ${cat.id}, Name: "${cat.name}", Active: ${cat.active}, Parent: ${cat.parentId}`);
      });
    }

    // Activate all existing categories first
    let activatedCount = 0;
    for (const category of existingCategories) {
      if (!category.active) {
        category.active = true;
        await category.save();
        activatedCount++;
        console.log(`✅ Activated category: ${category.name} (ID: ${category.id})`);
      }
    }

    if (activatedCount > 0) {
      console.log(`✅ Activated ${activatedCount} existing categories`);
    } else {
      console.log('ℹ️  All existing categories were already active');
    }

    // Check if we need to add the standard categories
    const existingNames = existingCategories.map(cat => cat.name.toLowerCase());
    const missingCategories = categoryData.filter(cat => 
      !existingNames.includes(cat.name.toLowerCase())
    );

    if (missingCategories.length > 0) {
      console.log(`\n🔄 Adding ${missingCategories.length} missing standard categories...`);
      
      for (const categoryInfo of missingCategories) {
        try {
          const newCategory = await Category.create({
            name: categoryInfo.name,
            description: categoryInfo.description,
            imageUrl: categoryInfo.imageUrl,
            active: categoryInfo.active,
            displayOrder: categoryInfo.displayOrder,
            parentId: categoryInfo.parentId
          });
          console.log(`✅ Created category: ${newCategory.name} (ID: ${newCategory.id})`);
        } catch (error) {
          console.error(`❌ Error creating category "${categoryInfo.name}":`, error.message);
        }
      }
    } else {
      console.log('ℹ️  All standard categories already exist');
    }

    // Final verification
    const finalCategories = await Category.findAll({
      where: { active: true, parentId: null },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });

    console.log(`\n🎉 Setup Complete!`);
    console.log(`📊 Total active main categories: ${finalCategories.length}`);
    console.log('\n📋 Active Categories (will show on homepage):');
    finalCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (ID: ${cat.id})`);
      console.log(`     Description: ${cat.description}`);
      console.log(`     Image: ${cat.imageUrl}`);
      console.log(`     Display Order: ${cat.displayOrder}`);
      console.log('');
    });

    console.log('✅ Categories are now properly configured for Railway deployment!');
    console.log('🌐 Your homepage should now display all active categories with images.');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up categories:', error);
    console.error('Error details:', error.message);
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing database connection:', e);
    }
    process.exit(1);
  }
}

// Run the function
setupCategories();
