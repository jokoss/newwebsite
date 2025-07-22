const { Sequelize, DataTypes } = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🚀 COMPLETE LOCAL TO RAILWAY MIGRATION');
console.log('=====================================');

// Local SQLite database path
const localDbPath = path.join(__dirname, '..', 'database.sqlite');
console.log('Local database path:', localDbPath);

// Railway PostgreSQL connection
process.env.NODE_ENV = 'production';
const railwaySequelize = require('../config/database');
const { Category, Test, BlogPost, Partner, Image, Certification } = require('../models');

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

async function migrateData() {
  try {
    console.log('\n📊 CONNECTING TO RAILWAY DATABASE');
    await railwaySequelize.authenticate();
    console.log('✅ Railway database connection successful');

    console.log('\n🗑️ CLEARING EXISTING DATA (preserving users)');
    
    // Clear all data except users
    await Test.destroy({ where: {} });
    console.log('✅ Cleared tests');
    
    await Category.destroy({ where: {} });
    console.log('✅ Cleared categories');
    
    await BlogPost.destroy({ where: {} });
    console.log('✅ Cleared blog posts');
    
    await Partner.destroy({ where: {} });
    console.log('✅ Cleared partners');
    
    await Image.destroy({ where: {} });
    console.log('✅ Cleared images');
    
    await Certification.destroy({ where: {} });
    console.log('✅ Cleared certifications');

    console.log('\n📥 READING LOCAL DATABASE DATA');

    // Read categories from local database
    const localCategories = await readLocalData('SELECT * FROM Categories ORDER BY id');
    console.log(`Found ${localCategories.length} categories in local database`);

    // Read tests from local database
    const localTests = await readLocalData('SELECT * FROM Tests ORDER BY id');
    console.log(`Found ${localTests.length} tests in local database`);

    // Read blog posts from local database
    let localBlogPosts = [];
    try {
      localBlogPosts = await readLocalData('SELECT * FROM BlogPosts ORDER BY id');
      console.log(`Found ${localBlogPosts.length} blog posts in local database`);
    } catch (err) {
      console.log('ℹ️ No blog posts table found in local database');
    }

    // Read partners from local database
    let localPartners = [];
    try {
      localPartners = await readLocalData('SELECT * FROM Partners ORDER BY id');
      console.log(`Found ${localPartners.length} partners in local database`);
    } catch (err) {
      console.log('ℹ️ No partners table found in local database');
    }

    // Read images from local database
    let localImages = [];
    try {
      localImages = await readLocalData('SELECT * FROM Images ORDER BY id');
      console.log(`Found ${localImages.length} images in local database`);
    } catch (err) {
      console.log('ℹ️ No images table found in local database');
    }

    // Read certifications from local database
    let localCertifications = [];
    try {
      localCertifications = await readLocalData('SELECT * FROM Certifications ORDER BY id');
      console.log(`Found ${localCertifications.length} certifications in local database`);
    } catch (err) {
      console.log('ℹ️ No certifications table found in local database');
    }

    console.log('\n📤 MIGRATING DATA TO RAILWAY');

    // Migrate Categories
    const categoryIdMap = {};
    for (const localCat of localCategories) {
      const newCategory = await Category.create({
        name: localCat.name,
        description: localCat.description,
        is_active: localCat.is_active !== undefined ? localCat.is_active : true,
        parent_id: null, // Will be updated in second pass
        image_url: localCat.image_url,
        created_at: localCat.created_at || new Date(),
        updated_at: localCat.updated_at || new Date()
      });
      categoryIdMap[localCat.id] = newCategory.id;
      console.log(`✅ Migrated category: ${localCat.name} (${localCat.id} → ${newCategory.id})`);
    }

    // Update parent_id relationships for categories
    for (const localCat of localCategories) {
      if (localCat.parent_id && categoryIdMap[localCat.parent_id]) {
        await Category.update(
          { parent_id: categoryIdMap[localCat.parent_id] },
          { where: { id: categoryIdMap[localCat.id] } }
        );
        console.log(`✅ Updated parent relationship for category: ${localCat.name}`);
      }
    }

    // Migrate Tests
    for (const localTest of localTests) {
      const categoryId = localTest.category_id ? categoryIdMap[localTest.category_id] : null;
      
      await Test.create({
        name: localTest.name,
        description: localTest.description,
        price: localTest.price,
        turnaround_time: localTest.turnaround_time,
        method: localTest.method,
        category_id: categoryId,
        is_active: localTest.is_active !== undefined ? localTest.is_active : true,
        display_order: localTest.display_order || 0,
        created_at: localTest.created_at || new Date(),
        updated_at: localTest.updated_at || new Date()
      });
      console.log(`✅ Migrated test: ${localTest.name}`);
    }

    // Migrate Blog Posts
    for (const localPost of localBlogPosts) {
      await BlogPost.create({
        title: localPost.title,
        content: localPost.content,
        excerpt: localPost.excerpt,
        slug: localPost.slug,
        featured_image: localPost.featured_image,
        is_published: localPost.is_published !== undefined ? localPost.is_published : true,
        published_at: localPost.published_at,
        created_at: localPost.created_at || new Date(),
        updated_at: localPost.updated_at || new Date()
      });
      console.log(`✅ Migrated blog post: ${localPost.title}`);
    }

    // Migrate Partners
    for (const localPartner of localPartners) {
      await Partner.create({
        name: localPartner.name,
        description: localPartner.description,
        logo_url: localPartner.logo_url,
        website_url: localPartner.website_url,
        is_active: localPartner.is_active !== undefined ? localPartner.is_active : true,
        display_order: localPartner.display_order || 0,
        created_at: localPartner.created_at || new Date(),
        updated_at: localPartner.updated_at || new Date()
      });
      console.log(`✅ Migrated partner: ${localPartner.name}`);
    }

    // Migrate Images
    for (const localImage of localImages) {
      await Image.create({
        filename: localImage.filename,
        original_name: localImage.original_name,
        mime_type: localImage.mime_type,
        size: localImage.size,
        url: localImage.url,
        alt_text: localImage.alt_text,
        created_at: localImage.created_at || new Date(),
        updated_at: localImage.updated_at || new Date()
      });
      console.log(`✅ Migrated image: ${localImage.filename}`);
    }

    // Migrate Certifications
    for (const localCert of localCertifications) {
      await Certification.create({
        name: localCert.name,
        description: localCert.description,
        image_url: localCert.image_url,
        certificate_url: localCert.certificate_url,
        issued_by: localCert.issued_by,
        issued_date: localCert.issued_date,
        expiry_date: localCert.expiry_date,
        is_active: localCert.is_active !== undefined ? localCert.is_active : true,
        display_order: localCert.display_order || 0,
        created_at: localCert.created_at || new Date(),
        updated_at: localCert.updated_at || new Date()
      });
      console.log(`✅ Migrated certification: ${localCert.name}`);
    }

    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log(`✅ Categories: ${localCategories.length}`);
    console.log(`✅ Tests: ${localTests.length}`);
    console.log(`✅ Blog Posts: ${localBlogPosts.length}`);
    console.log(`✅ Partners: ${localPartners.length}`);
    console.log(`✅ Images: ${localImages.length}`);
    console.log(`✅ Certifications: ${localCertifications.length}`);

    console.log('\n🔍 VERIFYING MIGRATION');
    const railwayCategories = await Category.findAll();
    const railwayTests = await Test.findAll();
    console.log(`Railway now has ${railwayCategories.length} categories and ${railwayTests.length} tests`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await railwaySequelize.close();
  }
}

// Run the migration
migrateData().catch(console.error);
