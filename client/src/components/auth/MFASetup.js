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
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';

const MFASetup = ({ onComplete }) => {
  const { setupMFA, verifyMFASetup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    initSetupMFA();
  }, []);

  const initSetupMFA = async () => {
    try {
      setLoading(true);
      const data = await setupMFA();
      setSecret(data.secret);
      setQrCode(data.qrCode);
    } catch (err) {
      setError('Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      await verifyMFASetup(verificationCode);
      setShowVerification(false);
      onComplete?.();
    } catch (err) {
      setError('Invalid verification code');
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
          {qrCode && (
            <Box sx={{ mb: 2 }}>
              <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200 }} />
            </Box>
          )}
          <Typography variant="body2" color="textSecondary" paragraph>
            Or manually enter this code in your authenticator app: {secret}
          </Typography>
          <Typography variant="body1" paragraph>
            2. Enter the 6-digit code from your authenticator app to verify setup
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
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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