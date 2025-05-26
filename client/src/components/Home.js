import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => (
  <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant="h3" gutterBottom>
      Welcome to the Event Tickets System
    </Typography>
    <Typography variant="h6" color="text.secondary" paragraph>
      Discover, book, and manage tickets for the best events in town. Whether you're an attendee, organizer, or admin, everything you need is here!
    </Typography>
    <Box sx={{ mt: 4 }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={RouterLink}
        to="/events"
        sx={{ mr: 2 }}
      >
        Browse Events
      </Button>
      <Button
        variant="outlined"
        color="primary"
        size="large"
        component={RouterLink}
        to="/register"
        sx={{ mr: 2 }}
      >
        Register
      </Button>
      <Button
        variant="text"
        color="secondary"
        size="large"
        component={RouterLink}
        to="/login"
      >
        Login
      </Button>
    </Box>
  </Container>
);

export default Home; 