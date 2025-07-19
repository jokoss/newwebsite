const { Category, Test, sequelize } = require('../models');

async function fixCategoriesOnRailway() {
  try {
    console.log('🚀 Starting Railway production database category fix...');
    
    // Check current categories
    const categories = await Category.findAll({
      include: [{
        model: Test,
        as: 'tests'
      }]
    });
    
    console.log(`📊 Found ${categories.length} categories in production database`);
    
    // If we have fewer than 9 categories, add the missing ones
    if (categories.length < 9) {
      console.log('🔧 Adding missing categories...');
      
      const requiredCategories = [
        { name: 'Biochemical Testing', description: 'Advanced biochemical analysis for research and diagnostic applications', isActive: true },
        { name: 'Environmental Analysis', description: 'Comprehensive environmental testing for soil, water, and air quality', isActive: true },
        { name: 'Microbiological Testing', description: 'Microbial analysis and contamination testing', isActive: true },
        { name: 'Molecular Diagnostics', description: 'DNA/RNA analysis and genetic testing services', isActive: true },
        { name: 'Material Characterization', description: 'Physical and chemical analysis of materials', isActive: true },
        { name: 'Pharmaceutical Analysis', description: 'Drug testing and pharmaceutical quality control', isActive: true },
        { name: 'Food & Beverage Testing', description: 'Food safety and quality testing services', isActive: true },
        { name: 'Toxicology Screening', description: 'Toxicological analysis and safety testing', isActive: true },
        { name: 'Clinical Diagnostics', description: 'Medical diagnostic testing services', isActive: true }
      ];
      
      for (const categoryData of requiredCategories) {
        const [category, created] = await Category.findOrCreate({
          where: { name: categoryData.name },
          defaults: categoryData
        });
        
        if (created) {
          console.log(`✅ Created category: ${categoryData.name}`);
        } else {
          // Update existing category to ensure it's active
          await category.update({ isActive: true });
          console.log(`🔄 Updated category: ${categoryData.name}`);
        }
      }
    }
    
    // Ensure all categories are active
    await Category.update(
      { isActive: true },
      { where: {} }
    );
    
    // Final verification
    const finalCategories = await Category.findAll({
      where: { isActive: true, parentId: null },
      include: [{
        model: Test,
        as: 'tests'
      }]
    });
    
    console.log(`🎉 Final result: ${finalCategories.length} active categories`);
    finalCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.tests?.length || 0} tests)`);
    });
    
    console.log('✅ Railway category fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing categories on Railway:', error);
    throw error;
  }
}

// Run the fix
if (require.main === module) {
  fixCategoriesOnRailway()
    .then(() => {
      console.log('🎯 Category fix completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Category fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixCategoriesOnRailway };
