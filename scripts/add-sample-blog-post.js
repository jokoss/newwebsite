require('dotenv').config();
const { BlogPost } = require('../models');
const slugify = require('slugify');

async function addSampleBlogPost() {
  try {
    console.log('Adding sample blog post...');
    
    const title = 'Introduction to Laboratory Testing Methods';
    const slug = slugify(title, { 
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Check if post already exists
    const existingPost = await BlogPost.findOne({ where: { slug } });
    
    if (existingPost) {
      console.log('Sample blog post already exists.');
      process.exit(0);
    }
    
    // Create sample blog post
    const post = await BlogPost.create({
      title,
      slug,
      content: `
<h2>Understanding Laboratory Testing Methods</h2>

<p>Laboratory testing is a critical component of scientific research, quality control, and regulatory compliance across various industries. This article provides an overview of common laboratory testing methods and their applications.</p>

<h3>Chemical Analysis Techniques</h3>

<p>Chemical analysis techniques are used to determine the composition and structure of substances. Some common methods include:</p>

<ul>
  <li><strong>Spectroscopy</strong>: Techniques like UV-Vis, IR, and NMR spectroscopy analyze how substances interact with electromagnetic radiation.</li>
  <li><strong>Chromatography</strong>: Methods such as HPLC, GC, and TLC separate mixtures into their components for identification and quantification.</li>
  <li><strong>Mass Spectrometry</strong>: This technique identifies compounds based on their mass-to-charge ratio.</li>
</ul>

<h3>Microbiological Testing</h3>

<p>Microbiological testing is essential for detecting and identifying microorganisms in samples. Common methods include:</p>

<ul>
  <li><strong>Culture-Based Methods</strong>: Growing microorganisms on nutrient media to identify and enumerate them.</li>
  <li><strong>Molecular Methods</strong>: Techniques like PCR and DNA sequencing for rapid and specific identification of microorganisms.</li>
  <li><strong>Immunological Methods</strong>: Using antibodies to detect specific microorganisms or their products.</li>
</ul>

<h3>Physical Testing</h3>

<p>Physical testing evaluates the physical properties of materials. Common tests include:</p>

<ul>
  <li><strong>Mechanical Testing</strong>: Measuring properties like tensile strength, hardness, and elasticity.</li>
  <li><strong>Thermal Analysis</strong>: Evaluating how materials respond to temperature changes.</li>
  <li><strong>Particle Size Analysis</strong>: Determining the size distribution of particles in a sample.</li>
</ul>

<h3>Choosing the Right Testing Method</h3>

<p>Selecting the appropriate testing method depends on several factors:</p>

<ol>
  <li>The nature of the sample</li>
  <li>The specific information required</li>
  <li>Regulatory requirements</li>
  <li>Available equipment and expertise</li>
  <li>Time and cost constraints</li>
</ol>

<p>Our laboratory offers a comprehensive range of testing services using state-of-the-art equipment and methodologies. Our team of experts ensures accurate and reliable results with quick turnaround times.</p>

<p>For more information about our testing services, please <a href="/contact">contact us</a> or explore our <a href="/services">service categories</a>.</p>
      `,
      authorName: 'Dr. Sarah Johnson',
      isPublished: true,
      publishedAt: new Date(),
      schemaMarkup: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Introduction to Laboratory Testing Methods",
        "author": {
          "@type": "Person",
          "name": "Dr. Sarah Johnson"
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": "Analytical Testing Laboratory",
          "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.jpg"
          }
        },
        "description": "An overview of common laboratory testing methods and their applications across various industries."
      })
    });
    
    console.log('Sample blog post created successfully:', post.title);
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample blog post:', error);
    process.exit(1);
  }
}

// Run the function
addSampleBlogPost();
