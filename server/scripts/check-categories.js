const { Category } = require('../models');
const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

async function checkCategories() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if categories exist
    const existingCategories = await Category.findAll();
    console.log(`Found ${existingCategories.length} existing categories`);

    if (existingCategories.length === 0) {
      console.log('No categories found. Adding sample categories...');
      
      // Sample categories data
      const sampleCategories = [
        {
          name: "Biochemical Testing",
          description: "Comprehensive analysis of biological materials for chemical properties and components.",
          imageUrl: "/images/categories/biochemical-testing.jpg",
          active: true,
          displayOrder: 1
        },
        {
          name: "Environmental Analysis",
          description: "Detailed analysis of environmental samples including water, soil, and air quality testing.",
          imageUrl: "/images/categories/environmental-analysis.jpg",
          active: true,
          displayOrder: 2
        },
        {
          name: "Microbiological Testing",
          description: "Identification and analysis of microorganisms in various samples.",
          imageUrl: "/images/categories/microbiological-testing.jpg",
          active: true,
          displayOrder: 3
        },
        {
          name: "Molecular Diagnostics",
          description: "Advanced DNA and RNA-based testing for research and clinical applications.",
          imageUrl: "/images/categories/molecular-diagnostics.jpg",
          active: true,
          displayOrder: 4
        },
        {
          name: "Material Characterization",
          description: "Analysis of material properties and composition for research and quality control.",
          imageUrl: "/images/categories/material-characterization.jpg",
          active: true,
          displayOrder: 5
        },
        {
          name: "Food & Beverage Testing",
          description: "Comprehensive testing of food and beverage products for safety, quality, and compliance.",
          imageUrl: "/images/categories/food-&-beverage-testing.jpg",
          active: true,
          displayOrder: 6
        },
        {
          name: "Pharmaceutical Analysis",
          description: "Testing and analysis of pharmaceutical products for quality control and regulatory compliance.",
          imageUrl: "/images/categories/pharmaceutical-analysis.jpg",
          active: true,
          displayOrder: 7
        },
        {
          name: "Water Analysis",
          description: "Comprehensive testing of water samples for various parameters including chemical, physical, and biological properties.",
          imageUrl: "/images/categories/water-analysis.jpg",
          active: true,
          displayOrder: 8
        },
        {
          name: "Soil Analysis",
          description: "Testing of soil samples for nutrient content, contamination, and other properties.",
          imageUrl: "/images/categories/soil-analysis.jpg",
          active: true,
          displayOrder: 9
        },
        {
          name: "Chemical Testing",
          description: "Analysis of chemical compounds and properties in various samples.",
          imageUrl: "/images/categories/chemical-testing.jpg",
          active: true,
          displayOrder: 10
        }
      ];

      // Create categories
      for (const categoryData of sampleCategories) {
        const category = await Category.create(categoryData);
        console.log(`Created category: ${category.name}`);
      }

      console.log('Sample categories created successfully!');
    } else {
      console.log('Categories already exist in the database.');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking/adding categories:', error);
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing database connection:', e);
    }
    process.exit(1);
  }
}

// Run the function
checkCategories();
