/**
 * Seed professional analytical testing categories for Railway deployment
 */

const professionalCategories = [
  {
    name: "Chemical Testing",
    description: "Comprehensive chemical analysis for various industries including pharmaceuticals, food, and environmental sectors. Our advanced analytical techniques ensure accurate identification and quantification of chemical compounds.",
    imageUrl: "/images/categories/chemical-testing.jpg",
    isActive: true
  },
  {
    name: "Microbiological Testing",
    description: "Detection and identification of microorganisms for safety and quality control. Essential for food safety, pharmaceutical sterility, and environmental monitoring applications.",
    imageUrl: "/images/categories/microbiological-testing.jpg",
    isActive: true
  },
  {
    name: "Environmental Analysis",
    description: "Testing of soil, water, and air samples for environmental monitoring and regulatory compliance. Supporting environmental impact assessments and contamination studies.",
    imageUrl: "/images/categories/environmental-analysis.jpg",
    isActive: true
  },
  {
    name: "Food & Beverage Testing",
    description: "Quality and safety testing for food and beverage products to ensure regulatory compliance. Including nutritional analysis, contaminant detection, and shelf-life studies.",
    imageUrl: "/images/categories/food-beverage-testing.jpg",
    isActive: true
  },
  {
    name: "Pharmaceutical Analysis",
    description: "Testing and validation services for pharmaceutical products and raw materials. Supporting drug development, quality control, and regulatory submissions.",
    imageUrl: "/images/categories/pharmaceutical-analysis.jpg",
    isActive: true
  },
  {
    name: "Material Characterization",
    description: "Analysis of material properties and composition for research and quality control. Supporting product development and failure analysis across various industries.",
    imageUrl: "/images/categories/material-characterization.jpg",
    isActive: true
  },
  {
    name: "Forensic Analysis",
    description: "Scientific analysis for legal and investigative purposes. Providing expert testimony and detailed analytical reports for court proceedings and investigations.",
    imageUrl: "/images/categories/forensic-analysis.jpg",
    isActive: true
  },
  {
    name: "Toxicology Testing",
    description: "Assessment of toxic substances and their effects on biological systems. Supporting safety evaluations, regulatory compliance, and risk assessments.",
    imageUrl: "/images/categories/toxicology-testing.jpg",
    isActive: true
  }
];

console.log('Professional Categories for Railway Database:');
console.log(JSON.stringify(professionalCategories, null, 2));

// For Railway CLI usage:
console.log('\n=== RAILWAY SEEDING COMMANDS ===');
console.log('1. railway login');
console.log('2. Copy and run the following commands one by one:\n');

professionalCategories.forEach((category, index) => {
  const escapedDescription = category.description.replace(/"/g, '\\"');
  console.log(`railway run node -e "
const { Category } = require('./server/models');
Category.findOrCreate({
  where: { name: '${category.name}' },
  defaults: {
    name: '${category.name}',
    description: '${escapedDescription}',
    imageUrl: '${category.imageUrl}',
    isActive: ${category.isActive}
  }
}).then(([category, created]) => {
  console.log('${category.name}:', created ? 'Created' : 'Already exists');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"`);
});

console.log('\n3. Verify with: railway run node -e "const { Category } = require(\'./server/models\'); Category.findAll().then(cats => { console.log(\'Categories:\', cats.length); cats.forEach(c => console.log(\'-\', c.name)); process.exit(0); });"');
