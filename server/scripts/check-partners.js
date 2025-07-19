const models = require('../models');
const Partner = models.Partner;
const sequelize = models.sequelize;

async function checkPartners() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if the partners table exists
    try {
      await Partner.findAll();
      console.log('Partners table exists.');
    } catch (error) {
      console.error('Error accessing partners table:', error.message);
      return;
    }

    // Get all partners
    const partners = await Partner.findAll();
    
    console.log(`Found ${partners.length} total partners`);
    
    // Count active partners
    const activePartners = partners.filter(partner => partner.isActive);
    console.log(`Found ${activePartners.length} active partners`);
    
    // List all partners
    console.log('\nAll Partners:');
    partners.forEach(partner => {
      console.log(`ID: ${partner.id}, Name: ${partner.name}, Active: ${partner.isActive}, Logo: ${partner.logo || 'None'}`);
    });
    
    // If there are no partners, offer to create a sample partner
    if (partners.length === 0) {
      console.log('\nWould you like to create a sample partner? (y/n)');
      process.stdin.once('data', async (data) => {
        const answer = data.toString().trim().toLowerCase();
        if (answer === 'y' || answer === 'yes') {
          // Create a sample partner
          const samplePartner = await Partner.create({
            name: 'Sample Partner',
            description: 'This is a sample partner for testing purposes.',
            website: 'https://example.com',
            isActive: true,
            displayOrder: 1
          });
          console.log('Sample partner created:', samplePartner.toJSON());
        }
        await sequelize.close();
        process.exit(0);
      });
    } else {
      await sequelize.close();
    }
  } catch (error) {
    console.error('Error checking partners:', error);
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing database connection:', e);
    }
  }
}

// Run the function
checkPartners();
