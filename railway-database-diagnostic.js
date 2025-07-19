#!/usr/bin/env node

/**
 * Railway Database Diagnostic Script
 * 
 * This script helps diagnose Railway DATABASE_URL issues and provides
 * detailed information about the current database configuration.
 */

console.log('🔍 RAILWAY DATABASE DIAGNOSTIC TOOL');
console.log('=====================================\n');

// Environment Information
console.log('📊 ENVIRONMENT INFORMATION:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   PORT: ${process.env.PORT || 'not set'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌'}`);

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL to show connection details (without password)
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`   Database Host: ${url.hostname}`);
    console.log(`   Database Port: ${url.port}`);
    console.log(`   Database Name: ${url.pathname.substring(1)}`);
    console.log(`   Database User: ${url.username}`);
    console.log(`   Database Type: ${url.protocol.replace(':', '')}`);
  } catch (error) {
    console.log(`   DATABASE_URL Format Error: ${error.message}`);
  }
}

console.log('\n🔧 RAILWAY SPECIFIC VARIABLES:');
console.log(`   RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'not set'}`);
console.log(`   RAILWAY_PROJECT_ID: ${process.env.RAILWAY_PROJECT_ID || 'not set'}`);
console.log(`   RAILWAY_SERVICE_ID: ${process.env.RAILWAY_SERVICE_ID || 'not set'}`);

console.log('\n📋 ALL ENVIRONMENT VARIABLES:');
const envVars = Object.keys(process.env).sort();
envVars.forEach(key => {
  if (key.includes('DATABASE') || key.includes('RAILWAY') || key.includes('POSTGRES')) {
    const value = key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') 
      ? '[HIDDEN]' 
      : process.env[key];
    console.log(`   ${key}: ${value}`);
  }
});

console.log('\n🧪 DATABASE CONNECTION TEST:');

// Test database connection
async function testDatabaseConnection() {
  try {
    // Import database config
    const sequelize = require('./server/config/database');
    
    console.log('   Attempting database connection...');
    await sequelize.authenticate();
    console.log('   ✅ Database connection successful!');
    
    // Get database info
    const dialect = sequelize.getDialect();
    console.log(`   Database dialect: ${dialect}`);
    
    if (dialect === 'postgres') {
      console.log('   ✅ Using PostgreSQL (correct for Railway)');
    } else if (dialect === 'sqlite') {
      console.log('   ⚠️  Using SQLite (fallback - DATABASE_URL not working)');
    }
    
    // Test admin user existence
    console.log('\n👤 ADMIN USER CHECK:');
    try {
      const { User } = require('./server/models');
      const adminUser = await User.findOne({ where: { username: 'admin' } });
      
      if (adminUser) {
        console.log('   ✅ Admin user exists');
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Role: ${adminUser.role}`);
        console.log(`   Active: ${adminUser.active}`);
      } else {
        console.log('   ❌ Admin user not found');
        console.log('   This explains why login fails!');
      }
    } catch (error) {
      console.log(`   ❌ Error checking admin user: ${error.message}`);
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('   💡 This suggests DATABASE_URL is set but points to unreachable database');
    } else if (error.message.includes('authentication failed')) {
      console.log('   💡 This suggests DATABASE_URL has incorrect credentials');
    }
  }
}

console.log('\n🎯 DIAGNOSIS SUMMARY:');

if (!process.env.DATABASE_URL) {
  console.log('❌ CRITICAL ISSUE: DATABASE_URL not set');
  console.log('   → Railway PostgreSQL addon not connected');
  console.log('   → Server will use SQLite fallback');
  console.log('   → Admin user won\'t be created');
  console.log('   → Login will fail');
  console.log('\n🔧 SOLUTION:');
  console.log('   1. Go to Railway Dashboard');
  console.log('   2. Add PostgreSQL service to your project');
  console.log('   3. Ensure DATABASE_URL appears in your service variables');
  console.log('   4. Redeploy your service');
} else {
  console.log('✅ DATABASE_URL is set');
  console.log('   Testing connection...');
  testDatabaseConnection();
}

console.log('\n📚 HELPFUL LINKS:');
console.log('   Railway Dashboard: https://railway.app/dashboard');
console.log('   Railway Docs - PostgreSQL: https://docs.railway.app/databases/postgresql');
console.log('   Your Service URL: https://vigilant-compassion-production.up.railway.app/');

console.log('\n=====================================');
console.log('🔍 DIAGNOSTIC COMPLETE');
