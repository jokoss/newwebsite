const { User } = require('../models');
const sequelize = require('../config/database');

async function checkAdminPassword() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if admin user exists
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminUser) {
      console.log('Admin user does not exist!');
      return;
    }

    console.log('Admin user found:');
    console.log({
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      active: adminUser.active
    });

    // Reset admin password to a known value
    adminUser.password = 'admin123';
    await adminUser.save();
    
    console.log('\n========== ADMIN PASSWORD RESET ==========');
    console.log('Admin password has been reset successfully.');
    console.log('Please login with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('==========================================');

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the function
checkAdminPassword();
