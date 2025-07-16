import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const TermsOfUsePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Terms of Use
        </Typography>
        <Typography variant="body1" paragraph>
          This is a placeholder for the Terms of Use page.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfUsePage;
