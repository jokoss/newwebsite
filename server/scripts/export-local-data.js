const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('📤 EXPORTING LOCAL DATABASE TO JSON');
console.log('===================================');

// Local SQLite database path
const localDbPath = path.join(__dirname, '..', 'database.sqlite');
const exportPath = path.join(__dirname, 'local-data-export.json');

console.log('Local database path:', localDbPath);
console.log('Export path:', exportPath);

// Function to read data from local SQLite
function readLocalData(query) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(localDbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });

    db.close();
  });
}

async function exportData() {
  try {
    console.log('\n📊 READING LOCAL DATABASE DATA');

    const exportData = {};

    // Read categories from local database
    try {
      exportData.categories = await readLocalData('SELECT * FROM Categories ORDER BY id');
      console.log(`✅ Exported ${exportData.categories.length} categories`);
    } catch (err) {
      console.log('ℹ️ No categories table found');
      exportData.categories = [];
    }

    // Read tests from local database
    try {
      exportData.tests = await readLocalData('SELECT * FROM Tests ORDER BY id');
      console.log(`✅ Exported ${exportData.tests.length} tests`);
    } catch (err) {
      console.log('ℹ️ No tests table found');
      exportData.tests = [];
    }

    // Read blog posts from local database
    try {
      exportData.blogPosts = await readLocalData('SELECT * FROM BlogPosts ORDER BY id');
      console.log(`✅ Exported ${exportData.blogPosts.length} blog posts`);
    } catch (err) {
      console.log('ℹ️ No blog posts table found');
      exportData.blogPosts = [];
    }

    // Read partners from local database
    try {
      exportData.partners = await readLocalData('SELECT * FROM Partners ORDER BY id');
      console.log(`✅ Exported ${exportData.partners.length} partners`);
    } catch (err) {
      console.log('ℹ️ No partners table found');
      exportData.partners = [];
    }

    // Read images from local database
    try {
      exportData.images = await readLocalData('SELECT * FROM Images ORDER BY id');
      console.log(`✅ Exported ${exportData.images.length} images`);
    } catch (err) {
      console.log('ℹ️ No images table found');
      exportData.images = [];
    }

    // Read certifications from local database
    try {
      exportData.certifications = await readLocalData('SELECT * FROM Certifications ORDER BY id');
      console.log(`✅ Exported ${exportData.certifications.length} certifications`);
    } catch (err) {
      console.log('ℹ️ No certifications table found');
      exportData.certifications = [];
    }

    // Write to JSON file
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
    
    console.log('\n🎉 EXPORT COMPLETED SUCCESSFULLY!');
    console.log('=================================');
    console.log(`✅ Categories: ${exportData.categories.length}`);
    console.log(`✅ Tests: ${exportData.tests.length}`);
    console.log(`✅ Blog Posts: ${exportData.blogPosts.length}`);
    console.log(`✅ Partners: ${exportData.partners.length}`);
    console.log(`✅ Images: ${exportData.images.length}`);
    console.log(`✅ Certifications: ${exportData.certifications.length}`);
    console.log(`\n📁 Data exported to: ${exportPath}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  }
}

// Run the export
exportData().catch(console.error);
