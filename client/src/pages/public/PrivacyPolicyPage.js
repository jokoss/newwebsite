import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          This is a placeholder for the Privacy Policy page.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage;
