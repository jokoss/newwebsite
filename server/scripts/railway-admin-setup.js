const { User, sequelize } = require('../models');

// Railway-specific admin setup script
async function setupRailwayAdmin() {
  try {
    console.log('🚀 Railway Admin Setup - Starting...');
    console.log('Connecting to Railway database...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync the User model to ensure table exists
    await User.sync();
    console.log('✅ User table synchronized.');
    
    // Admin credentials for Railway deployment
    const adminCredentials = {
      username: 'admin',
      email: 'admin@railway.app',
      password: 'Railway2025!',
      role: 'superadmin',
      active: true
    };
    
    // Check if admin user already exists
    let adminUser = await User.findOne({ where: { username: adminCredentials.username } });
    
    if (adminUser) {
      console.log('📝 Admin user found - updating credentials...');
      
      // Update existing admin user
      adminUser.email = adminCredentials.email;
      adminUser.password = adminCredentials.password;
      adminUser.role = adminCredentials.role;
      adminUser.active = adminCredentials.active;
      
      await adminUser.save();
      console.log('✅ Admin user updated successfully.');
    } else {
      console.log('👤 Creating new admin user...');
      
      // Create new admin user
      adminUser = await User.create(adminCredentials);
      console.log('✅ Admin user created successfully.');
    }
    
    // Verify the admin user can be found and password works
    const verifyUser = await User.findOne({ where: { username: adminCredentials.username } });
    const passwordMatch = await verifyUser.comparePassword(adminCredentials.password);
    
    if (passwordMatch) {
      console.log('✅ Password verification successful.');
    } else {
      throw new Error('Password verification failed!');
    }
    
    console.log('\n🎉 ========== RAILWAY ADMIN SETUP COMPLETE ==========');
    console.log('Admin user is ready for Railway deployment!');
    console.log('');
    console.log('🔐 LOGIN CREDENTIALS:');
    console.log(`   Username: ${adminCredentials.username}`);
    console.log(`   Password: ${adminCredentials.password}`);
    console.log('');
    console.log('🌐 LOGIN URL:');
    console.log('   https://vigilant-compassion-production.up.railway.app/login');
    console.log('');
    console.log('👤 USER DETAILS:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Active: ${adminUser.active}`);
    console.log('');
    console.log('⚠️  SECURITY NOTE:');
    console.log('   Please change the password after first login for security.');
    console.log('==================================================');
    
    return { success: true, adminUser };
    
  } catch (error) {
    console.error('❌ Error setting up Railway admin:', error);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('💡 Database connection failed. Check your Railway database configuration.');
    } else if (error.name === 'SequelizeValidationError') {
      console.error('💡 Validation error:', error.errors.map(e => e.message).join(', '));
    } else {
      console.error('💡 Full error details:', error.message);
    }
    
    throw error; // Re-throw for caller to handle
  }
}

// Additional function to test login credentials
async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login...');
    
    await sequelize.authenticate();
    
    const testCredentials = {
      username: 'admin',
      password: 'Railway2025!'
    };
    
    const user = await User.findOne({ where: { username: testCredentials.username } });
    
    if (!user) {
      console.log('❌ Admin user not found!');
      return false;
    }
    
    const isMatch = await user.comparePassword(testCredentials.password);
    
    if (isMatch) {
      console.log('✅ Login test successful!');
      console.log(`   User: ${user.username} (${user.role})`);
      console.log(`   Active: ${user.active}`);
      return true;
    } else {
      console.log('❌ Password does not match!');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    return false;
  } finally {
    await sequelize.close();
  }
}

// Run the setup
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    testAdminLogin();
  } else {
    setupRailwayAdmin();
  }
}

module.exports = { setupRailwayAdmin, testAdminLogin };
