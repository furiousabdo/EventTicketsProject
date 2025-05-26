import React from 'react';
import { Container, Paper, Box, Typography, useTheme } from '@mui/material';

const PageContainer = ({ children, title, maxWidth = 'lg', elevation = 2 }) => {
  const theme = useTheme();

  return (
    <Container maxWidth={maxWidth}>
      <Box
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {title && (
          <Typography
            variant="h1"
            component="h1"
            sx={{
              mb: 4,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {title}
          </Typography>
        )}
        <Paper
          elevation={elevation}
          sx={{
            p: 4,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          }}
        >
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default PageContainer; 