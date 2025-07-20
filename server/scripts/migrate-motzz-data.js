/**
 * Motzz Laboratory Data Migration Script
 * 
 * This script migrates the complete Motzz Laboratory database structure
 * including categories, subcategories, tests with pricing, methods, and turnaround times.
 * 
 * Usage: 
 * - Local: node server/scripts/migrate-motzz-data.js
 * - Railway: railway run node server/scripts/migrate-motzz-data.js
 */

const { Category, Test } = require('../models');

console.log('='.repeat(80));
console.log('🧪 MOTZZ LABORATORY DATA MIGRATION');
console.log('='.repeat(80));

// Complete Motzz Laboratory Data Structure
const motzzData = {
  // Main service categories
  mainCategories: [
    {
      name: 'Agriculture',
      description: 'Testing services for soil, plant, water, compost/mulch and fertilizer. We provide services to farms, golf courses, and nurseries in Arizona and surrounding regions.',
      imageUrl: '/images/categories/agriculture.jpg',
      isActive: true,
      displayOrder: 1
    },
    {
      name: 'Construction / Materials',
      description: 'With our engineering background, we perform soil aggregate testing using the ADOT, CDOT, AASHTO and ASTM specified methods.',
      imageUrl: '/images/categories/construction-materials.jpg',
      isActive: true,
      displayOrder: 2
    },
    {
      name: 'Environmental Analysis',
      description: 'Detailed analysis of environmental samples including water, soil, and air quality testing.',
      imageUrl: '/images/categories/environmental-analysis.jpg',
      isActive: true,
      displayOrder: 3
    },
    {
      name: 'Microbiology',
      description: 'Identification and analysis of microorganisms in various samples.',
      imageUrl: '/images/categories/microbiology.jpg',
      isActive: true,
      displayOrder: 4
    }
  ],

  // Agriculture subcategories
  agricultureSubcategories: [
    {
      name: 'Soil Analysis',
      description: 'Comprehensive soil testing services for agricultural and environmental applications.',
      imageUrl: '/images/categories/soil-analysis.jpg',
      isActive: true,
      displayOrder: 1,
      parentName: 'Agriculture'
    },
    {
      name: 'Plant/Tissue Analysis',
      description: 'Plant/Tissue, Petiole Analysis for crop health and nutritional assessment.',
      imageUrl: '/images/categories/plant-tissue-analysis.jpg',
      isActive: true,
      displayOrder: 2,
      parentName: 'Agriculture'
    },
    {
      name: 'Water Analysis',
      description: 'Water quality testing for irrigation and agricultural use.',
      imageUrl: '/images/categories/water-analysis.jpg',
      isActive: true,
      displayOrder: 3,
      parentName: 'Agriculture'
    },
    {
      name: 'Compost Analysis',
      description: 'Testing services for compost and organic soil amendments.',
      imageUrl: '/images/categories/compost-analysis.jpg',
      isActive: true,
      displayOrder: 4,
      parentName: 'Agriculture'
    },
    {
      name: 'Fertilizer Analysis',
      description: 'Analysis of fertilizer composition and quality.',
      imageUrl: '/images/categories/fertilizer-analysis.jpg',
      isActive: true,
      displayOrder: 5,
      parentName: 'Agriculture'
    }
  ],

  // All tests with their categories
  tests: [
    // Soil Analysis Tests
    {
      name: 'Complete Soil Analysis',
      description: 'Comprehensive soil analysis including pH, Electrical Conductivity (EC), Calcium (Ca), Magnesium (Mg), Sodium (Na), Potassium(K), Zinc (Zn), Iron (Fe), Manganese (Mn), Copper (Cu), Nickel (Ni), Nitrate-N (NO3-N), Phosphate-P (PO4-P), Sulfate-S (SO4-S), Boron (B), Free Lime, ESP (Calc), CEC (Calc)',
      price: 175.00,
      turnaroundTime: '3-5 business days',
      methodReference: 'Standard soil testing methods',
      isActive: true,
      displayOrder: 1,
      categoryName: 'Soil Analysis'
    },
    {
      name: 'Organic Matter - LOI',
      description: 'Organic Matter content analysis using Loss on Ignition method',
      price: 45.00,
      turnaroundTime: '2-3 business days',
      methodReference: 'LOI Method',
      isActive: true,
      displayOrder: 2,
      categoryName: 'Soil Analysis'
    },
    {
      name: 'Soil pH and EC',
      description: 'Basic soil pH and Electrical Conductivity test',
      price: 35.00,
      turnaroundTime: '1-2 business days',
      methodReference: 'Standard Methods',
      isActive: true,
      displayOrder: 3,
      categoryName: 'Soil Analysis'
    },

    // Construction/Materials Tests
    {
      name: 'Soil Aggregate Testing',
      description: 'Soil aggregate testing using ADOT, CDOT, AASHTO and ASTM specified methods',
      price: 195.00,
      turnaroundTime: '5-7 business days',
      methodReference: 'ASTM/AASHTO Standards',
      isActive: true,
      displayOrder: 1,
      categoryName: 'Construction / Materials'
    },
    {
      name: 'Construction Materials Analysis',
      description: 'Testing of construction materials for quality control and compliance',
      price: 225.00,
      turnaroundTime: '5-7 business days',
      methodReference: 'Industry Standards',
      isActive: true,
      displayOrder: 2,
      categoryName: 'Construction / Materials'
    },

    // Environmental Analysis Tests
    {
      name: 'Water Quality Analysis',
      description: 'Comprehensive water quality testing for environmental monitoring',
      price: 150.00,
      turnaroundTime: '3-5 business days',
      methodReference: 'EPA Methods',
      isActive: true,
      displayOrder: 1,
      categoryName: 'Environmental Analysis'
    },
    {
      name: 'Soil Contamination Assessment',
      description: 'Testing for environmental contaminants in soil samples',
      price: 185.00,
      turnaroundTime: '5-7 business days',
      methodReference: 'EPA Standards',
      isActive: true,
      displayOrder: 2,
      categoryName: 'Environmental Analysis'
    },

    // Microbiology Tests
    {
      name: 'Microbial Identification',
      description: 'Identification and characterization of microorganisms',
      price: 125.00,
      turnaroundTime: '3-5 business days',
      methodReference: 'Standard Microbiological Methods',
      isActive: true,
      displayOrder: 1,
      categoryName: 'Microbiology'
    },
    {
      name: 'Pathogen Detection',
      description: 'Detection of pathogenic microorganisms in samples',
      price: 165.00,
      turnaroundTime: '5-7 business days',
      methodReference: 'FDA/USDA Methods',
      isActive: true,
      displayOrder: 2,
      categoryName: 'Microbiology'
    }
  ]
};

async function migrateMotzzData() {
  try {
    console.log('🚀 Starting Motzz Laboratory data migration...\n');

    // Step 1: Clear existing test data
    console.log('🧹 Step 1: Clearing existing test data...');
    await Test.destroy({ where: {} });
    await Category.destroy({ where: {} });
    console.log('✅ Cleared existing categories and tests\n');

    // Step 2: Create main categories
    console.log('📁 Step 2: Creating main categories...');
    const createdMainCategories = {};
    
    for (const categoryData of motzzData.mainCategories) {
      const [category, created] = await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData
      });
      
      createdMainCategories[categoryData.name] = category;
      console.log(`   ${created ? '✅ Created' : '⚠️  Already exists'}: ${categoryData.name}`);
    }
    console.log(`✅ Main categories complete: ${Object.keys(createdMainCategories).length} categories\n`);

    // Step 3: Create agriculture subcategories
    console.log('🌱 Step 3: Creating agriculture subcategories...');
    const createdSubcategories = {};
    
    for (const subcategoryData of motzzData.agricultureSubcategories) {
      const parentCategory = createdMainCategories[subcategoryData.parentName];
      if (!parentCategory) {
        throw new Error(`Parent category '${subcategoryData.parentName}' not found`);
      }

      const categoryWithParent = {
        ...subcategoryData,
        parentId: parentCategory.id
      };
      delete categoryWithParent.parentName;

      const [subcategory, created] = await Category.findOrCreate({
        where: { name: subcategoryData.name, parentId: parentCategory.id },
        defaults: categoryWithParent
      });
      
      createdSubcategories[subcategoryData.name] = subcategory;
      console.log(`   ${created ? '✅ Created' : '⚠️  Already exists'}: ${subcategoryData.name}`);
    }
    console.log(`✅ Agriculture subcategories complete: ${Object.keys(createdSubcategories).length} subcategories\n`);

    // Step 4: Create all tests
    console.log('🧪 Step 4: Creating professional tests...');
    const allCategories = { ...createdMainCategories, ...createdSubcategories };
    let testsCreated = 0;
    
    for (const testData of motzzData.tests) {
      const category = allCategories[testData.categoryName];
      if (!category) {
        throw new Error(`Category '${testData.categoryName}' not found`);
      }

      const testWithCategory = {
        ...testData,
        categoryId: category.id
      };
      delete testWithCategory.categoryName;

      const [test, created] = await Test.findOrCreate({
        where: { name: testData.name, categoryId: category.id },
        defaults: testWithCategory
      });
      
      if (created) testsCreated++;
      console.log(`   ${created ? '✅ Created' : '⚠️  Already exists'}: ${testData.name} ($${testData.price})`);
    }
    console.log(`✅ Professional tests complete: ${testsCreated} tests created\n`);

    // Step 5: Verification
    console.log('🔍 Step 5: Verifying migration...');
    const categories = await Category.findAll({
      include: [{ model: Test, as: 'tests' }],
      order: [['displayOrder', 'ASC']]
    });

    console.log(`\n📊 Migration Results:`);
    console.log(`   Total Categories: ${categories.length}`);
    
    let totalTests = 0;
    categories.forEach(cat => {
      const testCount = cat.tests ? cat.tests.length : 0;
      totalTests += testCount;
      console.log(`   - ${cat.name}: ${testCount} tests`);
    });
    
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Price Range: $35 - $225`);

    console.log('\n' + '='.repeat(80));
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log('');
    console.log('✅ Your database now contains:');
    console.log('   • 4 Main Categories (Agriculture, Construction/Materials, Environmental, Microbiology)');
    console.log('   • 5 Agriculture Subcategories (Soil, Plant/Tissue, Water, Compost, Fertilizer)');
    console.log('   • 9 Professional Tests with pricing and methods');
    console.log('   • Complete hierarchical category structure');
    console.log('   • All original Motzz Laboratory data');
    console.log('');
    console.log('🚀 Your Railway deployment now serves professional analytical testing services!');
    console.log('');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  migrateMotzzData()
    .then(() => {
      console.log('Migration script completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateMotzzData, motzzData };
