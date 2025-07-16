const fs = require('fs');
const path = require('path');
const https = require('https');
const { Category } = require('../models');
const sequelize = require('../config/database');

// Helper function to download an image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded image to: ${filepath}`);
        resolve(filepath);
      });
      
      file.on('error', err => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

async function updateImages() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Get all categories
    const categories = await Category.findAll();
    console.log(`Found ${categories.length} categories.`);
    
    // Create images directory if it doesn't exist
    const imagesDir = path.join(__dirname, '../../client/public/images/categories');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log(`Created directory: ${imagesDir}`);
    }
    
    // Image URLs for different categories (replace with your actual URLs)
    const imageUrls = {
      'Test': 'https://images.unsplash.com/photo-1581093196277-9f926cc0a7b5?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Chemical Testing': 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Physical Testing': 'https://images.unsplash.com/photo-1581092921461-39b9effed3c7?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Mechanical Testing': 'https://images.unsplash.com/photo-1581093057219-c6209bb37265?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Agriculture': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Construction / Materials': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Environmental Analysis': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Microbiology': 'https://images.unsplash.com/photo-1583912267550-d5890476bdbe?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Soil Analysis': 'https://images.unsplash.com/photo-1563514227147-6d2e624ba45b?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Plant/Tissue Analysis': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Water Analysis': 'https://images.unsplash.com/photo-1580058572462-99e75fd715e0?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Compost Analysis': 'https://images.unsplash.com/photo-1621798268502-78209018de31?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop',
      'Fertilizer Analysis': 'https://images.unsplash.com/photo-1628367748816-8674ea034bf3?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop'
    };
    
    // Default image URL for categories without a specific image
    const defaultImageUrl = 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop';
    
    // Download and update images for each category
    for (const category of categories) {
      const imageUrl = imageUrls[category.name] || defaultImageUrl;
      const imageFilename = `${category.name.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^\w-]/g, '')}.jpg`;
      const imagePath = path.join(imagesDir, imageFilename);
      
      try {
        // Only download if the image doesn't exist already
        if (!fs.existsSync(imagePath)) {
          await downloadImage(imageUrl, imagePath);
          
          // Update the category in the database with the image URL
          category.imageUrl = `/images/categories/${imageFilename}`;
          await category.save();
          console.log(`Updated image URL for category: ${category.name}`);
        } else {
          console.log(`Image already exists for category: ${category.name}`);
          
          // Update the category in the database with the image URL if not set
          if (!category.imageUrl) {
            category.imageUrl = `/images/categories/${imageFilename}`;
            await category.save();
            console.log(`Updated image URL for category: ${category.name}`);
          }
        }
      } catch (error) {
        console.error(`Error updating image for category ${category.name}:`, error);
      }
    }
    
    console.log('Image update process completed.');
  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
updateImages();
