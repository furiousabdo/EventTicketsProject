import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <CardMedia
        component="img"
        height="180"
        image={event.imageUrl || 'https://source.unsplash.com/featured/?concert,event'}
        alt={event.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {event.title}
        </Typography>
        <Chip
          label={event.status}
          color={event.status === 'approved' ? 'success' : event.status === 'pending' ? 'warning' : 'error'}
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {event.date && new Date(event.date).toLocaleDateString()}<br />
          {event.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${event.price} | Tickets: {event.availableTickets}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button variant="contained" fullWidth onClick={handleClick}>
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default EventCard;