import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/api';
import { showToast } from '../../utils/toast';
import MFASetup from '../auth/MFASetup';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setProfileLoading(true);
    setError('');
    setSuccess('');
    try {
      await userAPI.updateProfile({
        name: profileForm.name,
        email: profileForm.email
      });
      setSuccess('Profile updated successfully');
      showToast.success('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      showToast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPwError('');
    setPwSuccess('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await userAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPwSuccess('Password changed successfully!');
      showToast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
      showToast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleMFASetup = () => {
    setShowMFASetup(true);
  };

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    showToast.success('MFA setup completed successfully');
  };

  if (!user) return <Alert severity="info">Please log in to view your profile.</Alert>;

  if (showMFASetup) {
    return <MFASetup onComplete={handleMFASetupComplete} />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>My Profile</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Profile Information</Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <form onSubmit={handleProfileSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={profileLoading}
                sx={{ mt: 2 }}
              >
                {profileLoading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Security</Typography>
            
            {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}
            {pwSuccess && <Alert severity="success" sx={{ mb: 2 }}>{pwSuccess}</Alert>}
            
            <form onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={passwordLoading}
                sx={{ mt: 2 }}
              >
                {passwordLoading ? <CircularProgress size={24} /> : 'Change Password'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add an extra layer of security to your account by enabling two-factor authentication.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleMFASetup}
              sx={{ mt: 1 }}
            >
              Setup Two-Factor Authentication
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;