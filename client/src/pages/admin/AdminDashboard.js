import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../utils/api';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Category as CategoryIcon,
  Science as ScienceIcon,
  VerifiedUser as CertificationIcon,
  People as PeopleIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Custom statistic card component
const StatCard = ({ icon, title, value, color, description }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        boxShadow: 3,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    categoriesCount: 0,
    testsCount: 0,
    certificationsCount: 0,
  });
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, isAdmin } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard data from the API
        const response = await api.get('/admin/dashboard');
        
        if (response.data.success) {
          setStats(response.data.stats);
          setRecentTests(response.data.recentTests);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {currentUser?.name || currentUser?.username || 'Admin'}!
        </Typography>
      </Box>

      {/* Statistics cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<CategoryIcon fontSize="medium" />}
            title="Categories"
            value={stats.categoriesCount}
            color="primary"
            description="Total service categories"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<ScienceIcon fontSize="medium" />}
            title="Tests"
            value={stats.testsCount}
            color="secondary"
            description="Available testing services"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<CertificationIcon fontSize="medium" />}
            title="Certifications"
            value={stats.certificationsCount}
            color="success"
            description="Available certifications"
          />
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink}
              to="/admin/categories"
            >
              Manage Categories
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="secondary" 
              component={RouterLink}
              to="/admin/tests"
            >
              Manage Tests
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="success" 
              component={RouterLink}
              to="/admin/certifications"
            >
              Manage Certifications
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent tests */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recently Added Tests
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {recentTests.length > 0 ? (
          <List>
            {recentTests.map((test) => (
              <React.Fragment key={test.id}>
                <ListItem>
                  <ListItemText
                    primary={test.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {test.category}
                        </Typography>
                        {` — $${test.price} • Added on ${test.createdAt}`}
                      </>
                    }
                  />
                  <Button 
                    variant="outlined" 
                    size="small"
                    component={RouterLink}
                    to={`/admin/tests?id=${test.id}`}
                  >
                    Edit
                  </Button>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No tests have been added recently.
          </Typography>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            color="primary" 
            component={RouterLink}
            to="/admin/tests"
          >
            View All Tests
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
