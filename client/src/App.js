import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              minHeight: '100vh',
              background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(98, 0, 234, 0.8)), url('/images/concert-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              color: 'white',
            }}
          >
            <Navbar />
            <Box
              component="main"
              sx={{
                minHeight: 'calc(100vh - 64px)',
                pt: 2,
                pb: 4,
              }}
            >
              <AppRoutes />
            </Box>
          </Box>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 