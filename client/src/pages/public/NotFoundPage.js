import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 2,
            maxWidth: '600px',
            width: '100%'
          }}
        >
          <Typography
            variant="h1"
            color="primary"
            sx={{
              fontSize: { xs: '5rem', md: '8rem' },
              fontWeight: 700,
              mb: 2
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 2,
              fontWeight: 500
            }}
          >
            Page Not Found
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ px: 3, py: 1.2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
