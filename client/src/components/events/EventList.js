import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../utils/api';
import { Container, Grid, TextField, Box, Typography, CircularProgress, Alert, Paper, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EventCard from './EventCard';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Common button style matching login page
const buttonStyle = {
  background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
  border: 0,
  borderRadius: '25px',
  boxShadow: '0 3px 5px 2px rgba(106, 27, 154, 0.3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #9c27b0 30%, #6a1b9a 90%)',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 10px 2px rgba(106, 27, 154, 0.4)',
  }
};

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
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h4" gutterBottom 
            sx={{
              background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            Welcome to EventHub!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            There are currently no events. Once events are created, they will appear here for everyone to browse and book tickets.
          </Typography>
          {user && user.role === 'organizer' ? (
            <Button 
              variant="contained" 
              onClick={() => navigate('/organizer/events/new')}
              sx={buttonStyle}
            >
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
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3
        }}
      >
        Upcoming Events
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <TextField
          label="Search events"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ 
            flex: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#9c27b0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6a1b9a',
              }
            }
          }}
        />
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={e => setStatus(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9c27b0',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6a1b9a',
              }
            }}
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
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#9c27b0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6a1b9a',
              }
            }
          }}
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
              <EventCard event={event} buttonStyle={buttonStyle} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EventList;