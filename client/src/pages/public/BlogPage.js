import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Pagination,
  CircularProgress,
  Alert,
  useTheme,
  Chip
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();

  // Sample fallback blog posts data
  const fallbackPosts = [
    {
      id: 1,
      title: "Introduction to Laboratory Testing Methods",
      slug: "introduction-to-laboratory-testing-methods",
      content: "<p>Laboratory testing is a critical component of scientific research, quality control, and regulatory compliance across various industries. This article provides an overview of common laboratory testing methods and their applications.</p>",
      authorName: "Dr. Sarah Johnson",
      publishedAt: new Date().toISOString(),
      featuredImage: null
    },
    {
      id: 2,
      title: "Advances in Chemical Analysis Techniques",
      slug: "advances-in-chemical-analysis-techniques",
      content: "<p>Recent advances in chemical analysis have revolutionized how we identify and quantify substances. This article explores cutting-edge techniques and their applications in various industries.</p>",
      authorName: "Dr. Michael Chen",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      featuredImage: null
    },
    {
      id: 3,
      title: "Quality Control in Pharmaceutical Testing",
      slug: "quality-control-in-pharmaceutical-testing",
      content: "<p>Quality control is essential in pharmaceutical manufacturing to ensure product safety and efficacy. This article discusses key testing methodologies and regulatory requirements.</p>",
      authorName: "Dr. Emily Rodriguez",
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      featuredImage: null
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blog?page=${page}&limit=6`);
        
        // Check if we have valid data
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.warn('No valid blog posts found in API response. Using fallback data.');
          setPosts(fallbackPosts);
          setTotalPages(1);
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        console.log('Using fallback blog posts data due to API error');
        setPosts(fallbackPosts);
        setTotalPages(1);
        setError(''); // Don't show error to user since we're using fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

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

  // Extract excerpt from HTML content
  const getExcerpt = (htmlContent, maxLength = 150) => {
    if (!htmlContent) return '';
    
    // Remove HTML tags
    const textContent = htmlContent.replace(/<[^>]+>/g, '');
    
    // Truncate to maxLength
    if (textContent.length <= maxLength) return textContent;
    
    // Find the last space before maxLength
    const lastSpace = textContent.substring(0, maxLength).lastIndexOf(' ');
    return textContent.substring(0, lastSpace) + '...';
  };

  // Hero section
  const HeroSection = () => (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: theme.gradients.primary,
        color: 'white',
        textAlign: 'center',
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
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          Our Blog
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            maxWidth: 800, 
            mx: 'auto', 
            mb: 6,
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          Insights, research, and updates from our laboratory experts
        </Typography>
      </Container>
    </Box>
  );

  // Blog post card
  const BlogPostCard = ({ post }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
        },
        border: '1px solid #eee'
      }}
    >
      {post.featuredImage && (
        <CardMedia
          component="img"
          height="200"
          image={post.featuredImage}
          alt={post.title}
        />
      )}
      {!post.featuredImage && (
        <Box 
          sx={{ 
            height: 200, 
            background: theme.gradients.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', p: 2, textAlign: 'center' }}>
            {post.title}
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            icon={<CalendarIcon fontSize="small" />} 
            label={formatDate(post.publishedAt)} 
            size="small" 
            sx={{ mr: 1, mb: 1 }} 
          />
          <Chip 
            icon={<PersonIcon fontSize="small" />} 
            label={post.authorName} 
            size="small" 
            sx={{ mb: 1 }} 
          />
        </Box>
        
        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {post.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {getExcerpt(post.content)}
        </Typography>
        
        <Button 
          component={RouterLink} 
          to={`/blog/${post.slug}`}
          variant="text" 
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 'auto', alignSelf: 'flex-start', p: 0, '&:hover': { backgroundColor: 'transparent' } }}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );

  // Blog posts grid
  const BlogPostsGrid = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    if (posts.length === 0) {
      return (
        <Box sx={{ py: 4 }}>
          <Alert severity="info">No blog posts are currently available. Please check back later.</Alert>
        </Box>
      );
    }

    return (
      <Box sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <BlogPostCard post={post} />
            </Grid>
          ))}
        </Grid>
        
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <HeroSection />
      <Container maxWidth="lg">
        <BlogPostsGrid />
      </Container>
    </>
  );
};

export default BlogPage;
