const { Category, Test, Image } = require('../models');
const { sequelize } = require('../models');

async function investigateAndFixCategories() {
  try {
    console.log('🔍 Investigating category visibility issues...\n');
    
    // Check all categories in database
    const allCategories = await Category.findAll({
      include: [
        {
          model: Test,
          as: 'tests',
          required: false
        }
      ],
      order: [['name', 'ASC']]
    });
    
    console.log(`📊 Total categories in database: ${allCategories.length}`);
    
    // Analyze category status
    const activeCategories = allCategories.filter(cat => cat.active === true);
    const inactiveCategories = allCategories.filter(cat => cat.active === false);
    const mainCategories = allCategories.filter(cat => cat.parentId === null);
    const subCategories = allCategories.filter(cat => cat.parentId !== null);
    
    console.log(`✅ Active categories: ${activeCategories.length}`);
    console.log(`❌ Inactive categories: ${inactiveCategories.length}`);
    console.log(`🏠 Main categories (parentId = null): ${mainCategories.length}`);
    console.log(`📁 Sub categories (parentId != null): ${subCategories.length}\n`);
    
    // Show detailed breakdown
    console.log('📋 Category Details:');
    console.log('==================');
    
    allCategories.forEach(category => {
      const status = category.active ? '✅' : '❌';
      const type = category.parentId === null ? 'MAIN' : `SUB(${category.parentId})`;
      const testCount = category.tests ? category.tests.length : 0;
      
      console.log(`${status} [${type}] ${category.name} (${testCount} tests) - ID: ${category.id}`);
    });
    
    // Check what public API would return
    const publicCategories = await Category.findAll({
      where: { active: true, parentId: null },
      include: [
        {
          model: Test,
          as: 'tests',
          where: { active: true },
          required: false
        }
      ]
    });
    
    console.log(`\n🌐 Categories visible to public API: ${publicCategories.length}`);
    
    if (publicCategories.length === 0) {
      console.log('\n🚨 ISSUE FOUND: No categories are visible to public API!');
      console.log('This explains why the website shows fallback data.\n');
      
      // Suggest fixes
      console.log('💡 Suggested fixes:');
      
      if (inactiveCategories.length > 0) {
        console.log(`1. Activate ${inactiveCategories.length} inactive categories`);
      }
      
      if (subCategories.length > 0 && mainCategories.length === 0) {
        console.log(`2. Convert some subcategories to main categories`);
      }
      
      // Auto-fix: Activate all categories and make them main categories if needed
      console.log('\n🔧 Applying automatic fixes...');
      
      const transaction = await sequelize.transaction();
      
      try {
        // Activate all categories
        await Category.update(
          { active: true },
          { 
            where: { active: false },
            transaction 
          }
        );
        
        // If no main categories exist, convert subcategories to main categories
        if (mainCategories.length === 0 && subCategories.length > 0) {
          await Category.update(
            { parentId: null },
            { 
              where: { parentId: { [require('sequelize').Op.ne]: null } },
              transaction 
            }
          );
          console.log('✅ Converted subcategories to main categories');
        }
        
        // Also activate all tests
        await Test.update(
          { active: true },
          { 
            where: { active: false },
            transaction 
          }
        );
        
        await transaction.commit();
        console.log('✅ All categories and tests have been activated');
        
        // Verify the fix
        const fixedPublicCategories = await Category.findAll({
          where: { active: true, parentId: null },
          include: [
            {
              model: Test,
              as: 'tests',
              where: { active: true },
              required: false
            }
          ]
        });
        
        console.log(`\n🎉 SUCCESS: ${fixedPublicCategories.length} categories are now visible to public API!`);
        
        fixedPublicCategories.forEach(category => {
          const testCount = category.tests ? category.tests.length : 0;
          console.log(`   ✅ ${category.name} (${testCount} tests)`);
        });
        
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } else {
      console.log('\n✅ Categories are properly configured for public visibility');
    }
    
  } catch (error) {
    console.error('❌ Error investigating categories:', error);
    throw error;
  }
}

async function fixImagePaths() {
  try {
    console.log('\n🖼️  Investigating image path issues...\n');
    
    // Check all images
    const allImages = await Image.findAll();
    console.log(`📊 Total images in database: ${allImages.length}`);
    
    // Find images with undefined paths
    const brokenImages = allImages.filter(img => 
      !img.filePath || 
      img.filePath.includes('undefined') || 
      img.filePath === '/uploads/undefined'
    );
    
    console.log(`🚨 Images with broken paths: ${brokenImages.length}`);
    
    if (brokenImages.length > 0) {
      console.log('\n📋 Broken Image Details:');
      brokenImages.forEach(img => {
        console.log(`   ❌ ID: ${img.id}, Name: ${img.name}, Path: ${img.filePath}`);
      });
      
      // For now, just log the issue - we'll need manual intervention to fix these
      console.log('\n💡 These images need manual attention:');
      console.log('   - Re-upload the images through the admin panel');
      console.log('   - Or delete the broken image records');
      console.log('   - Or set proper fallback images');
    } else {
      console.log('✅ All image paths look good');
    }
    
  } catch (error) {
    console.error('❌ Error investigating images:', error);
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting comprehensive database investigation and fixes...\n');
    
    await investigateAndFixCategories();
    await fixImagePaths();
    
    console.log('\n🎉 Investigation and fixes completed!');
    console.log('📝 Summary:');
    console.log('   - Categories should now be visible on public website');
    console.log('   - Tests should be properly associated');
    console.log('   - Image issues have been identified');
    console.log('\n💡 Next steps:');
    console.log('   - Test the public website to see categories');
    console.log('   - Fix any remaining image issues manually');
    console.log('   - Deploy the updated homepage design');
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { investigateAndFixCategories, fixImagePaths };
