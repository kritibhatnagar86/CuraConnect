import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { CheckCircle, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const executePayment = async () => {
      try {
        const paymentId = searchParams.get('paymentId');
        const payerId = searchParams.get('PayerID');
        const appointmentId = searchParams.get('appointmentId');

        if (!paymentId || !payerId || !appointmentId) {
          setError('Missing payment information');
          setLoading(false);
          return;
        }

        // Execute the payment
        const response = await axios.post('http://localhost:5000/api/doctors/execute-payment', {
          paymentId,
          payerId,
          appointmentId
        });

        if (response.data.message === 'Payment completed successfully') {
          setSuccess(true);
        } else {
          setError('Payment execution failed');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Payment execution failed');
      } finally {
        setLoading(false);
      }
    };

    executePayment();
  }, [searchParams]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #2D1B69 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Box textAlign="center">
            <CircularProgress sx={{ color: '#8B5CF6', mb: 2 }} />
            <Typography variant="h6" color="white">
              Processing your payment...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

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
          {success ? (
            <>
              <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h4" color="white" gutterBottom>
                Payment Successful!
              </Typography>
              <Typography variant="body1" color="white" sx={{ mb: 3 }}>
                Your appointment has been confirmed and payment has been processed successfully.
              </Typography>
              <Alert severity="success" sx={{ mb: 3 }}>
                You will receive a confirmation email with meeting details shortly.
              </Alert>
            </>
          ) : (
            <>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Typography variant="h5" color="white" gutterBottom>
                Payment Failed
              </Typography>
              <Typography variant="body1" color="white" sx={{ mb: 3 }}>
                There was an issue processing your payment. Please try again.
              </Typography>
            </>
          )}

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

export default PaymentSuccessPage; 