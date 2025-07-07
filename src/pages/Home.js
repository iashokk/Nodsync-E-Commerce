// src/pages/Home.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        Welcome to NS-E Commerce
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Find everything you need in one place
      </Typography>
      <Button
        component={RouterLink}
        to="/shop"
        variant="contained"
        size="large"
        sx={{ mt: 4, px: 4, py: 1.5 }}
      >
        Shop Now
      </Button>
    </Box>
  );
}
