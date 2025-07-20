/**
 * Railway Database Setup and Verification Script
 * 
 * This script checks if DATABASE_URL is properly set and helps with database setup.
 * It will:
 * 1. Verify DATABASE_URL environment variable
 * 2. Test connection to the database
 * 3. Provide instructions for setting up the database if needed
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const chalk = require('chalk') || { green: (s) => `\x1b[32m${s}\x1b[0m`, red: (s) => `\x1b[31m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`, blue: (s) => `\x1b[34m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m` };

console.log('\n🔍 RAILWAY DATABASE SETUP AND VERIFICATION\n' + '='.repeat(45));

// Check if DATABASE_URL is set
console.log('\n📊 CHECKING DATABASE_URL:');
if (!process.env.DATABASE_URL) {
  console.log(chalk.red('❌ DATABASE_URL is not set!'));
  console.log(chalk.yellow('\nTo fix this issue:'));
  console.log('1. Go to Railway Dashboard: https://railway.app/dashboard');
  console.log('2. Select your project: "vigilant-compassion-production"');
  console.log('3. Click "New Service" or "+"');
  console.log('4. Select "Database" → "PostgreSQL"');
  console.log('5. After the database is created, go to your main service');
  console.log('6. Click on "Variables" tab');
  console.log('7. Verify DATABASE_URL is set (it should be automatically linked)');
  console.log('8. If not set, manually add it from the PostgreSQL service "Connect" tab');
  console.log('\nAfter setting DATABASE_URL, redeploy your application.');
  process.exit(1);
}

console.log(chalk.green('✅ DATABASE_URL is set!'));

// Test database connection
console.log('\n📊 TESTING DATABASE CONNECTION:');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(chalk.green('✅ Database connection successful!'));
    
    // Check if tables exist
    console.log('\n📊 CHECKING DATABASE TABLES:');
    try {
      const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      
      if (results.length === 0) {
        console.log(chalk.yellow('⚠️ No tables found in the database.'));
        console.log(chalk.yellow('\nTo seed the database with initial data:'));
        console.log('1. Run: npm run migrate-motzz');
        console.log('   or: node server/scripts/migrate-motzz-data.js');
        console.log('2. This will create all necessary tables and seed them with data');
      } else {
        console.log(chalk.green(`✅ Found ${results.length} tables in the database:`));
        results.forEach(row => {
          console.log(`   - ${row.table_name}`);
        });
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error checking tables: ${error.message}`));
    }
    
    console.log('\n📊 NEXT STEPS:');
    console.log('1. Redeploy your application with the updated configuration');
    console.log('2. The application should now connect to the PostgreSQL database');
    console.log('3. If tables are missing, run the seeding script mentioned above');
    console.log('4. Visit your application to verify data is loading correctly');
    
  } catch (error) {
    console.log(chalk.red(`❌ Database connection failed: ${error.message}`));
    console.log(chalk.yellow('\nPossible issues:'));
    console.log('1. The DATABASE_URL might be incorrect');
    console.log('2. The PostgreSQL database might not be running');
    console.log('3. Network connectivity issues between Railway services');
    console.log('\nPlease check your Railway dashboard and verify the PostgreSQL service is running.');
  } finally {
    await sequelize.close();
  }
}

testConnection();
