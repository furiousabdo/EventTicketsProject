import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../utils/api';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Chip, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

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

const UserBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await bookingsAPI.getMyBookings();
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.cancelBooking(id);
      setBookings((prev) => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings
    .filter(booking => 
      (status === 'all' || booking.status === status) &&
      booking.event?.title.toLowerCase().includes(search.toLowerCase())
    );

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.event?.date) - new Date(a.event?.date);
    }
    return 0;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

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
        My Bookings
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
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
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
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
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
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {sortedBookings.length === 0 ? (
        <Alert severity="info">No bookings found</Alert>
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
                <TableCell>Event</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.event?.title}</TableCell>
                  <TableCell>{booking.event?.date ? format(new Date(booking.event.date), 'PPP') : ''}</TableCell>
                  <TableCell>{booking.event?.location}</TableCell>
                  <TableCell>{booking.quantity}</TableCell>
                  <TableCell>${booking.totalPrice}</TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.status} 
                      color={booking.status === 'confirmed' ? 'success' : 'error'}
                      sx={{
                        background: booking.status === 'confirmed' 
                          ? 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)'
                          : 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {booking.status === 'confirmed' && (
                        <Button 
                          variant="contained" 
                          color="error" 
                          size="small" 
                          onClick={() => handleCancelBooking(booking._id)}
                          sx={{
                            ...buttonStyle,
                            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      )}
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

export default UserBookings; 