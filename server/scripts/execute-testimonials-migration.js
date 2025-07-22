const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/database');

async function executeMigration() {
  try {
    console.log('Starting testimonials migration...');
    
    const migrationPath = path.join(__dirname, '../migrations/20250720_create_testimonials_table.js');
    const migration = require(migrationPath);
    
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('Testimonials migration completed successfully!');
    
    // Seed initial testimonials
    const testimonials = [
      {
        name: 'Dr. Sarah Johnson',
        role: 'Research Director',
        company: 'BioTech Solutions',
        quote: 'Outstanding precision and reliability in every test result.',
        avatar: null,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Michael Chen',
        role: 'Quality Manager',
        company: 'PharmaCorp',
        quote: 'Fast turnaround times without compromising on quality.',
        avatar: null,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dr. Emily Rodriguez',
        role: 'Lab Director',
        company: 'Environmental Labs',
        quote: 'Their expertise has been invaluable to our research.',
        avatar: null,
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await sequelize.getQueryInterface().bulkInsert('Testimonials', testimonials);
    console.log('Initial testimonials seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error executing testimonials migration:', error);
    process.exit(1);
  }
}

executeMigration();
