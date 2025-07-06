import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  MenuItem
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, LocalHospital, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorSignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [workingDays, setWorkingDays] = useState([1,2,3,4,5,6]);
  const [workingStart, setWorkingStart] = useState('10:00');
  const [workingEnd, setWorkingEnd] = useState('16:00');
  const [consultationFee, setConsultationFee] = useState(500);
  const [meetingPlatform, setMeetingPlatform] = useState('google-meet');
  const [googleMeetEmail, setGoogleMeetEmail] = useState('');

  const specialities = ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Gynecology', 'General Medicine'];
  const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/doctors/register', {
        name,
        email,
        password,
        speciality,
        location,
        phone,
        bio,
        profileImage,
        workingDays,
        workingHours: { start: workingStart, end: workingEnd },
        consultationFee,
        meetingPlatform,
        googleMeetEmail
      });
      setSuccess(res.data.message || 'Registration successful!');
      setTimeout(() => navigate('/doctor/login'), 2000);
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
            <LocalHospital sx={{ fontSize: 50, color: '#8B5CF6', mb: 1 }} />
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
              Doctor Signup
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.8,
                fontWeight: 300
              }}
            >
              Create your doctor account
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
              label="Doctor Email Address"
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
            <TextField
              label="Speciality"
              type="text"
              fullWidth
              margin="normal"
              value={speciality}
              onChange={e => setSpeciality(e.target.value)}
              required
              placeholder="Enter your specialization (e.g., Cardiology, Neurology, etc.)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <TextField
              label="City / Location"
              type="text"
              fullWidth
              margin="normal"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              placeholder="Enter your city or location"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)' ,
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              margin="normal"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <TextField
              label="Bio"
              type="text"
              fullWidth
              margin="normal"
              value={bio}
              onChange={e => setBio(e.target.value)}
              multiline
              minRows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <TextField
              label="Profile Image URL"
              type="url"
              fullWidth
              margin="normal"
              value={profileImage}
              onChange={e => setProfileImage(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Working Start Time"
                type="time"
                value={workingStart}
                onChange={e => setWorkingStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Working End Time"
                type="time"
                value={workingEnd}
                onChange={e => setWorkingEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              label="Working Days (comma separated, 0=Sun, 1=Mon, ... 6=Sat)"
              type="text"
              fullWidth
              margin="normal"
              value={workingDays.join(',')}
              onChange={e => setWorkingDays(e.target.value.split(',').map(Number).filter(n => !isNaN(n)))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            
            {/* Consultation Fee */}
            <TextField
              label="Consultation Fee (₹)"
              type="number"
              fullWidth
              margin="normal"
              value={consultationFee}
              onChange={e => setConsultationFee(Number(e.target.value))}
              required
              InputProps={{
                startAdornment: <span style={{ color: '#8B5CF6', marginRight: '8px' }}>₹</span>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />

            {/* Meeting Platform Selection */}
            <TextField
              select
              label="Preferred Meeting Platform"
              fullWidth
              margin="normal"
              value={meetingPlatform}
              onChange={e => setMeetingPlatform(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#8B5CF6' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            >
              <MenuItem value="google-meet">Google Meet</MenuItem>
            </TextField>

            {/* Google Meet Email */}
            {(meetingPlatform === 'google-meet' || meetingPlatform === 'both') && (
              <TextField
                label="Google Meet Email (Optional)"
                type="email"
                fullWidth
                margin="normal"
                value={googleMeetEmail}
                onChange={e => setGoogleMeetEmail(e.target.value)}
                placeholder="Email associated with your Google Meet account"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': { color: '#8B5CF6' },
                  },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
              />
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
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  color: '#4caf50'
                }}
              >
                {success}
              </Alert>
            )}
          </form>
          <Box textAlign="center" sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.7, color: 'white' }}>
              Already have a doctor account?{' '}
              <Link
                onClick={() => navigate('/doctor/login')}
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
        </Box>
      </Container>
    </Box>
  );
};

export default DoctorSignupPage; 