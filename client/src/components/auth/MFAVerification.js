import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { authAPI } from '../../utils/api';
import { showToast } from '../../utils/toast';

const MFAVerification = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authAPI.verifyMFALogin(code);
      showToast.success('MFA verification successful');
      onSuccess?.();
    } catch (err) {
      setError('Invalid verification code');
      showToast.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Two-Factor Authentication
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleVerify}>
            <Typography variant="body1" paragraph>
              Please enter the 6-digit code from your authenticator app
            </Typography>
            
            <TextField
              fullWidth
              label="Verification Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              margin="normal"
              required
              inputProps={{ maxLength: 6 }}
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default MFAVerification;