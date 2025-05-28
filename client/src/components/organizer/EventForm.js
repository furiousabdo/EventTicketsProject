import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';
import { Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';

const EventForm = () => {
  const { id } = useParams(); // If editing, id will be present
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    totalTickets: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(form.imageUrl || null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      eventsAPI.getEvent(id)
        .then(res => {
          const e = res.data;
          setForm({
            title: e.title,
            description: e.description,
            date: e.date ? e.date.substring(0, 16) : '',
            location: e.location,
            price: e.price,
            totalTickets: e.totalTickets,
            imageUrl: e.imageUrl || ''
          });
        })
        .catch(() => setError('Failed to load event'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate totalTickets
    const totalTicketsNum = Number(form.totalTickets);
    if (!form.totalTickets || isNaN(totalTicketsNum) || totalTicketsNum < 0) {
      setError('Total tickets must be a valid positive number');
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('date', form.date);
    formData.append('location', form.location);
    formData.append('price', form.price);
    formData.append('totalTickets', totalTicketsNum);
    
    if (image) {
      formData.append('image', image);
    } else if (form.imageUrl) {
      formData.append('imageUrl', form.imageUrl);
    }

    try {
      if (id) {
        const response = await eventsAPI.updateEvent(id, formData);
        setSuccess('Event updated successfully!');
      } else {
        const response = await eventsAPI.createEvent(formData);
        setSuccess('Event created successfully!');
        setForm({
          title: '',
          description: '',
          date: '',
          location: '',
          price: '',
          totalTickets: '',
          imageUrl: ''
        });
        setImage(null);
        setPreviewUrl(null);
      }
      setTimeout(() => navigate('/organizer/events'), 1200);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>{id ? 'Edit Event' : 'Create Event'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date & Time"
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Tickets"
            name="totalTickets"
            type="number"
            value={form.totalTickets}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL (optional)"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {previewUrl && <img src={previewUrl} alt="Event preview" style={{ width: 100, height: 100, marginRight: 16 }} />}
            <Button variant="outlined" component="label">
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : id ? 'Update Event' : 'Create Event'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EventForm;