import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  Person,
  AttachMoney,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openBooking, setOpenBooking] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingOpen = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    setOpenBooking(true);
  };

  const handleBookingClose = () => {
    setOpenBooking(false);
    setTicketCount(1);
  };

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      await axios.post('/api/bookings', {
        eventId: id,
        numberOfTickets: ticketCount,
      });
      toast.success('Booking successful!');
      handleBookingClose();
      fetchEventDetails(); // Refresh event details to update available tickets
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book tickets');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Event not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
                event.image || 'https://source.unsplash.com/random?event'
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: 300,
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ color: 'white' }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {event.title}
              </Typography>
              <Chip
                label={event.category}
                color="primary"
                sx={{ backgroundColor: 'white' }}
              />
            </Box>
          </Paper>

          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Event Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography>
                    {format(new Date(event.date), 'EEEE, MMMM d, yyyy h:mm a')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography>{event.venue}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1 }} />
                  <Typography>
                    {event.availableTickets} tickets available
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ mr: 1 }} />
                  <Typography>${event.price}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Book Tickets
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Price per ticket: ${event.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.availableTickets} tickets remaining
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleBookingOpen}
              disabled={event.availableTickets === 0}
            >
              {event.availableTickets === 0 ? 'Sold Out' : 'Book Now'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openBooking} onClose={handleBookingClose}>
        <DialogTitle>Book Tickets</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Number of Tickets"
              type="number"
              fullWidth
              value={ticketCount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0 && value <= event.availableTickets) {
                  setTicketCount(value);
                }
              }}
              InputProps={{ inputProps: { min: 1, max: event.availableTickets } }}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Total Price: ${(event.price * ticketCount).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingClose}>Cancel</Button>
          <Button
            onClick={handleBooking}
            variant="contained"
            disabled={bookingLoading}
          >
            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;
