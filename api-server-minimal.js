/**
 * Minimal API server for testing and diagnosing deployment issues
 * 
 * This server provides basic API endpoints that return sample data
 * to help diagnose issues with the frontend when the main server
 * is not available or experiencing problems.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request body
app.use(express.json());

// — 1) Any API routes you have… (defined below)

// — 2) Serve React's build as static files
const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

console.log('📁 Serving static files from:', clientBuildPath);

// Sample data for API responses
const sampleData = {
  categories: [
    {
      id: 1,
      name: "Chemical Testing",
      description: "Comprehensive chemical analysis for various industries including pharmaceuticals, food, and environmental.",
      imageUrl: "/images/categories/chemical-testing.jpg"
    },
    {
      id: 2,
      name: "Microbiological Testing",
      description: "Detection and identification of microorganisms for safety and quality control.",
      imageUrl: "/images/categories/microbiological-testing.jpg"
    },
    {
      id: 3,
      name: "Environmental Analysis",
      description: "Testing of soil, water, and air samples for environmental monitoring and compliance.",
      imageUrl: "/images/categories/environmental-analysis.jpg"
    },
    {
      id: 4,
      name: "Food & Beverage Testing",
      description: "Quality and safety testing for food and beverage products to ensure regulatory compliance.",
      imageUrl: "/images/categories/food-&-beverage-testing.jpg"
    },
    {
      id: 5,
      name: "Pharmaceutical Analysis",
      description: "Testing and validation services for pharmaceutical products and raw materials.",
      imageUrl: "/images/categories/pharmaceutical-analysis.jpg"
    },
    {
      id: 6,
      name: "Material Characterization",
      description: "Analysis of material properties and composition for research and quality control.",
      imageUrl: "/images/categories/material-characterization.jpg"
    }
  ],
  partners: [
    {
      id: 1,
      name: "Pharmaceutical Innovations Inc.",
      logo: "https://via.placeholder.com/150x50",
      website: "https://example.com",
      isActive: true,
      description: "The analytical results provided by the laboratory were crucial for our product development process. Their precision and quick turnaround time exceeded our expectations."
    },
    {
      id: 2,
      name: "EcoSolutions Group",
      logo: "https://via.placeholder.com/150x50",
      website: "https://example.com",
      isActive: true,
      description: "We've been working with this laboratory for over 5 years. Their consistent quality and reliability have made them an invaluable partner for our environmental compliance testing."
    },
    {
      id: 3,
      name: "Advanced Materials Corp",
      logo: "https://via.placeholder.com/150x50",
      website: "https://example.com",
      isActive: true,
      description: "The team's expertise in analytical chemistry helped us identify critical impurities that were affecting our manufacturing process. Their insights saved us both time and resources."
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: "Introduction to Laboratory Testing Methods",
      slug: "introduction-to-laboratory-testing-methods",
      content: "<p>Laboratory testing is a critical component of scientific research, quality control, and regulatory compliance across various industries. This article provides an overview of common laboratory testing methods and their applications.</p>",
      authorName: "Dr. Sarah Johnson",
      isPublished: true,
      publishedAt: new Date().toISOString(),
      featuredImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      title: "Advances in Chemical Analysis Techniques",
      slug: "advances-in-chemical-analysis-techniques",
      content: "<p>Recent advances in chemical analysis have revolutionized how we identify and quantify substances. This article explores cutting-edge techniques and their applications in various industries.</p>",
      authorName: "Dr. Michael Chen",
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      featuredImage: "https://images.unsplash.com/photo-1518112166137-85f9979a43aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    },
    {
      id: 3,
      title: "Quality Control in Pharmaceutical Testing",
      slug: "quality-control-in-pharmaceutical-testing",
      content: "<p>Quality control is essential in pharmaceutical manufacturing to ensure product safety and efficacy. This article discusses key testing methodologies and regulatory requirements.</p>",
      authorName: "Dr. Emily Rodriguez",
      isPublished: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      featuredImage: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ],
  certifications: [
    {
      id: 1,
      name: "ISO 17025",
      description: "Accredited for testing and calibration laboratories",
      externalUrl: "https://www.iso.org/ISO-IEC-17025-testing-and-calibration-laboratories.html"
    },
    {
      id: 2,
      name: "FDA Registered",
      description: "Registered with the U.S. Food and Drug Administration",
      externalUrl: "https://www.fda.gov/"
    },
    {
      id: 3,
      name: "EPA Certified",
      description: "Certified by the Environmental Protection Agency",
      externalUrl: "https://www.epa.gov/"
    }
  ]
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthInfo = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    hostname: os.hostname(),
    platform: os.platform(),
    memory: {
      total: Math.round(os.totalmem() / (1024 * 1024)) + ' MB',
      free: Math.round(os.freemem() / (1024 * 1024)) + ' MB',
      usage: Math.round((1 - os.freemem() / os.totalmem()) * 100) + '%'
    },
    cpu: os.cpus()[0].model,
    nodeVersion: process.version
  };
  
  res.json(healthInfo);
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  // Add artificial delay to simulate network latency (optional)
  // setTimeout(() => {
  //   res.json({ data: sampleData.categories });
  // }, 500);
  
  res.json({ data: sampleData.categories });
});

// Partners endpoint
app.get('/api/partners', (req, res) => {
  res.json({ data: sampleData.partners });
});

// Blog posts endpoint
app.get('/api/blog', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : sampleData.blogPosts.length;
  const posts = sampleData.blogPosts.slice(0, limit);
  res.json({ data: posts });
});

// Certifications endpoint
app.get('/api/certifications', (req, res) => {
  res.json({ data: sampleData.certifications });
});

// — 3) For any other GET, send back React's index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ┌───────────────────────────────────────────────────┐
  │                                                   │
  │   Minimal API Server running on port ${PORT}        │
  │   Binding to 0.0.0.0 for Railway deployment      │
  │                                                   │
  │   Available endpoints:                            │
  │   - GET /api/health                               │
  │   - GET /api/categories                           │
  │   - GET /api/partners                             │
  │   - GET /api/blog                                 │
  │   - GET /api/certifications                       │
  │                                                   │
  │   This server provides sample data for testing    │
  │   and diagnosing deployment issues.               │
  │                                                   │
  └───────────────────────────────────────────────────┘
  `);
});
