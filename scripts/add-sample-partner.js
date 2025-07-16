const { Partner } = require('../models');
const sequelize = require('../config/database');

async function addSamplePartner() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sample partners data
    const samplePartners = [
      {
        name: "Pharmaceutical Innovations Inc.",
        description: "The analytical results provided by the laboratory were crucial for our product development process. Their precision and quick turnaround time exceeded our expectations.",
        website: "https://example.com/pharma",
        displayOrder: 1,
        isActive: true
      },
      {
        name: "EcoSolutions Group",
        description: "We've been working with this laboratory for over 5 years. Their consistent quality and reliability have made them an invaluable partner for our environmental compliance testing.",
        website: "https://example.com/eco",
        displayOrder: 2,
        isActive: true
      },
      {
        name: "Advanced Materials Corp",
        description: "The team's expertise in analytical chemistry helped us identify critical impurities that were affecting our manufacturing process. Their insights saved us both time and resources.",
        website: "https://example.com/materials",
        displayOrder: 3,
        isActive: true
      }
    ];

    // Check if partners already exist
    const existingPartners = await Partner.findAll();
    console.log(`Found ${existingPartners.length} existing partners`);

    if (existingPartners.length > 0) {
      console.log('Partners already exist in the database. Do you want to add more sample partners? (y/n)');
      process.stdin.once('data', async (data) => {
        const answer = data.toString().trim().toLowerCase();
        if (answer === 'y' || answer === 'yes') {
          await createPartners();
        } else {
          console.log('Operation cancelled.');
          await sequelize.close();
          process.exit(0);
        }
      });
    } else {
      await createPartners();
    }

    async function createPartners() {
      console.log('Creating sample partners...');
      for (const partnerData of samplePartners) {
        const partner = await Partner.create(partnerData);
        console.log(`Created partner: ${partner.name}`);
      }
      console.log('Sample partners created successfully!');
      await sequelize.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error adding sample partners:', error);
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing database connection:', e);
    }
    process.exit(1);
  }
}

// Run the function
addSamplePartner();
