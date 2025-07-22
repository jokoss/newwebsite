/**
 * Script to execute testimonials seeding
 * 
 * This script imports and runs the testimonials seeding function
 * to populate the database with sample testimonial data.
 * 
 * Usage: node server/scripts/execute-seed-testimonials.js
 */

// Import the seed function
const seedTestimonials = require('./seed-testimonials');

// Execute the seed function
console.log('Starting testimonials seeding process...');

seedTestimonials()
  .then(() => {
    console.log('Testimonials seeding process completed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Testimonials seeding process failed:', error);
    process.exit(1);
  });
