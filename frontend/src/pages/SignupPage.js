import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role: 'patient'
      });
      setSuccess(res.data.message || 'Registration successful! Please check your email for the OTP.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              Create Account
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.8,
                fontWeight: 300
              }}
            >
              Sign up to access your healthcare platform
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: '#8B5CF6' }} />,
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
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: '#8B5CF6' }} />,
                endAdornment: (
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      minWidth: 'auto',
                      color: '#8B5CF6',
                      '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.1)' }
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
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
            {success && (
              <Alert
                severity="success"
                sx={{
                  mt: 2,
                  bgcolor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid #8B5CF6',
                  color: '#8B5CF6'
                }}
              >
                {success}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Already have an account?{' '}
                <Link
                  onClick={() => navigate('/login')}
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
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage; 