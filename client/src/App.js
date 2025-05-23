import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import Layout from './components/layout/Layout';
import Home from './components/events/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventDetails from './components/events/EventDetails';
import CreateEvent from './components/organizer/CreateEvent';
import Profile from './components/profile/Profile';
import MyBookings from './components/bookings/MyBookings';
import AdminDashboard from './components/admin/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </Router>
        <ToastContainer position="top-right" autoClose={5000} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
