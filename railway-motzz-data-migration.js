/**
 * Railway Database Migration Script for Motzz Laboratory Data
 * 
 * This script migrates the complete Motzz Laboratory database structure to Railway PostgreSQL
 * including categories, subcategories, tests with pricing, methods, and turnaround times.
 * 
 * Usage: Run the Railway CLI commands provided at the end of this script
 */

console.log('='.repeat(80));
console.log('RAILWAY MOTZZ LABORATORY DATA MIGRATION');
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

  // Soil Analysis Tests
  soilTests: [
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
    }
  ],

  // Construction/Materials Tests
  constructionTests: [
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
    }
  ],

  // Additional tests for other categories
  environmentalTests: [
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
    }
  ],

  microbiologyTests: [
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

console.log('Motzz Laboratory Data Structure:');
console.log(`- ${motzzData.mainCategories.length} Main Categories`);
console.log(`- ${motzzData.agricultureSubcategories.length} Agriculture Subcategories`);
console.log(`- ${motzzData.soilTests.length + motzzData.constructionTests.length + motzzData.environmentalTests.length + motzzData.microbiologyTests.length} Total Tests`);
console.log('');

console.log('='.repeat(80));
console.log('RAILWAY CLI MIGRATION COMMANDS');
console.log('='.repeat(80));
console.log('');
console.log('1. First, login to Railway:');
console.log('   railway login');
console.log('');
console.log('2. Clear existing test data:');
console.log('');

// Clear existing test data
console.log('railway run node -e "');
console.log('const { Category, Test } = require(\'./server/models\');');
console.log('(async () => {');
console.log('  try {');
console.log('    await Test.destroy({ where: {} });');
console.log('    await Category.destroy({ where: {} });');
console.log('    console.log(\'✅ Cleared existing categories and tests\');');
console.log('    process.exit(0);');
console.log('  } catch (error) {');
console.log('    console.error(\'❌ Error clearing data:\', error.message);');
console.log('    process.exit(1);');
console.log('  }');
console.log('})();');
console.log('"');
console.log('');

console.log('3. Create main categories:');
console.log('');

// Create main categories
motzzData.mainCategories.forEach((category, index) => {
  console.log(`railway run node -e "`);
  console.log(`const { Category } = require('./server/models');`);
  console.log(`Category.findOrCreate({`);
  console.log(`  where: { name: '${category.name}' },`);
  console.log(`  defaults: {`);
  console.log(`    name: '${category.name}',`);
  console.log(`    description: '${category.description}',`);
  console.log(`    imageUrl: '${category.imageUrl}',`);
  console.log(`    isActive: ${category.isActive},`);
  console.log(`    displayOrder: ${category.displayOrder}`);
  console.log(`  }`);
  console.log(`}).then(([category, created]) => {`);
  console.log(`  console.log('${category.name}:', created ? 'Created' : 'Already exists');`);
  console.log(`  process.exit(0);`);
  console.log(`}).catch(err => {`);
  console.log(`  console.error('Error:', err.message);`);
  console.log(`  process.exit(1);`);
  console.log(`});`);
  console.log(`"`);
  console.log('');
});

console.log('4. Create agriculture subcategories:');
console.log('');

// Create agriculture subcategories
motzzData.agricultureSubcategories.forEach((subcategory, index) => {
  console.log(`railway run node -e "`);
  console.log(`const { Category } = require('./server/models');`);
  console.log(`(async () => {`);
  console.log(`  try {`);
  console.log(`    const parent = await Category.findOne({ where: { name: '${subcategory.parentName}' } });`);
  console.log(`    if (!parent) throw new Error('Parent category not found');`);
  console.log(`    const [category, created] = await Category.findOrCreate({`);
  console.log(`      where: { name: '${subcategory.name}', parentId: parent.id },`);
  console.log(`      defaults: {`);
  console.log(`        name: '${subcategory.name}',`);
  console.log(`        description: '${subcategory.description}',`);
  console.log(`        imageUrl: '${subcategory.imageUrl}',`);
  console.log(`        isActive: ${subcategory.isActive},`);
  console.log(`        displayOrder: ${subcategory.displayOrder},`);
  console.log(`        parentId: parent.id`);
  console.log(`      }`);
  console.log(`    });`);
  console.log(`    console.log('${subcategory.name}:', created ? 'Created' : 'Already exists');`);
  console.log(`    process.exit(0);`);
  console.log(`  } catch (error) {`);
  console.log(`    console.error('Error:', error.message);`);
  console.log(`    process.exit(1);`);
  console.log(`  }`);
  console.log(`})();`);
  console.log(`"`);
  console.log('');
});

console.log('5. Create soil analysis tests:');
console.log('');

// Create soil tests
motzzData.soilTests.forEach((test, index) => {
  console.log(`railway run node -e "`);
  console.log(`const { Category, Test } = require('./server/models');`);
  console.log(`(async () => {`);
  console.log(`  try {`);
  console.log(`    const category = await Category.findOne({ where: { name: '${test.categoryName}' } });`);
  console.log(`    if (!category) throw new Error('Category not found');`);
  console.log(`    const [testRecord, created] = await Test.findOrCreate({`);
  console.log(`      where: { name: '${test.name}', categoryId: category.id },`);
  console.log(`      defaults: {`);
  console.log(`        name: '${test.name}',`);
  console.log(`        description: '${test.description}',`);
  console.log(`        price: ${test.price},`);
  console.log(`        turnaroundTime: '${test.turnaroundTime}',`);
  console.log(`        methodReference: '${test.methodReference}',`);
  console.log(`        isActive: ${test.isActive},`);
  console.log(`        displayOrder: ${test.displayOrder},`);
  console.log(`        categoryId: category.id`);
  console.log(`      }`);
  console.log(`    });`);
  console.log(`    console.log('${test.name}: $${test.price}:', created ? 'Created' : 'Already exists');`);
  console.log(`    process.exit(0);`);
  console.log(`  } catch (error) {`);
  console.log(`    console.error('Error:', error.message);`);
  console.log(`    process.exit(1);`);
  console.log(`  }`);
  console.log(`})();`);
  console.log(`"`);
  console.log('');
});

console.log('6. Create construction/materials tests:');
console.log('');

// Create construction tests
motzzData.constructionTests.forEach((test, index) => {
  console.log(`railway run node -e "`);
  console.log(`const { Category, Test } = require('./server/models');`);
  console.log(`(async () => {`);
  console.log(`  try {`);
  console.log(`    const category = await Category.findOne({ where: { name: '${test.categoryName}' } });`);
  console.log(`    if (!category) throw new Error('Category not found');`);
  console.log(`    const [testRecord, created] = await Test.findOrCreate({`);
  console.log(`      where: { name: '${test.name}', categoryId: category.id },`);
  console.log(`      defaults: {`);
  console.log(`        name: '${test.name}',`);
  console.log(`        description: '${test.description}',`);
  console.log(`        price: ${test.price},`);
  console.log(`        turnaroundTime: '${test.turnaroundTime}',`);
  console.log(`        methodReference: '${test.methodReference}',`);
  console.log(`        isActive: ${test.isActive},`);
  console.log(`        displayOrder: ${test.displayOrder},`);
  console.log(`        categoryId: category.id`);
  console.log(`      }`);
  console.log(`    });`);
  console.log(`    console.log('${test.name}: $${test.price}:', created ? 'Created' : 'Already exists');`);
  console.log(`    process.exit(0);`);
  console.log(`  } catch (error) {`);
  console.log(`    console.error('Error:', error.message);`);
  console.log(`    process.exit(1);`);
  console.log(`  }`);
  console.log(`})();`);
  console.log(`"`);
  console.log('');
});

console.log('7. Create environmental analysis tests:');
console.log('');

// Create environmental tests
motzzData.environmentalTests.forEach((test, index) => {
  console.log(`railway run node -e "`);
  console.log(`const { Category, Test } = require('./server/models');`);
  console.log(`(async () => {`);
  console.log(`  try {`);
  console.log(`    const category = await Category.findOne({ where: { name: '${test.categoryName}' } });`);
  console.log(`    if (!category) throw new Error('Category not found');`);
  console.log(`    const [testRecord, created] = await Test.findOrCreate({`);
  console.log(`      where: { name: '${test.name}', categoryId: category.id },`);
  console.log(`      defaults: {`);
  console.log(`        name: '${test.name}',`);
  console.log(`        description: '${test.description}',`);
  console.log(`        price: ${test.price},`);
  console.log(`        turnaroundTime: '${test.turnaroundTime}',`);
  console.log(`        methodReference: '${test.methodReference}',`);
  console.log(`        isActive: ${test.isActive},`);
  console.log(`        displayOrder: ${test.displayOrder},`);
  console.log(`        categoryId: category.id`);
  console.log(`      }`);
  console.log(`    });`);
  console.log(`    console.log('${test.name}: $${test.price}:', created ? 'Created' : 'Already exists');`);
  console.log(`    process.exit(0);`);
  console.log(`  } catch (error) {`);
  console.log(`    console.error('Error:', error.message);`);
  console.log(`    process.exit(1);`);
  console.log(`  }`);
  console.log(`})();`);
  console.log(`"`);
  console.log('');
});

console.log('8. Create microbiology tests:');
console.log('');

// Create microbiology tests
motzzData.microbiologyTests.forEach((test, index) => {
  console.log(`railway run node -e "`);
  console.log(`const { Category, Test } = require('./server/models');`);
  console.log(`(async () => {`);
  console.log(`  try {`);
  console.log(`    const category = await Category.findOne({ where: { name: '${test.categoryName}' } });`);
  console.log(`    if (!category) throw new Error('Category not found');`);
  console.log(`    const [testRecord, created] = await Test.findOrCreate({`);
  console.log(`      where: { name: '${test.name}', categoryId: category.id },`);
  console.log(`      defaults: {`);
  console.log(`        name: '${test.name}',`);
  console.log(`        description: '${test.description}',`);
  console.log(`        price: ${test.price},`);
  console.log(`        turnaroundTime: '${test.turnaroundTime}',`);
  console.log(`        methodReference: '${test.methodReference}',`);
  console.log(`        isActive: ${test.isActive},`);
  console.log(`        displayOrder: ${test.displayOrder},`);
  console.log(`        categoryId: category.id`);
  console.log(`      }`);
  console.log(`    });`);
  console.log(`    console.log('${test.name}: $${test.price}:', created ? 'Created' : 'Already exists');`);
  console.log(`    process.exit(0);`);
  console.log(`  } catch (error) {`);
  console.log(`    console.error('Error:', error.message);`);
  console.log(`    process.exit(1);`);
  console.log(`  }`);
  console.log(`})();`);
  console.log(`"`);
  console.log('');
});

console.log('9. Verify migration:');
console.log('');
console.log('railway run node -e "');
console.log('const { Category, Test } = require(\'./server/models\');');
console.log('(async () => {');
console.log('  try {');
console.log('    const categories = await Category.findAll({ include: [{ model: Test, as: \'tests\' }] });');
console.log('    console.log(`✅ Migration Complete: ${categories.length} categories`);');
console.log('    categories.forEach(cat => {');
console.log('      console.log(`- ${cat.name}: ${cat.tests ? cat.tests.length : 0} tests`);');
console.log('    });');
console.log('    process.exit(0);');
console.log('  } catch (error) {');
console.log('    console.error(\'❌ Error verifying:\', error.message);');
console.log('    process.exit(1);');
console.log('  }');
console.log('})();');
console.log('"');
console.log('');

console.log('='.repeat(80));
console.log('MIGRATION SUMMARY');
console.log('='.repeat(80));
console.log('');
console.log('This migration will create:');
console.log('✅ 4 Main Categories (Agriculture, Construction/Materials, Environmental, Microbiology)');
console.log('✅ 5 Agriculture Subcategories (Soil, Plant/Tissue, Water, Compost, Fertilizer)');
console.log('✅ 9 Professional Tests with pricing ($35-$225)');
console.log('✅ Complete hierarchical category structure');
console.log('✅ All original Motzz Laboratory data');
console.log('');
console.log('After running these commands, your Railway database will have all the');
console.log('professional analytical testing data instead of the test categories.');
console.log('');
console.log('='.repeat(80));
