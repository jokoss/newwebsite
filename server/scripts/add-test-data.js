const { Test, Category } = require('../models');
const sequelize = require('../config/database');

async function addTestData() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get subcategory IDs
    const chemicalCategory = await Category.findOne({ where: { name: 'Chemical Testing' } });
    const physicalCategory = await Category.findOne({ where: { name: 'Physical Testing' } });
    const mechanicalCategory = await Category.findOne({ where: { name: 'Mechanical Testing' } });

    if (!chemicalCategory || !physicalCategory || !mechanicalCategory) {
      console.log('One or more test subcategories not found. Please run add-test-category.js first.');
      return;
    }

    console.log('Found test subcategories:');
    console.log(`- Chemical Testing (ID: ${chemicalCategory.id})`);
    console.log(`- Physical Testing (ID: ${physicalCategory.id})`);
    console.log(`- Mechanical Testing (ID: ${mechanicalCategory.id})`);

    // Add tests for Chemical Testing
    const chemicalTests = [
      {
        name: 'Elemental Analysis',
        description: 'Quantitative determination of elements in a sample using techniques such as ICP-MS, ICP-OES, or AAS.',
        price: 185.00,
        turnaroundTime: '3-5 business days',
        methodReference: 'EPA Method 200.8, ASTM D5673',
        active: true,
        displayOrder: 1,
        categoryId: chemicalCategory.id
      },
      {
        name: 'Organic Compound Analysis',
        description: 'Identification and quantification of organic compounds using GC-MS, LC-MS, or HPLC techniques.',
        price: 220.00,
        turnaroundTime: '4-6 business days',
        methodReference: 'EPA Method 8270D, ASTM D7065',
        active: true,
        displayOrder: 2,
        categoryId: chemicalCategory.id
      },
      {
        name: 'pH and Conductivity Testing',
        description: 'Measurement of pH, electrical conductivity, and total dissolved solids in liquid samples.',
        price: 60.00,
        turnaroundTime: '1-2 business days',
        methodReference: 'EPA Method 150.1, ASTM D1293',
        active: true,
        displayOrder: 3,
        categoryId: chemicalCategory.id
      }
    ];

    // Add tests for Physical Testing
    const physicalTests = [
      {
        name: 'Particle Size Analysis',
        description: 'Determination of the size distribution of particles in a sample using laser diffraction or sieve analysis.',
        price: 150.00,
        turnaroundTime: '2-3 business days',
        methodReference: 'ASTM B822, ISO 13320',
        active: true,
        displayOrder: 1,
        categoryId: physicalCategory.id
      },
      {
        name: 'Density and Specific Gravity',
        description: 'Measurement of density, specific gravity, and porosity of solid and liquid materials.',
        price: 95.00,
        turnaroundTime: '1-2 business days',
        methodReference: 'ASTM D792, ISO 1183',
        active: true,
        displayOrder: 2,
        categoryId: physicalCategory.id
      },
      {
        name: 'Viscosity Testing',
        description: 'Determination of viscosity and flow properties of liquids and semi-solids.',
        price: 110.00,
        turnaroundTime: '2-3 business days',
        methodReference: 'ASTM D445, ISO 3104',
        active: true,
        displayOrder: 3,
        categoryId: physicalCategory.id
      }
    ];

    // Add tests for Mechanical Testing
    const mechanicalTests = [
      {
        name: 'Tensile Strength Testing',
        description: 'Measurement of the force required to pull a material to the point where it breaks.',
        price: 175.00,
        turnaroundTime: '3-4 business days',
        methodReference: 'ASTM D638, ISO 527',
        active: true,
        displayOrder: 1,
        categoryId: mechanicalCategory.id
      },
      {
        name: 'Compression Testing',
        description: 'Evaluation of a material\'s behavior when subjected to compressive loads.',
        price: 165.00,
        turnaroundTime: '3-4 business days',
        methodReference: 'ASTM D695, ISO 604',
        active: true,
        displayOrder: 2,
        categoryId: mechanicalCategory.id
      },
      {
        name: 'Hardness Testing',
        description: 'Measurement of a material\'s resistance to indentation or scratching.',
        price: 90.00,
        turnaroundTime: '1-2 business days',
        methodReference: 'ASTM E18, ISO 6508',
        active: true,
        displayOrder: 3,
        categoryId: mechanicalCategory.id
      }
    ];

    // Create all tests
    const allTests = [...chemicalTests, ...physicalTests, ...mechanicalTests];
    
    for (const testData of allTests) {
      const existingTest = await Test.findOne({
        where: {
          name: testData.name,
          categoryId: testData.categoryId
        }
      });

      if (existingTest) {
        console.log(`Test "${testData.name}" already exists for this category.`);
      } else {
        const newTest = await Test.create(testData);
        console.log(`Created test: ${newTest.name} (ID: ${newTest.id}) for category ID: ${testData.categoryId}`);
      }
    }

    console.log('Test data creation completed successfully.');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
addTestData();
