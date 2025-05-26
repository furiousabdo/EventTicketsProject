import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import EventList from '../components/events/EventList';
import EventDetails from '../components/events/EventDetails';
import UserBookings from '../components/bookings/UserBookings';
import EventForm from '../components/organizer/EventForm';
import MyEvents from '../components/organizer/MyEvents';
import EventAnalytics from '../components/organizer/EventAnalytics';
import AdminEvents from '../components/admin/AdminEvents';
import AdminUsers from '../components/admin/AdminUsers';
import Profile from '../components/profile/Profile';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<EventList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/events/:id" element={<EventDetails />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <UserBookings />
          </ProtectedRoute>
        }
      />

      {/* Organizer Routes */}
      <Route
        path="/organizer/events"
        element={
          <ProtectedRoute roles={['organizer']}>
            <MyEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events/new"
        element={
          <ProtectedRoute roles={['organizer']}>
            <EventForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events/edit/:id"
        element={
          <ProtectedRoute roles={['organizer']}>
            <EventForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events/:id/analytics"
        element={
          <ProtectedRoute roles={['organizer']}>
            <EventAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 