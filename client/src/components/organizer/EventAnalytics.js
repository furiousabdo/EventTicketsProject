import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Grid, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EventAnalytics = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [eventRes, analyticsRes] = await Promise.all([
          eventsAPI.getEvent(id),
          eventsAPI.getEventAnalytics(id)
        ]);
        setEvent(eventRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!event || !analytics) return <Alert severity="info">No analytics data found.</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Event Analytics: {event.title}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Total Bookings</Typography>
              <Typography variant="h4">{analytics.totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Available Tickets</Typography>
              <Typography variant="h4">{analytics.ticketsAvailable} / {analytics.totalTickets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Total Revenue</Typography>
              <Typography variant="h4">${analytics.totalRevenue}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Booking Status Distribution</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.statusDistribution}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analytics.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Revenue Overview</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.revenueByDay}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">Other Stats</Typography>
        <Typography variant="body2">Average Tickets per Booking: {analytics.avgTicketsPerBooking}</Typography>
        <Typography variant="body2">Booking Conversion Rate: {analytics.conversionRate}%</Typography>
        <Typography variant="body2">Days Until Event: {analytics.daysUntilEvent}</Typography>
      </Box>
    </Container>
  );
};

export default EventAnalytics;