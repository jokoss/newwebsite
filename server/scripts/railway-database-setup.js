// Force production environment to use PostgreSQL
process.env.NODE_ENV = 'production';
require('dotenv').config();
const { Sequelize } = require('sequelize');
const { sequelize, User, Category, Test } = require('../models');

async function setupRailwayDatabase() {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('🔧 RAILWAY DATABASE SETUP TOOL');
  console.log('============================');
  
  // Check DATABASE_URL
  console.log('\n📊 DATABASE CONNECTION INFO:');
  if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL is set');
    // Mask the password in the URL for security
    const maskedUrl = process.env.DATABASE_URL.replace(
      /(postgresql|postgres):\/\/([^:]+):([^@]+)@/,
      '$1://$2:****@'
    );
    console.log(`   URL: ${maskedUrl}`);
  } else {
    console.log('❌ DATABASE_URL is not set');
    console.log('   This is required for Railway deployment');
    process.exit(1);
  }
  
  // Test database connection
  console.log('\n📊 TESTING DATABASE CONNECTION:');
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    console.log('   Database dialect:', sequelize.options.dialect);
    
    // Sync database models
    console.log('\n📊 SYNCING DATABASE MODELS:');
    try {
      await sequelize.sync();
      console.log('✅ Database models synchronized successfully');
      
      // Check if admin user exists
      const adminExists = await User.findOne({ where: { username: 'admin' } });
      if (adminExists) {
        console.log('✅ Admin user exists');
      } else {
        console.log('❌ Admin user does not exist');
        console.log('   Creating admin user...');
        
        try {
          const bcrypt = require('bcryptjs');
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('Railway2025!', salt);
          
          await User.create({
            username: 'admin',
            email: 'admin@railway.app',
            password: hashedPassword,
            role: 'admin'
          });
          
          console.log('✅ Admin user created successfully');
        } catch (error) {
          console.error('❌ Failed to create admin user:', error.message);
        }
      }
      
      // Check if categories exist
      const categoryCount = await Category.count();
      console.log(`Found ${categoryCount} categories`);
      
      if (categoryCount === 0) {
        console.log('❌ No categories found');
        console.log('   Creating sample categories...');
        
        try {
          const sampleCategories = [
            { name: 'Chemical Analysis', description: 'Comprehensive chemical analysis services', active: true },
            { name: 'Microbiological Testing', description: 'Microbiological testing services', active: true },
            { name: 'Materials Characterization', description: 'Advanced materials characterization techniques', active: true },
            { name: 'Environmental Analysis', description: 'Environmental testing and analysis services', active: true },
            { name: 'Soil Analysis', description: 'Comprehensive soil testing services', active: true }
          ];
          
          const createdCategories = await Category.bulkCreate(sampleCategories);
          console.log(`✅ Created ${createdCategories.length} sample categories`);
          
          // Create sample tests for each category
          for (const category of createdCategories) {
            const sampleTests = [
              { 
                name: `${category.name} Test 1`, 
                description: `Standard ${category.name.toLowerCase()} test service.`,
                price: 199.99,
                categoryId: category.id,
                active: true
              },
              { 
                name: `${category.name} Test 2`, 
                description: `Advanced ${category.name.toLowerCase()} test service.`,
                price: 299.99,
                categoryId: category.id,
                active: true
              }
            ];
            
            const createdTests = await Test.bulkCreate(sampleTests);
            console.log(`✅ Created ${createdTests.length} tests for category: ${category.name}`);
          }
        } catch (error) {
          console.error('❌ Failed to create sample categories:', error.message);
        }
      } else {
        // Ensure all categories are active
        const inactiveCategories = await Category.findAll({ where: { active: false } });
        if (inactiveCategories.length > 0) {
          console.log(`Found ${inactiveCategories.length} inactive categories. Activating...`);
          
          for (const category of inactiveCategories) {
            await category.update({ active: true });
          }
          
          console.log('✅ All categories activated');
        } else {
          console.log('✅ All categories are already active');
        }
        
        // Ensure all tests are active
        const inactiveTests = await Test.findAll({ where: { active: false } });
        if (inactiveTests.length > 0) {
          console.log(`Found ${inactiveTests.length} inactive tests. Activating...`);
          
          for (const test of inactiveTests) {
            await test.update({ active: true });
          }
          
          console.log('✅ All tests activated');
        } else {
          console.log('✅ All tests are already active');
        }
      }
      
      // Final verification
      const finalCategoryCount = await Category.count({ where: { active: true } });
      const finalTestCount = await Test.count({ where: { active: true } });
      
      console.log('\n📊 FINAL STATUS:');
      console.log(`✅ Active Categories: ${finalCategoryCount}`);
      console.log(`✅ Active Tests: ${finalTestCount}`);
      
    } catch (syncError) {
      console.error('❌ Database sync failed:', syncError.message);
      if (syncError.original) {
        console.log('\n🔍 DETAILED ERROR:');
        console.log(`   Code: ${syncError.original.code}`);
        console.log(`   Message: ${syncError.original.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔍 POSSIBLE ISSUES:');
    console.log('1. The DATABASE_URL might be incorrect');
    console.log('2. The PostgreSQL database might not be running');
    console.log('3. Network connectivity issues between Railway services');
    console.log('4. SSL configuration issues');
    
    // Try to get more detailed error information
    if (error.original) {
      console.log('\n🔍 DETAILED ERROR:');
      console.log(`   Code: ${error.original.code}`);
      console.log(`   Message: ${error.original.message}`);
    }
  }
  
  console.log('\n📊 SETUP COMPLETE');
}

// Run the setup
setupRailwayDatabase()
  .then(() => {
    console.log('Database setup completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
