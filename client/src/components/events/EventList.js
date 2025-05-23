import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../utils/api';
import { Container, Grid, TextField, Box, Typography, CircularProgress, Alert, Paper, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EventCard from './EventCard';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await eventsAPI.getAllEvents();
        setEvents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesTitle = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || event.status === status;
    const matchesDate = !date || (event.date && event.date.slice(0, 10) === date);
    return matchesTitle && matchesStatus && matchesDate;
  });

  if (!loading && events.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Welcome to EventHub!</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            There are currently no events. Once events are created, they will appear here for everyone to browse and book tickets.
          </Typography>
          {user && user.role === 'organizer' ? (
            <Button variant="contained" color="primary" onClick={() => navigate('/organizer/events/new')}>
              Create Your First Event
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              If you are an event organizer, log in or register as an organizer to add your first event!
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Upcoming Events</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search events"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 2 }}
        />
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={e => setStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="declined">Declined</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
        />
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredEvents.length === 0 ? (
        <Alert severity="info">No events found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredEvents.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EventList;