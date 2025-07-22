const fs = require('fs');
const path = require('path');

console.log('📥 IMPORTING JSON DATA TO RAILWAY');
console.log('=================================');

// Railway PostgreSQL connection
process.env.NODE_ENV = 'production';
const railwaySequelize = require('../config/database');
const { Category, Test, BlogPost, Partner, Image, Certification } = require('../models');

// Path to exported JSON data
const jsonPath = path.join(__dirname, 'local-data-export.json');

async function importData() {
  try {
    console.log('\n📊 CONNECTING TO RAILWAY DATABASE');
    await railwaySequelize.authenticate();
    console.log('✅ Railway database connection successful');

    console.log('\n📁 READING EXPORTED JSON DATA');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON export file not found at: ${jsonPath}`);
    }

    const exportData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log('✅ JSON data loaded successfully');

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

    console.log('\n📤 IMPORTING DATA TO RAILWAY');

    // Import Categories
    const categoryIdMap = {};
    for (const localCat of exportData.categories) {
      const newCategory = await Category.create({
        name: localCat.name,
        description: localCat.description,
        active: localCat.is_active !== undefined ? localCat.is_active : true,
        parentId: null, // Will be updated in second pass
        imageUrl: localCat.image_url,
        displayOrder: localCat.display_order || 0,
        createdAt: localCat.created_at || new Date(),
        updatedAt: localCat.updated_at || new Date()
      });
      categoryIdMap[localCat.id] = newCategory.id;
      console.log(`✅ Imported category: ${localCat.name} (${localCat.id} → ${newCategory.id})`);
    }

    // Update parentId relationships for categories
    for (const localCat of exportData.categories) {
      if (localCat.parent_id && categoryIdMap[localCat.parent_id]) {
        await Category.update(
          { parentId: categoryIdMap[localCat.parent_id] },
          { where: { id: categoryIdMap[localCat.id] } }
        );
        console.log(`✅ Updated parent relationship for category: ${localCat.name}`);
      }
    }

    // Import Tests
    for (const localTest of exportData.tests) {
      const categoryId = localTest.category_id ? categoryIdMap[localTest.category_id] : null;
      
      await Test.create({
        name: localTest.name,
        description: localTest.description,
        price: localTest.price,
        turnaroundTime: localTest.turnaround_time,
        methodReference: localTest.method,
        categoryId: categoryId,
        active: localTest.is_active !== undefined ? localTest.is_active : true,
        displayOrder: localTest.display_order || 0,
        createdAt: localTest.created_at || new Date(),
        updatedAt: localTest.updated_at || new Date()
      });
      console.log(`✅ Imported test: ${localTest.name}`);
    }

    // Import Blog Posts
    for (const localPost of exportData.blogPosts) {
      await BlogPost.create({
        title: localPost.title,
        content: localPost.content,
        slug: localPost.slug,
        authorName: localPost.author_name || localPost.authorName || 'Admin', // Handle missing authorName
        featuredImage: localPost.featured_image || localPost.featuredImage,
        publishedAt: localPost.published_at || localPost.publishedAt,
        isPublished: localPost.is_published !== undefined ? localPost.is_published : (localPost.isPublished !== undefined ? localPost.isPublished : true)
      });
      console.log(`✅ Imported blog post: ${localPost.title}`);
    }

    // Import Partners
    for (const localPartner of exportData.partners) {
      await Partner.create({
        name: localPartner.name,
        description: localPartner.description,
        logo: localPartner.logo_url,
        website: localPartner.website_url,
        isActive: localPartner.is_active !== undefined ? localPartner.is_active : true,
        displayOrder: localPartner.display_order || 0,
        createdAt: localPartner.created_at || new Date(),
        updatedAt: localPartner.updated_at || new Date()
      });
      console.log(`✅ Imported partner: ${localPartner.name}`);
    }

    // Import Images
    for (const localImage of exportData.images) {
      await Image.create({
        name: localImage.filename || localImage.original_name,
        description: localImage.alt_text,
        filePath: localImage.url,
        altText: localImage.alt_text,
        fileSize: localImage.size,
        mimeType: localImage.mime_type,
        isActive: true,
        createdAt: localImage.created_at || new Date(),
        updatedAt: localImage.updated_at || new Date()
      });
      console.log(`✅ Imported image: ${localImage.filename}`);
    }

    // Import Certifications
    for (const localCert of exportData.certifications) {
      await Certification.create({
        name: localCert.name,
        description: localCert.description,
        imageUrl: localCert.image_url,
        externalUrl: localCert.certificate_url,
        sortOrder: localCert.display_order || 0,
        isActive: localCert.is_active !== undefined ? localCert.is_active : true,
        isDisplayed: true,
        createdAt: localCert.created_at || new Date(),
        updatedAt: localCert.updated_at || new Date()
      });
      console.log(`✅ Imported certification: ${localCert.name}`);
    }

    console.log('\n🎉 IMPORT COMPLETED SUCCESSFULLY!');
    console.log('=================================');
    console.log(`✅ Categories: ${exportData.categories.length}`);
    console.log(`✅ Tests: ${exportData.tests.length}`);
    console.log(`✅ Blog Posts: ${exportData.blogPosts.length}`);
    console.log(`✅ Partners: ${exportData.partners.length}`);
    console.log(`✅ Images: ${exportData.images.length}`);
    console.log(`✅ Certifications: ${exportData.certifications.length}`);

    console.log('\n🔍 VERIFYING IMPORT');
    const railwayCategories = await Category.findAll();
    const railwayTests = await Test.findAll();
    console.log(`Railway now has ${railwayCategories.length} categories and ${railwayTests.length} tests`);

    console.log('\n🌐 Your Railway site should now show your actual laboratory data!');
    console.log('Visit: https://vigilant-compassion-production.up.railway.app');

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await railwaySequelize.close();
  }
}

// Run the import
importData().catch(console.error);
