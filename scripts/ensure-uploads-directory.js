/**
 * Script to ensure the uploads directory exists and has proper permissions
 * Run this script with: node scripts/ensure-uploads-directory.js
 */

const fs = require('fs');
const path = require('path');

// Define the uploads directory path
const uploadsDir = path.join(__dirname, '../uploads');

console.log('Checking uploads directory...');

// Check if the directory exists
if (!fs.existsSync(uploadsDir)) {
  console.log('Uploads directory does not exist. Creating it...');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created successfully.');
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    process.exit(1);
  }
} else {
  console.log('Uploads directory already exists.');
}

// Check if the directory is writable
try {
  // Try to write a test file
  const testFile = path.join(uploadsDir, '.test-write-permission');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('Uploads directory is writable.');
} catch (error) {
  console.error('Error: Uploads directory is not writable:', error);
  console.log('Please ensure the uploads directory has write permissions.');
  process.exit(1);
}

// Production warning
if (process.env.NODE_ENV === 'production') {
  console.warn('WARNING: Running in production environment.');
  console.warn('Render.com uses an ephemeral filesystem. Files uploaded to this directory will not persist between deployments.');
  console.warn('Consider implementing a cloud storage solution (AWS S3, Cloudinary, etc.) for production use.');
}

console.log('Uploads directory check completed successfully.');
