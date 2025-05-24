import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI } from '../../utils/api';
import { Paper, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const BookTicketForm = ({ event, onBookingSuccess }) => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const available = event.ticketsAvailable || 0;
  const price = event.price || 0;

  const handleQuantityChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    if (value > available) value = available;
    setQuantity(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Ensure quantity is a number
      const numQuantity = Number(quantity);
      if (isNaN(numQuantity) || numQuantity < 1) {
        throw new Error('Please enter a valid quantity');
      }
      if (numQuantity > available) {
        throw new Error('Not enough tickets available');
      }

      const response = await bookingsAPI.createBooking(event._id, { quantity: numQuantity });
      console.log('Booking response:', response); // Debug log
      setSuccess('Booking successful!');
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error('Booking error:', err); // Debug log
      setError(err.response?.data?.message || err.message || 'Booking failed');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!user) {
    return <Alert severity="info">Please log in to book tickets.</Alert>;
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Book Tickets</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1, max: available }}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <Typography variant="body2" sx={{ mb: 2 }}>
          Available: {available} | Price per ticket: ${price}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Total: ${quantity * price}
        </Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || available === 0}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Book Now'}
        </Button>
      </form>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Event: {event.title}</Typography>
          <Typography variant="body1">Quantity: {quantity}</Typography>
          <Typography variant="body1">Total: ${quantity * price}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleConfirmBooking}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BookTicketForm; 