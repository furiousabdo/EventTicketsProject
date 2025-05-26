import React, { useEffect, useState } from 'react';
import { adminAPI, eventsAPI } from '../../utils/api';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Chip, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const buttonStyle = {
  background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
  border: 0,
  borderRadius: '25px',
  boxShadow: '0 3px 5px 2px rgba(106, 27, 154, 0.3)',
  color: 'white',
  height: 40,
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

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminAPI.getAllEvents();
        setEvents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateEventStatus(id, { status });
      setEvents((prev) => prev.map(e => e._id === id ? { ...e, status } : e));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteEvent = async (id) => {
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

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (status === 'all' || event.status === status)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3,
          fontWeight: 'bold'
        }}
      >
        Admin: Manage Events
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
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredEvents.length === 0 ? (
        <Alert severity="info">No events found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Organizer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.organizer?.name || 'N/A'}</TableCell>
                  <TableCell>{event.date && new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>${event.price}</TableCell>
                  <TableCell>{event.ticketsAvailable ?? event.totalTickets ?? '/'}</TableCell>
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
                      <Select
                        size="small"
                        value={event.status}
                        onChange={(e) => handleStatusChange(event._id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approve</MenuItem>
                        <MenuItem value="declined">Decline</MenuItem>
                      </Select>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteEvent(event._id)}
                        sx={{
                          ...buttonStyle,
                          background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                          }
                        }}
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

export default AdminEvents;