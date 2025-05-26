import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { MusicNote as MusicNoteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const theme = useTheme();
  const { forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Attempting to send OTP to:', email);
      await forgotPassword(email);
      setOtpSent(true);
      setSuccess(true);
    } catch (err) {
      console.error('OTP send error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP';
      setError(errorMessage);
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await resetPassword(email, otp, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <MusicNoteIcon
              sx={{
                fontSize: 40,
                mr: 1,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              {otpSent ? 'Reset Password' : 'Forgot Password'}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            {otpSent
              ? 'Enter the OTP sent to your email and set your new password.'
              : 'Enter your email address to receive a password reset OTP.'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && !otpSent && (
            <Alert severity="success" sx={{ mb: 2 }}>
              OTP sent to your email. Please check your inbox.
            </Alert>
          )}

          {success && otpSent && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset successful! You can now login with your new password.
            </Alert>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOTP}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <TextField
                fullWidth
                label="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                required
                inputProps={{
                  maxLength: 6,
                  pattern: '[0-9]*',
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  },
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Remember your password?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;