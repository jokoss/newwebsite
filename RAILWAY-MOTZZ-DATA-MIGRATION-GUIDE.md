# Railway Motzz Laboratory Data Migration Guide

## Overview

This guide will help you migrate your complete Motzz Laboratory database structure from local development to Railway PostgreSQL. This includes all categories, subcategories, tests with pricing, methods, and turnaround times.

## What This Migration Includes

✅ **4 Main Categories:**
- Agriculture
- Construction / Materials  
- Environmental Analysis
- Microbiology

✅ **5 Agriculture Subcategories:**
- Soil Analysis
- Plant/Tissue Analysis
- Water Analysis
- Compost Analysis
- Fertilizer Analysis

✅ **9 Professional Tests with Pricing:**
- Complete Soil Analysis ($175)
- Organic Matter - LOI ($45)
- Soil pH and EC ($35)
- Soil Aggregate Testing ($195)
- Construction Materials Analysis ($225)
- Water Quality Analysis ($150)
- Soil Contamination Assessment ($185)
- Microbial Identification ($125)
- Pathogen Detection ($165)

✅ **Complete Data Structure:**
- Hierarchical category relationships
- Professional descriptions
- Method references
- Turnaround times
- Display ordering

## Prerequisites

1. **Railway CLI installed and logged in:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Railway project connected** to your GitHub repository

3. **Database connection confirmed** (Railway PostgreSQL should be running)

## Migration Steps

### Step 1: Generate Migration Commands

Run the migration script to see all commands:

```bash
node railway-motzz-data-migration.js
```

### Step 2: Execute Migration Commands

Copy and paste each command from the output. Here's the sequence:

#### 1. Clear Existing Test Data

```bash
railway run node -e "
const { Category, Test } = require('./server/models');
(async () => {
  try {
    await Test.destroy({ where: {} });
    await Category.destroy({ where: {} });
    console.log('✅ Cleared existing categories and tests');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    process.exit(1);
  }
})();
"
```

#### 2. Create Main Categories

Run each of these commands one by one:

```bash
# Agriculture
railway run node -e "
const { Category } = require('./server/models');
Category.findOrCreate({
  where: { name: 'Agriculture' },
  defaults: {
    name: 'Agriculture',
    description: 'Testing services for soil, plant, water, compost/mulch and fertilizer. We provide services to farms, golf courses, and nurseries in Arizona and surrounding regions.',
    imageUrl: '/images/categories/agriculture.jpg',
    isActive: true,
    displayOrder: 1
  }
}).then(([category, created]) => {
  console.log('Agriculture:', created ? 'Created' : 'Already exists');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"

# Construction / Materials
railway run node -e "
const { Category } = require('./server/models');
Category.findOrCreate({
  where: { name: 'Construction / Materials' },
  defaults: {
    name: 'Construction / Materials',
    description: 'With our engineering background, we perform soil aggregate testing using the ADOT, CDOT, AASHTO and ASTM specified methods.',
    imageUrl: '/images/categories/construction-materials.jpg',
    isActive: true,
    displayOrder: 2
  }
}).then(([category, created]) => {
  console.log('Construction / Materials:', created ? 'Created' : 'Already exists');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"

# Environmental Analysis
railway run node -e "
const { Category } = require('./server/models');
Category.findOrCreate({
  where: { name: 'Environmental Analysis' },
  defaults: {
    name: 'Environmental Analysis',
    description: 'Detailed analysis of environmental samples including water, soil, and air quality testing.',
    imageUrl: '/images/categories/environmental-analysis.jpg',
    isActive: true,
    displayOrder: 3
  }
}).then(([category, created]) => {
  console.log('Environmental Analysis:', created ? 'Created' : 'Already exists');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"

# Microbiology
railway run node -e "
const { Category } = require('./server/models');
Category.findOrCreate({
  where: { name: 'Microbiology' },
  defaults: {
    name: 'Microbiology',
    description: 'Identification and analysis of microorganisms in various samples.',
    imageUrl: '/images/categories/microbiology.jpg',
    isActive: true,
    displayOrder: 4
  }
}).then(([category, created]) => {
  console.log('Microbiology:', created ? 'Created' : 'Already exists');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"
```

#### 3. Create Agriculture Subcategories

Continue with the subcategory commands from the migration script output...

#### 4. Create All Tests

Continue with the test creation commands from the migration script output...

#### 5. Verify Migration

```bash
railway run node -e "
const { Category, Test } = require('./server/models');
(async () => {
  try {
    const categories = await Category.findAll({ include: [{ model: Test, as: 'tests' }] });
    console.log(\`✅ Migration Complete: \${categories.length} categories\`);
    categories.forEach(cat => {
      console.log(\`- \${cat.name}: \${cat.tests ? cat.tests.length : 0} tests\`);
    });
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying:', error.message);
    process.exit(1);
  }
})();
"
```

## Expected Results

After successful migration, you should see:

```
✅ Migration Complete: 9 categories
- Agriculture: 0 tests
- Construction / Materials: 2 tests
- Environmental Analysis: 2 tests
- Microbiology: 2 tests
- Soil Analysis: 3 tests
- Plant/Tissue Analysis: 0 tests
- Water Analysis: 0 tests
- Compost Analysis: 0 tests
- Fertilizer Analysis: 0 tests
```

## Verification Steps

1. **Check Admin Panel:**
   - Visit your Railway URL + `/admin`
   - Login with admin credentials
   - Navigate to Category Management
   - Verify all categories and subcategories appear

2. **Check Homepage:**
   - Visit your Railway URL
   - Verify services section shows professional categories
   - No more "test" or "test 2" categories

3. **Check API Endpoints:**
   - Visit your Railway URL + `/api/categories`
   - Should return professional categories with proper structure

## Troubleshooting

### Common Issues

1. **"Category not found" errors:**
   - Ensure main categories are created before subcategories
   - Run commands in the exact order provided

2. **Database connection errors:**
   - Verify Railway PostgreSQL is running
   - Check DATABASE_URL environment variable

3. **Permission errors:**
   - Ensure you're logged into Railway CLI
   - Verify project permissions

### Recovery Commands

If something goes wrong, you can restart:

```bash
# Clear everything and start over
railway run node -e "
const { Category, Test } = require('./server/models');
(async () => {
  await Test.destroy({ where: {} });
  await Category.destroy({ where: {} });
  console.log('✅ Database cleared - ready to restart migration');
  process.exit(0);
})();
"
```

## Post-Migration Tasks

1. **Add Category Images:**
   - Upload category images to `/client/public/images/categories/`
   - Ensure image paths match the imageUrl values

2. **Test All Functionality:**
   - Admin panel category management
   - Homepage services display
   - Category detail pages
   - Test management

3. **Add Additional Data:**
   - Partners (if needed)
   - Blog posts (if needed)
   - Certifications (if needed)

## Success Indicators

✅ Admin panel shows professional categories instead of "test" entries
✅ Homepage displays proper service categories
✅ API endpoints return structured professional data
✅ All pricing and method information is preserved
✅ Hierarchical category structure is maintained

Your Railway deployment will now have the complete Motzz Laboratory database structure with all professional analytical testing services, pricing, and methods!
