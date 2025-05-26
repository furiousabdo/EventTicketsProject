import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { MusicNote as MusicNoteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const MFAVerification = ({ onSuccess, tempToken }) => {
  const theme = useTheme();
  const { verifyMFA } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyMFA(tempToken, code);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
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
              Two-Factor Authentication
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
            Enter the verification code from your authenticator app to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default MFAVerification;