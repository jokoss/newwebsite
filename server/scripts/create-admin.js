const { User } = require('../models');
const sequelize = require('../config/database');

async function createAdminUser() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@analyticallabs.com',
      password: 'password123',
      role: 'admin',
      active: true
    });

    console.log('Admin user created successfully:');
    console.log({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the function
createAdminUser();
