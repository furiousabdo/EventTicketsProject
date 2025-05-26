import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import DeleteIcon from '@mui/icons-material/Delete';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await eventsAPI.getMyEvents();
        setEvents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = (id) => {
    navigate(`/organizer/events/edit/${id}`);
  };

  const handleAnalytics = (id) => {
    navigate(`/organizer/events/${id}/analytics`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventsAPI.deleteEvent(id);
      setEvents((prev) => prev.filter(e => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>My Events</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate('/organizer/events/new')}>Create New Event</Button>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : events.length === 0 ? (
        <Alert severity="info">No events created yet.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.date && new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>${event.price}</TableCell>
                  <TableCell>{Number(event.ticketsAvailable) || 0} / {Number(event.totalTickets) || 0}</TableCell>
                  <TableCell>
                    <Chip 
                      label={event.status} 
                      color={event.status === 'approved' ? 'success' : event.status === 'pending' ? 'warning' : 'error'}
                      sx={{
                        background: event.status === 'approved' 
                          ? 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)'
                          : event.status === 'pending'
                          ? 'linear-gradient(45deg, #ed6c02 30%, #ff9800 90%)'
                          : 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />} 
                        onClick={() => handleEdit(event._id)} 
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<BarChartIcon />} 
                        onClick={() => handleAnalytics(event._id)} 
                        color="secondary"
                      >
                        Analytics
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(event._id)}
                        color="error"
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyEvents;