require('dotenv').config();
const { Certification, sequelize } = require('../models');

const sampleCertifications = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management Systems certification demonstrating our commitment to consistent quality and customer satisfaction.',
    externalUrl: 'https://www.iso.org/standard/62085.html',
    sortOrder: 1,
    isActive: true,
    isDisplayed: true
  },
  {
    name: 'CLIA Certified',
    description: 'Clinical Laboratory Improvement Amendments certification for accurate and reliable clinical testing.',
    externalUrl: 'https://www.cms.gov/Regulations-and-Guidance/Legislation/CLIA',
    sortOrder: 2,
    isActive: true,
    isDisplayed: true
  },
  {
    name: 'EPA Certified',
    description: 'Environmental Protection Agency certification for environmental testing and analysis.',
    externalUrl: 'https://www.epa.gov/',
    sortOrder: 3,
    isActive: true,
    isDisplayed: true
  },
  {
    name: 'FDA Registered',
    description: 'Food and Drug Administration registration for food safety and pharmaceutical testing.',
    externalUrl: 'https://www.fda.gov/',
    sortOrder: 4,
    isActive: true,
    isDisplayed: true
  },
  {
    name: 'ACLASS A2LA',
    description: 'American Association for Laboratory Accreditation certification for testing competence.',
    externalUrl: 'https://a2la.org/',
    sortOrder: 5,
    isActive: true,
    isDisplayed: true
  }
];

async function seedCertifications() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Check if certifications already exist
    const existingCertifications = await Certification.findAll();
    if (existingCertifications.length > 0) {
      console.log('Certifications already exist. Skipping seed process.');
      return;
    }

    // Create certifications
    console.log('Creating sample certifications...');
    
    for (const certData of sampleCertifications) {
      const certification = await Certification.create(certData);
      console.log(`✓ Created certification: ${certification.name}`);
    }

    console.log('\n🎉 Successfully seeded certifications!');
    console.log(`Total certifications created: ${sampleCertifications.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding certifications:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the seed function
if (require.main === module) {
  seedCertifications();
}

module.exports = seedCertifications;
