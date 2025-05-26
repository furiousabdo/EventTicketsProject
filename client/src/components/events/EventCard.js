import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';

const EventCard = ({ event, buttonStyle }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <CardMedia
        component="img"
        height="180"
        image={event.imageUrl || 'https://source.unsplash.com/featured/?concert,event'}
        alt={event.title}
        sx={{ borderRadius: '15px 15px 0 0' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div"
          sx={{
            background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
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
          Price: ${event.price} | Available Tickets: {event.ticketsAvailable} / {event.totalTickets}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleClick}
          sx={buttonStyle}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default EventCard;