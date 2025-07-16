const { User } = require('../models');
const sequelize = require('../config/database');

async function checkAdminCredentials() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Find admin user
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminUser) {
      console.error('Admin user not found!');
      return;
    }
    
    console.log('\n========== ADMIN USER CHECK ==========');
    console.log('Admin user exists in the database.');
    console.log('Username: admin');
    console.log('User ID:', adminUser.id);
    console.log('Is Active:', adminUser.active);
    console.log('Role:', adminUser.role);
    console.log('Created At:', adminUser.createdAt);
    console.log('Updated At:', adminUser.updatedAt);
    console.log('========================================');
    
  } catch (error) {
    console.error('Error checking admin credentials:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the function
checkAdminCredentials();
