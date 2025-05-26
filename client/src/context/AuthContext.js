import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { showToast } from '../utils/toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (!response.data.requiresMFA) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        showToast.success('Login successful!');
      }
      return response;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const verifyMFA = async (tempToken, code) => {
    try {
      const response = await authAPI.verifyMFALogin(code, tempToken);
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      showToast.success('2FA verification successful!');
    } catch (error) {
      showToast.error(error.response?.data?.message || '2FA verification failed');
      throw error;
    }
  };

  const setupMFA = async () => {
    try {
      const response = await authAPI.setupMFA();
      return response.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to setup 2FA');
      throw error;
    }
  };

  const verifyMFASetup = async (code) => {
    try {
      await authAPI.verifyMFA(code);
      showToast.success('2FA setup completed successfully');
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to verify 2FA setup');
      throw error;
    }
  };

  const disableMFA = async () => {
    try {
      await authAPI.disableMFA();
      showToast.success('2FA disabled successfully');
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to disable 2FA');
      throw error;
    }
  };

  const register = async (name, email, password, role, organizerKey) => {
    try {
      const response = await authAPI.register(name, email, password, role, organizerKey);
      showToast.success('Registration successful! Please login.');
      return response;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore error, still clear local state
    }
    localStorage.removeItem('token');
    setUser(null);
    showToast.success('Logged out successfully');
  };

  const forgotPassword = async (email) => {
    try {
      console.log('Sending password reset request for:', email);
      const response = await authAPI.forgotPassword(email);
      showToast.success('OTP sent to your email');
      return response;
    } catch (error) {
      console.error('Password reset error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP';
      showToast.error(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await authAPI.resetPassword(email, otp, newPassword);
      showToast.success('Password reset successful');
      return response;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to reset password');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyMFA,
    setupMFA,
    verifyMFASetup,
    disableMFA
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;