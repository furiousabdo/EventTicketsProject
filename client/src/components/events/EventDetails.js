import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';
import { Container, Grid, Paper, Typography, Box, Button, CircularProgress, Alert, Divider, Chip } from '@mui/material';
import BookTicketForm from '../bookings/BookTicketForm';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await eventsAPI.getEvent(id);
        setEvent(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this event: ${event.title}`;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: shareUrl
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!event) return <Alert severity="info">Event not found.</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <img
              src={event.imageUrl || 'https://source.unsplash.com/featured/?concert,event'}
              alt={event.title}
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>{event.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip
                label={event.status}
                color={event.status === 'approved' ? 'success' : event.status === 'pending' ? 'warning' : 'error'}
                size="small"
                sx={{ mr: 1 }}
              />
              <Tooltip title="Share Event">
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>{event.description}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">Date: {event.date && new Date(event.date).toLocaleDateString()}</Typography>
            <Typography variant="body2">Location: {event.location}</Typography>
            <Typography variant="body2">Price: ${event.price}</Typography>
            <Typography variant="body2">Available Tickets: {event.availableTickets}</Typography>
            <Box sx={{ mt: 2 }}>
              {event.status === 'approved' && <BookTicketForm event={event} />}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/events')}>Back to Events</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventDetails;