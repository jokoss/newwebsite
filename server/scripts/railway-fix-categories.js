// Force production environment to use PostgreSQL
process.env.NODE_ENV = 'production';
require('dotenv').config();
const { Category, Test } = require('../models');

async function fixCategories() {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('🔧 RAILWAY CATEGORY FIX TOOL');
  console.log('============================');
  
  try {
    // 1. Check if categories exist
    const categoryCount = await Category.count();
    console.log('Database dialect:', Category.sequelize.options.dialect);
    console.log(`Found ${categoryCount} categories`);
    
    if (categoryCount === 0) {
      console.log('❌ No categories found. Creating sample categories...');
      
      const sampleCategories = [
        { 
          name: 'Chemical Analysis', 
          description: 'Comprehensive chemical analysis services for research and industrial applications.',
          active: true 
        },
        { 
          name: 'Microbiological Testing', 
          description: 'Complete microbiological testing services for healthcare and food safety.',
          active: true 
        },
        { 
          name: 'Materials Characterization', 
          description: 'Advanced materials characterization techniques for research and development.',
          active: true 
        }
      ];
      
      const createdCategories = await Category.bulkCreate(sampleCategories);
      console.log(`✅ Created ${createdCategories.length} sample categories`);
      
      // Create sample tests for each category
      for (const category of createdCategories) {
        let sampleTests = [];
        
        if (category.name === 'Chemical Analysis') {
          sampleTests = [
            { 
              name: 'HPLC Analysis', 
              description: 'High-performance liquid chromatography analysis for complex mixtures.',
              price: 199.99,
              categoryId: category.id,
              active: true
            },
            { 
              name: 'GC-MS Testing', 
              description: 'Gas chromatography–mass spectrometry for volatile compound identification.',
              price: 249.99,
              categoryId: category.id,
              active: true
            }
          ];
        } else if (category.name === 'Microbiological Testing') {
          sampleTests = [
            { 
              name: 'Microbial Identification', 
              description: 'Identification of microorganisms using advanced techniques.',
              price: 179.99,
              categoryId: category.id,
              active: true
            },
            { 
              name: 'Antimicrobial Susceptibility', 
              description: 'Testing for antimicrobial resistance in bacterial isolates.',
              price: 189.99,
              categoryId: category.id,
              active: true
            }
          ];
        } else if (category.name === 'Materials Characterization') {
          sampleTests = [
            { 
              name: 'SEM Analysis', 
              description: 'Scanning electron microscopy for surface morphology analysis.',
              price: 299.99,
              categoryId: category.id,
              active: true
            },
            { 
              name: 'XRD Analysis', 
              description: 'X-ray diffraction for crystalline material structure determination.',
              price: 229.99,
              categoryId: category.id,
              active: true
            }
          ];
        }
        
        if (sampleTests.length > 0) {
          const createdTests = await Test.bulkCreate(sampleTests);
          console.log(`✅ Created ${createdTests.length} tests for category: ${category.name}`);
        }
      }
    } else {
      // 2. Fix existing categories
      console.log('Checking and fixing existing categories...');
      
      const categories = await Category.findAll();
      let fixedCount = 0;
      
      for (const category of categories) {
        let needsUpdate = false;
        const updates = {};
        
        // Ensure active is set to true
        if (category.active !== true) {
          updates.active = true;
          needsUpdate = true;
        }
        
        // Ensure description is not empty
        if (!category.description) {
          updates.description = `${category.name} services for research and industrial applications.`;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await category.update(updates);
          fixedCount++;
        }
        
        // Check and fix tests for this category
        const testCount = await Test.count({ where: { categoryId: category.id } });
        console.log(`Category "${category.name}" has ${testCount} tests`);
        
        if (testCount === 0) {
          console.log(`❌ No tests found for category: ${category.name}. Creating sample tests...`);
          
          // Create at least two sample tests for this category
          const sampleTests = [
            { 
              name: `${category.name} Test 1`, 
              description: `Standard ${category.name.toLowerCase()} test service.`,
              price: 199.99,
              categoryId: category.id,
              active: true
            },
            { 
              name: `${category.name} Test 2`, 
              description: `Advanced ${category.name.toLowerCase()} test service.`,
              price: 299.99,
              categoryId: category.id,
              active: true
            }
          ];
          
          const createdTests = await Test.bulkCreate(sampleTests);
          console.log(`✅ Created ${createdTests.length} sample tests for category: ${category.name}`);
        } else {
          // Fix existing tests
          const tests = await Test.findAll({ where: { categoryId: category.id } });
          let fixedTestCount = 0;
          
          for (const test of tests) {
            let needsTestUpdate = false;
            const testUpdates = {};
            
            // Ensure active is set to true
            if (test.active !== true) {
              testUpdates.active = true;
              needsTestUpdate = true;
            }
            
            // Ensure price is set
            if (!test.price) {
              testUpdates.price = 199.99 + (Math.random() * 100);
              needsTestUpdate = true;
            }
            
            // Ensure description is not empty
            if (!test.description) {
              testUpdates.description = `${test.name} service for research and industrial applications.`;
              needsTestUpdate = true;
            }
            
            if (needsTestUpdate) {
              await test.update(testUpdates);
              fixedTestCount++;
            }
          }
          
          if (fixedTestCount > 0) {
            console.log(`✅ Fixed ${fixedTestCount} tests for category: ${category.name}`);
          }
        }
      }
      
      if (fixedCount > 0) {
        console.log(`✅ Fixed ${fixedCount} categories`);
      } else {
        console.log('✅ All categories are properly configured');
      }
    }
    
    // Final verification
    const finalCategoryCount = await Category.count({ where: { active: true } });
    const finalTestCount = await Test.count({ where: { active: true } });
    
    console.log('\n📊 FINAL STATUS:');
    console.log(`✅ Active Categories: ${finalCategoryCount}`);
    console.log(`✅ Active Tests: ${finalTestCount}`);
    
    console.log('\n✅ Category fix completed successfully');
    
  } catch (error) {
    console.error('❌ Error fixing categories:', error);
  }
}

// Run the fix
fixCategories()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
