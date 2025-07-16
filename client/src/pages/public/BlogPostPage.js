import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  Chip,
  Paper,
  Button,
  Grid
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  // Sample fallback blog post data
  const getFallbackPost = (postSlug) => ({
    id: 1,
    title: "Introduction to Laboratory Testing Methods",
    slug: postSlug,
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
    authorName: "Dr. Sarah Johnson",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featuredImage: null,
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blog/${slug}`);
        
        // Check if we have valid data
        if (response.data && response.data.data) {
          setPost(response.data.data);
        } else {
          console.warn('No valid blog post found in API response. Using fallback data.');
          setPost(getFallbackPost(slug));
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching blog post:', err);
        console.log('Using fallback blog post data due to API error');
        setPost(getFallbackPost(slug));
        setError(''); // Don't show error to user since we're using fallback data
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Inject schema markup into the page head
  useEffect(() => {
    if (post && post.schemaMarkup) {
      try {
        // Remove any existing schema script
        const existingScript = document.getElementById('blog-post-schema');
        if (existingScript) {
          existingScript.remove();
        }
        
        // Create and append new schema script
        const script = document.createElement('script');
        script.id = 'blog-post-schema';
        script.type = 'application/ld+json';
        script.textContent = post.schemaMarkup;
        document.head.appendChild(script);
        
        // Clean up on unmount
        return () => {
          const scriptToRemove = document.getElementById('blog-post-schema');
          if (scriptToRemove) {
            scriptToRemove.remove();
          }
        };
      } catch (error) {
        console.error('Error injecting schema markup:', error);
      }
    }
  }, [post]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            component={RouterLink} 
            to="/blog" 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back to Blog
          </Button>
        </Box>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Blog post not found.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            component={RouterLink} 
            to="/blog" 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back to Blog
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white' }}>
      {/* Featured image or colored header */}
      {post.featuredImage ? (
        <Box
          sx={{
            height: { xs: 200, md: 400 },
            width: '100%',
            backgroundImage: `url(${post.featuredImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1
            }
          }}
        >
          <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 2 }}>
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: 20, md: 40 },
                color: 'white',
                maxWidth: 800
              }}
            >
              <Typography variant="h2" component="h1" sx={{ fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                {post.title}
              </Typography>
            </Box>
          </Container>
        </Box>
      ) : (
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            background: theme.gradients.primary,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                textShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {post.title}
            </Typography>
          </Container>
        </Box>
      )}

      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
        >
          <Link 
            component={RouterLink} 
            to="/"
            sx={{ textDecoration: 'none', color: 'text.secondary' }}
          >
            Home
          </Link>
          <Link 
            component={RouterLink} 
            to="/blog"
            sx={{ textDecoration: 'none', color: 'text.secondary' }}
          >
            Blog
          </Link>
          <Typography color="text.primary">{post.title}</Typography>
        </Breadcrumbs>
      </Container>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Article content */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                mb: 4, 
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Article metadata */}
              <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  icon={<CalendarIcon fontSize="small" />} 
                  label={`Published: ${formatDate(post.publishedAt)}`} 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }} 
                />
                <Chip 
                  icon={<PersonIcon fontSize="small" />} 
                  label={`Author: ${post.authorName}`} 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }} 
                />
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <Chip 
                    icon={<EditIcon fontSize="small" />} 
                    label={`Updated: ${formatDate(post.updatedAt)}`} 
                    size="small" 
                    sx={{ mb: 1 }} 
                  />
                )}
              </Box>
              
              <Divider sx={{ mb: 4 }} />
              
              {/* Article content */}
              <Box 
                className="blog-content"
                sx={{ 
                  '& h2': { 
                    mt: 4, 
                    mb: 2,
                    fontWeight: 700,
                    color: theme.palette.primary.main
                  },
                  '& h3': { 
                    mt: 3, 
                    mb: 2,
                    fontWeight: 600 
                  },
                  '& p': { 
                    mb: 2,
                    lineHeight: 1.7
                  },
                  '& ul, & ol': { 
                    mb: 3,
                    pl: 2
                  },
                  '& li': { 
                    mb: 1 
                  },
                  '& a': {
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    my: 2
                  }
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Paper>
            
            {/* Back to blog button */}
            <Button 
              component={RouterLink} 
              to="/blog" 
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 4 }}
            >
              Back to Blog
            </Button>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                bgcolor: theme.palette.grey[50]
              }}
            >
              <Typography variant="h6" gutterBottom>
                About the Author
              </Typography>
              <Typography variant="body2" paragraph>
                {post.authorName} is an expert in laboratory testing methodologies with extensive experience in analytical chemistry and quality control procedures.
              </Typography>
            </Paper>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                bgcolor: theme.palette.grey[50]
              }}
            >
              <Typography variant="h6" gutterBottom>
                Our Services
              </Typography>
              <Typography variant="body2" paragraph>
                Explore our comprehensive range of laboratory testing services.
              </Typography>
              <Button 
                component={RouterLink} 
                to="/services" 
                variant="contained"
                color="primary"
                fullWidth
              >
                View Services
              </Button>
            </Paper>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                bgcolor: theme.palette.grey[50]
              }}
            >
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" paragraph>
                Have questions about our testing services? Our team is ready to assist you.
              </Typography>
              <Button 
                component={RouterLink} 
                to="/contact" 
                variant="outlined"
                color="primary"
                fullWidth
              >
                Get in Touch
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogPostPage;
