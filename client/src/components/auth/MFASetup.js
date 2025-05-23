import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import QRCode from 'qrcode.react';
import { authAPI } from '../../utils/api';
import { showToast } from '../../utils/toast';

const MFASetup = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    setupMFA();
  }, []);

  const setupMFA = async () => {
    try {
      setLoading(true);
      const response = await authAPI.setupMFA();
      setSecret(response.data.secret);
      setQrCode(response.data.qrCode);
    } catch (err) {
      setError('Failed to setup MFA');
      showToast.error('Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      await authAPI.verifyMFA(verificationCode);
      showToast.success('MFA setup completed successfully');
      setShowVerification(false);
      onComplete?.();
    } catch (err) {
      setError('Invalid verification code');
      showToast.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !qrCode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Setup Two-Factor Authentication
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" paragraph>
            1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </Typography>
          {qrCode && qrCode.startsWith('data:image') && (
            <Box sx={{ mb: 2 }}>
              <QRCode value={qrCode} size={200} />
            </Box>
          )}
          {qrCode && !qrCode.startsWith('data:image') && (
            <Alert severity="error">Invalid QR code data received from server.</Alert>
          )}
          <Typography variant="body1" paragraph>
            2. Enter the 6-digit code from your authenticator app
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowVerification(true)}
            disabled={loading}
          >
            Verify Setup
          </Button>
        </Box>

        <Dialog open={showVerification} onClose={() => setShowVerification(false)}>
          <DialogTitle>Verify MFA Setup</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Verification Code"
              type="text"
              fullWidth
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              inputProps={{ maxLength: 6 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowVerification(false)}>Cancel</Button>
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default MFASetup;