import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, Card, CardContent, CardActions, Grid, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await eventsAPI.getEvents();
        setEvents(res.data);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Events</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : events.length === 0 ? (
        <Alert severity="info">No events found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {events.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography>Date: {event.date && new Date(event.date).toLocaleDateString()}</Typography>
                  <Typography>Location: {event.location}</Typography>
                  <Typography>Price: ${event.price}</Typography>
                  <Typography>Tickets Available: {event.ticketsAvailable}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={RouterLink} to={`/events/${event._id}`}>View Details</Button>
                  <Button size="small" variant="contained" component={RouterLink} to={`/events/${event._id}?book=true`}>Book Tickets</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Events; 