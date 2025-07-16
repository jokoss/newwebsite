const { Category, Test } = require('../models');
const sequelize = require('../config/database');

async function seedData() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Create sample categories
    const categories = [
      {
        name: 'Biochemical Testing',
        description: 'Comprehensive analysis of biological materials for chemical properties and components.',
        imageUrl: '',
        active: true,
        displayOrder: 1
      },
      {
        name: 'Environmental Analysis',
        description: 'Detailed analysis of environmental samples including water, soil, and air quality testing.',
        imageUrl: '',
        active: true,
        displayOrder: 2
      },
      {
        name: 'Microbiological Testing',
        description: 'Identification and analysis of microorganisms in various samples.',
        imageUrl: '',
        active: true,
        displayOrder: 3
      },
      {
        name: 'Molecular Diagnostics',
        description: 'Advanced DNA and RNA-based testing for research and clinical applications.',
        imageUrl: '',
        active: true,
        displayOrder: 4
      },
      {
        name: 'Material Characterization',
        description: 'Analysis of material properties and composition for research and quality control.',
        imageUrl: '',
        active: true,
        displayOrder: 5
      },
      {
        name: 'Pharmaceutical Analysis',
        description: 'Testing and validation of pharmaceutical products and ingredients.',
        imageUrl: '',
        active: true,
        displayOrder: 6
      },
      {
        name: 'Food & Beverage Testing',
        description: 'Quality and safety testing for food and beverage products.',
        imageUrl: '',
        active: true,
        displayOrder: 7
      },
      {
        name: 'Toxicology Screening',
        description: 'Detection and analysis of toxic substances in various sample types.',
        imageUrl: '',
        active: true,
        displayOrder: 8
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ where: { name: categoryData.name } });
      if (!existingCategory) {
        await Category.create(categoryData);
        console.log(`Created category: ${categoryData.name}`);
      } else {
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }

    // Create sample tests
    // Biochemical Testing
    const biochemicalCategory = await Category.findOne({ where: { name: 'Biochemical Testing' } });
    if (biochemicalCategory) {
      const biochemicalTests = [
        {
          name: 'Protein Quantification',
          description: 'Accurate measurement of protein concentration in biological samples using Bradford or BCA methods.',
          price: 95.00,
          turnaroundTime: '2-3 business days',
          methodReference: 'Bradford/BCA Assay',
          active: true,
          displayOrder: 1,
          CategoryId: biochemicalCategory.id
        },
        {
          name: 'Enzyme Activity Assay',
          description: 'Determination of enzyme activity levels in various biological samples.',
          price: 120.00,
          turnaroundTime: '3-4 business days',
          methodReference: 'Spectrophotometric Analysis',
          active: true,
          displayOrder: 2,
          CategoryId: biochemicalCategory.id
        },
        {
          name: 'Lipid Profile Analysis',
          description: 'Comprehensive assessment of lipid content and composition in biological samples.',
          price: 150.00,
          turnaroundTime: '3-5 business days',
          methodReference: 'GC-MS/HPLC',
          active: true,
          displayOrder: 3,
          CategoryId: biochemicalCategory.id
        }
      ];

      for (const testData of biochemicalTests) {
        const existingTest = await Test.findOne({ where: { name: testData.name } });
        if (!existingTest) {
          await Test.create(testData);
          console.log(`Created test: ${testData.name}`);
        } else {
          console.log(`Test already exists: ${testData.name}`);
        }
      }
    }

    // Environmental Analysis
    const environmentalCategory = await Category.findOne({ where: { name: 'Environmental Analysis' } });
    if (environmentalCategory) {
      const environmentalTests = [
        {
          name: 'Water Quality Testing',
          description: 'Comprehensive analysis of water samples for chemical contaminants, heavy metals, and microbial presence.',
          price: 175.00,
          turnaroundTime: '5-7 business days',
          methodReference: 'EPA Methods',
          active: true,
          displayOrder: 1,
          CategoryId: environmentalCategory.id
        },
        {
          name: 'Soil Contamination Analysis',
          description: 'Detection and quantification of pollutants and heavy metals in soil samples.',
          price: 195.00,
          turnaroundTime: '7-10 business days',
          methodReference: 'ICP-MS/AAS',
          active: true,
          displayOrder: 2,
          CategoryId: environmentalCategory.id
        },
        {
          name: 'Air Quality Assessment',
          description: 'Analysis of air samples for particulate matter, VOCs, and other atmospheric pollutants.',
          price: 225.00,
          turnaroundTime: '5-7 business days',
          methodReference: 'GC-MS/HPLC',
          active: true,
          displayOrder: 3,
          CategoryId: environmentalCategory.id
        }
      ];

      for (const testData of environmentalTests) {
        const existingTest = await Test.findOne({ where: { name: testData.name } });
        if (!existingTest) {
          await Test.create(testData);
          console.log(`Created test: ${testData.name}`);
        } else {
          console.log(`Test already exists: ${testData.name}`);
        }
      }
    }

    // Microbiological Testing
    const microbiologicalCategory = await Category.findOne({ where: { name: 'Microbiological Testing' } });
    if (microbiologicalCategory) {
      const microbiologicalTests = [
        {
          name: 'Bacterial Identification',
          description: 'Isolation and identification of bacterial species from various sample types.',
          price: 135.00,
          turnaroundTime: '3-5 business days',
          methodReference: 'Culture & 16S rRNA Sequencing',
          active: true,
          displayOrder: 1,
          CategoryId: microbiologicalCategory.id
        },
        {
          name: 'Fungal Analysis',
          description: 'Identification and characterization of fungal species in environmental and biological samples.',
          price: 145.00,
          turnaroundTime: '4-6 business days',
          methodReference: 'Culture & ITS Sequencing',
          active: true,
          displayOrder: 2,
          CategoryId: microbiologicalCategory.id
        },
        {
          name: 'Antimicrobial Susceptibility Testing',
          description: 'Determination of microbial sensitivity to various antimicrobial agents.',
          price: 165.00,
          turnaroundTime: '5-7 business days',
          methodReference: 'Disk Diffusion/MIC',
          active: true,
          displayOrder: 3,
          CategoryId: microbiologicalCategory.id
        }
      ];

      for (const testData of microbiologicalTests) {
        const existingTest = await Test.findOne({ where: { name: testData.name } });
        if (!existingTest) {
          await Test.create(testData);
          console.log(`Created test: ${testData.name}`);
        } else {
          console.log(`Test already exists: ${testData.name}`);
        }
      }
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the function
seedData();
