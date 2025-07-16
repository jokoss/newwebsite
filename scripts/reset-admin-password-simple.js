const { User } = require('../models');
const sequelize = require('../config/database');

// Simple password reset script that doesn't require user input
async function resetAdminPassword() {
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
    
    // Set a simple password for testing
    const newPassword = 'Admin123!';
    
    // Update the password
    adminUser.password = newPassword;
    await adminUser.save();
    
    console.log('\n========== ADMIN PASSWORD RESET ==========');
    console.log('Admin password has been reset successfully.');
    console.log('Please login with:');
    console.log('Username: admin');
    console.log(`Password: ${newPassword}`);
    console.log('==========================================');
    console.log('\nIMPORTANT: This is a temporary password for testing purposes.');
    console.log('Please change it immediately after logging in.');
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the function
resetAdminPassword();
