import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Chip, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

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

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (status === 'all' || event.status === status)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Admin: Manage Events</Typography>
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
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredEvents.length === 0 ? (
        <Alert severity="info">No events found.</Alert>
      ) : (
        <TableContainer component={Paper}>
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
                <TableCell>Change Status</TableCell>
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
                    <Chip label={event.status} color={event.status === 'approved' ? 'success' : event.status === 'pending' ? 'warning' : 'error'} />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={event.status}
                        label="Status"
                        onChange={e => handleStatusChange(event._id, e.target.value)}
                      >
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="declined">Declined</MenuItem>
                      </Select>
                    </FormControl>
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