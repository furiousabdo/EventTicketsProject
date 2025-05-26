import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // User's role is not authorized, redirect to home page
    return <Navigate to="/" replace />;
  }

  // Authorized, render component
  return children;
};

export default ProtectedRoute;