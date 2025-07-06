import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { Cancel, ArrowBack } from '@mui/icons-material';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #2D1B69 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'rgba(26, 26, 26, 0.9)',
            borderRadius: 3,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Cancel sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
          <Typography variant="h4" color="white" gutterBottom>
            Payment Cancelled
          </Typography>
          <Typography variant="body1" color="white" sx={{ mb: 3 }}>
            Your payment was cancelled. You can try booking the appointment again.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/patient/dashboard')}
              sx={{
                bgcolor: '#8B5CF6',
                color: 'white',
                '&:hover': {
                  bgcolor: '#7C3AED'
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentCancelPage; 