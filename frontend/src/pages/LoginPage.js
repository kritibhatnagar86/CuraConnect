import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Link,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Lock, Email, Visibility, VisibilityOff, Security, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const steps = ['Enter Email', 'Verify OTP'];

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setOtpLoading(true);
    
    try {
      // Use test endpoint for development (no email required)
      const res = await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      
      setOtpSent(true);
      setActiveStep(1);
      setError('');
      
      // Show OTP in console for testing
      console.log('🧪 Test OTP:', res.data.otp);
      
      // Show OTP in alert for easy testing
      alert(`Test OTP: ${res.data.otp}\n\nThis is for development testing only.`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    setError('');
    setOtpLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });
      // Store token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // Redirect based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.data.user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

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
        <Button startIcon={<ArrowBack />} variant="outlined" sx={{ mb: 2, borderColor: '#8B5CF6', color: '#8B5CF6' }} onClick={() => navigate('/')}>Go Back</Button>
        <Box 
          sx={{
            background: 'rgba(26, 26, 26, 0.9)',
            borderRadius: 3,
            p: 4,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Header */}
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.8,
                fontWeight: 300
              }}
            >
              Access your healthcare management platform
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel 
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-active': {
                          color: '#8B5CF6',
                        },
                        '&.Mui-completed': {
                          color: '#8B5CF6',
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step 1: Email Input */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Enter your email to receive OTP
              </Typography>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: '#8B5CF6' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5CF6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8B5CF6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    color: '#ff6b6b'
                  }}
                >
                  {error}
                </Alert>
              )}

              <Button
                onClick={handleSendOTP}
                variant="contained"
                fullWidth
                size="large"
                disabled={otpLoading}
                sx={{ 
                  mt: 3,
                  bgcolor: '#8B5CF6',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: '#7C3AED',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(139, 92, 246, 0.5)',
                    transform: 'none'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {otpLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Box>
          )}

          {/* Step 2: OTP Verification */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Enter the OTP sent to {email}
              </Typography>
              <TextField
                label="OTP Code"
                type="text"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit OTP"
                InputProps={{
                  startAdornment: <Security sx={{ mr: 1, color: '#8B5CF6' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5CF6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8B5CF6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    color: '#ff6b6b'
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ 
                    flex: 1,
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                    color: '#8B5CF6',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      bgcolor: 'rgba(139, 92, 246, 0.1)'
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  variant="contained"
                  disabled={otpLoading}
                  sx={{ 
                    flex: 1,
                    bgcolor: '#8B5CF6',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: '#7C3AED',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(139, 92, 246, 0.5)',
                      transform: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {otpLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </Box>

              <Box textAlign="center" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.7, color: 'white' }}>
                  Didn't receive OTP?{' '}
                  <Link 
                    onClick={async () => {
                      try {
                        const res = await axios.post('http://localhost:5000/api/auth/test-otp', { email });
                        console.log('🧪 New Test OTP:', res.data.otp);
                        alert(`New Test OTP: ${res.data.otp}\n\nThis is for development testing only.`);
                      } catch (err) {
                        setError('Failed to resend OTP');
                      }
                    }}
                    sx={{ 
                      color: '#8B5CF6',
                      textDecoration: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#A855F7',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Resend OTP
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}

          <Box textAlign="center" sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.7, color: 'white' }}>
              Don't have an account?{' '}
              <Link
                onClick={() => navigate('/signup')}
                sx={{
                  color: '#8B5CF6',
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#A855F7',
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 