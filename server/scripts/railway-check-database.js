const { Sequelize } = require('sequelize');
const path = require('path');

// Force production environment for Railway
process.env.NODE_ENV = 'production';

console.log('🔍 RAILWAY DATABASE CHECK');
console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);

// Import models
const sequelize = require('../config/database');
const { Category, Test } = require('../models');

async function checkDatabase() {
  try {
    console.log('\n📊 DATABASE CONNECTION TEST');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    console.log('\n📋 CATEGORIES IN DATABASE:');
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    console.log(`Total categories found: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`- ID: ${cat.id}, Name: "${cat.name}", Active: ${cat.is_active}, Parent: ${cat.parent_id}`);
    });

    console.log('\n🧪 TESTS IN DATABASE:');
    const tests = await Test.findAll({
      include: [{ model: Category, as: 'category' }],
      order: [['name', 'ASC']]
    });
    
    console.log(`Total tests found: ${tests.length}`);
    tests.forEach(test => {
      console.log(`- ID: ${test.id}, Name: "${test.name}", Price: $${test.price}, Category: "${test.category?.name || 'None'}"`);
    });

    console.log('\n🔍 ACTIVE PARENT CATEGORIES (what should show on Services page):');
    const activeParentCategories = await Category.findAll({
      where: {
        is_active: true,
        parent_id: null
      },
      order: [['name', 'ASC']]
    });
    
    console.log(`Active parent categories: ${activeParentCategories.length}`);
    activeParentCategories.forEach(cat => {
      console.log(`- "${cat.name}" (ID: ${cat.id})`);
    });

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();
