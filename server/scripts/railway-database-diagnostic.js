// Force production environment to use PostgreSQL
process.env.NODE_ENV = 'production';
require('dotenv').config();
const { Sequelize } = require('sequelize');
const { sequelize, User, Category, Test } = require('../models');

async function diagnoseDatabase() {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('🔍 RAILWAY DATABASE DIAGNOSTIC TOOL');
  console.log('====================================');
  
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
  }
  
  // Test database connection
  console.log('\n📊 TESTING DATABASE CONNECTION:');
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    console.log('   Database dialect:', sequelize.options.dialect);
    
    // Get database info
    try {
      const [results] = await sequelize.query('SELECT version();');
      console.log(`   Database version: ${results[0].version}`);
    } catch (versionError) {
      console.log(`   Unable to get database version: ${versionError.message}`);
    }
    
    // Check if tables exist
    console.log('\n📊 CHECKING DATABASE TABLES:');
    try {
      // Check Users table
      const userCount = await User.count();
      console.log(`✅ Users table exists (${userCount} records)`);
      
      // Check Categories table
      const categoryCount = await Category.count();
      console.log(`✅ Categories table exists (${categoryCount} records)`);
      
      // Check Tests table
      const testCount = await Test.count();
      console.log(`✅ Tests table exists (${testCount} records)`);
      
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
          const hashedPassword = await bcrypt.hash('admin123', salt);
          
          await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
          });
          
          console.log('✅ Admin user created successfully');
        } catch (error) {
          console.error('❌ Failed to create admin user:', error.message);
        }
      }
      
      // Check if categories exist
      if (categoryCount === 0) {
        console.log('❌ No categories found');
        console.log('   Creating sample categories...');
        
        try {
          const sampleCategories = [
            { name: 'Chemical Analysis', description: 'Comprehensive chemical analysis services', active: true },
            { name: 'Microbiological Testing', description: 'Microbiological testing services', active: true }
          ];
          
          await Category.bulkCreate(sampleCategories);
          console.log('✅ Sample categories created successfully');
        } catch (error) {
          console.error('❌ Failed to create sample categories:', error.message);
        }
      }
      
      // Check if tests exist
      if (testCount === 0) {
        console.log('❌ No tests found');
        console.log('   Creating sample tests...');
        
        try {
          // Get category IDs
          const categories = await Category.findAll();
          
          if (categories.length > 0) {
            const sampleTests = [
              { 
                name: 'HPLC Analysis', 
                description: 'High-performance liquid chromatography analysis', 
                price: 199.99,
                categoryId: categories[0].id,
                active: true
              },
              { 
                name: 'GC-MS Testing', 
                description: 'Gas chromatography–mass spectrometry testing', 
                price: 249.99,
                categoryId: categories[0].id,
                active: true
              },
              { 
                name: 'Microbial Identification', 
                description: 'Identification of microorganisms', 
                price: 179.99,
                categoryId: categories[1].id,
                active: true
              }
            ];
            
            await Test.bulkCreate(sampleTests);
            console.log('✅ Sample tests created successfully');
          } else {
            console.log('❌ Cannot create sample tests: No categories available');
          }
        } catch (error) {
          console.error('❌ Failed to create sample tests:', error.message);
        }
      }
      
    } catch (error) {
      console.error('❌ Error checking tables:', error.message);
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
  
  console.log('\n📊 DIAGNOSTIC COMPLETE');
}

// Run the diagnostic
diagnoseDatabase()
  .then(() => {
    console.log('Diagnostic completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Diagnostic failed:', error);
    process.exit(1);
  });
