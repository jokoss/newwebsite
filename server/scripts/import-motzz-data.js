const { Category, Test } = require('../models');
const sequelize = require('../config/database');

async function importMotzzData() {
  const transaction = await sequelize.transaction();
  
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Create service categories based on Motzz Laboratory website
    const categories = [
      {
        name: 'Agriculture',
        description: 'Testing services for soil, plant, water, compost/mulch and fertilizer. We provide services to farms, golf courses, and nurseries in Arizona and surrounding regions.',
        imageUrl: '',
        active: true,
        displayOrder: 1
      },
      {
        name: 'Construction / Materials',
        description: 'With our engineering background, we perform soil aggregate testing using the ADOT, CDOT, AASHTO and ASTM specified methods.',
        imageUrl: '',
        active: true,
        displayOrder: 2
      },
      {
        name: 'Environmental Analysis',
        description: 'Detailed analysis of environmental samples including water, soil, and air quality testing.',
        imageUrl: '',
        active: true,
        displayOrder: 3
      },
      {
        name: 'Microbiology',
        description: 'Identification and analysis of microorganisms in various samples.',
        imageUrl: '',
        active: true,
        displayOrder: 4
      }
    ];

    for (const categoryData of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData,
        transaction
      });
      
      if (created) {
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    // Create agriculture subcategories
    const agricultureCategory = await Category.findOne({ where: { name: 'Agriculture' } });
    if (agricultureCategory) {
      const agricultureSubcategories = [
        {
          name: 'Soil Analysis',
          description: 'Comprehensive soil testing services for agricultural and environmental applications.',
          imageUrl: '',
          active: true,
          displayOrder: 1,
          parentId: agricultureCategory.id
        },
        {
          name: 'Plant/Tissue Analysis',
          description: 'Plant/Tissue, Petiole Analysis for crop health and nutritional assessment.',
          imageUrl: '',
          active: true,
          displayOrder: 2,
          parentId: agricultureCategory.id
        },
        {
          name: 'Water Analysis',
          description: 'Water quality testing for irrigation and agricultural use.',
          imageUrl: '',
          active: true,
          displayOrder: 3,
          parentId: agricultureCategory.id
        },
        {
          name: 'Compost Analysis',
          description: 'Testing services for compost and organic soil amendments.',
          imageUrl: '',
          active: true,
          displayOrder: 4,
          parentId: agricultureCategory.id
        },
        {
          name: 'Fertilizer Analysis',
          description: 'Analysis of fertilizer composition and quality.',
          imageUrl: '',
          active: true,
          displayOrder: 5,
          parentId: agricultureCategory.id
        }
      ];

      for (const subcategoryData of agricultureSubcategories) {
        const [subcategory, created] = await Category.findOrCreate({
          where: { name: subcategoryData.name, parentId: agricultureCategory.id },
          defaults: subcategoryData,
          transaction
        });
        
        if (created) {
          console.log(`Created subcategory: ${subcategory.name}`);
        } else {
          console.log(`Subcategory already exists: ${subcategory.name}`);
        }
      }
    }

    // Create soil tests based on Motzz Laboratory offerings
    const soilCategory = await Category.findOne({ where: { name: 'Soil Analysis' } });
    if (soilCategory) {
      const soilTests = [
        {
          name: 'Complete Soil Analysis',
          description: 'Comprehensive soil analysis including pH, Electrical Conductivity (EC), Calcium (Ca), Magnesium (Mg), Sodium (Na), Potassium(K), Zinc (Zn), Iron (Fe), Manganese (Mn), Copper (Cu), Nickel (Ni), Nitrate-N (NO3-N), Phosphate-P (PO4-P), Sulfate-S (SO4-S), Boron (B), Free Lime, ESP (Calc), CEC (Calc)',
          price: 175.00,
          turnaroundTime: '3-5 business days',
          methodReference: 'Standard soil testing methods',
          active: true,
          displayOrder: 1,
          categoryId: soilCategory.id
        },
        {
          name: 'Organic Matter - LOI',
          description: 'Organic Matter content analysis using Loss on Ignition method',
          price: 45.00,
          turnaroundTime: '2-3 business days',
          methodReference: 'LOI Method',
          active: true,
          displayOrder: 2,
          categoryId: soilCategory.id
        },
        {
          name: 'Soil pH and EC',
          description: 'Basic soil pH and Electrical Conductivity test',
          price: 35.00,
          turnaroundTime: '1-2 business days',
          methodReference: 'Standard Methods',
          active: true,
          displayOrder: 3,
          categoryId: soilCategory.id
        }
      ];

      for (const testData of soilTests) {
        const [test, created] = await Test.findOrCreate({
          where: { name: testData.name, categoryId: soilCategory.id },
          defaults: testData,
          transaction
        });
        
        if (created) {
          console.log(`Created test: ${test.name}`);
        } else {
          console.log(`Test already exists: ${test.name}`);
        }
      }
    }

    // Create construction/materials tests
    const constructionCategory = await Category.findOne({ where: { name: 'Construction / Materials' } });
    if (constructionCategory) {
      const constructionTests = [
        {
          name: 'Soil Aggregate Testing',
          description: 'Soil aggregate testing using ADOT, CDOT, AASHTO and ASTM specified methods',
          price: 195.00,
          turnaroundTime: '5-7 business days',
          methodReference: 'ASTM/AASHTO Standards',
          active: true,
          displayOrder: 1,
          categoryId: constructionCategory.id
        },
        {
          name: 'Construction Materials Analysis',
          description: 'Testing of construction materials for quality control and compliance',
          price: 225.00,
          turnaroundTime: '5-7 business days',
          methodReference: 'Industry Standards',
          active: true,
          displayOrder: 2,
          categoryId: constructionCategory.id
        }
      ];

      for (const testData of constructionTests) {
        const [test, created] = await Test.findOrCreate({
          where: { name: testData.name, categoryId: constructionCategory.id },
          defaults: testData,
          transaction
        });
        
        if (created) {
          console.log(`Created test: ${test.name}`);
        } else {
          console.log(`Test already exists: ${test.name}`);
        }
      }
    }

    await transaction.commit();
    console.log('Motzz Laboratory data import completed successfully.');
  } catch (error) {
    await transaction.rollback();
    console.error('Error importing Motzz data:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the function
importMotzzData();
