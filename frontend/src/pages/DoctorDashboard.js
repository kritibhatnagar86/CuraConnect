import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert as MuiAlert,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { MenuItem } from '@mui/material';
import { Google } from '@mui/icons-material';
import FileUpload from '../components/FileUpload';
import StarIcon from '@mui/icons-material/Star';
const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [meetingLinkDialog, setMeetingLinkDialog] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState('google-meet');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedAppointmentForFiles, setSelectedAppointmentForFiles] = useState(null);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [doctorReviews, setDoctorReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/doctor/login');
      return;
    }
    
    setDoctorName(user.name || 'Doctor');
    
    // Check for Google OAuth success message
    const urlParams = new URLSearchParams(window.location.search);
    const googleConnected = urlParams.get('googleConnected');
    const email = urlParams.get('email');
    const error = urlParams.get('error');
    
    if (googleConnected === 'true') {
      setSnackbar({ 
        open: true, 
        message: `Google Calendar connected successfully for ${email}!`, 
        severity: 'success' 
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (googleConnected === 'false') {
      setSnackbar({ 
        open: true, 
        message: error === 'oauth_failed' ? 'Google OAuth failed. Please try again.' : 'Google OAuth cancelled.', 
        severity: 'warning' 
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const fetchAppointments = async () => {
      try {
        const doctorId = user.id;
        if (!doctorId) return;
        const res = await axios.get(`http://localhost:5000/api/doctors/appointments?doctorId=${doctorId}`);
        setAppointments(res.data);
      } catch (err) {
        setAppointments([]);
      }
    };
    fetchAppointments();

    const fetchDoctorReviews = async () => {
      try {
        if (!user?.id) return;
        const res = await axios.get(`http://localhost:5000/api/reviews/doctor/${user.id}`);
        setDoctorReviews(res.data);
      } catch (err) {
        setDoctorReviews([]);
      }
    };
    fetchDoctorReviews();
  }, [navigate]);

  const handleUpdateMeetingLink = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/doctors/appointments/${selectedAppointment._id}/update-meeting-link`, {
        meetingLink,
        meetingPlatform
      });
      
      setSnackbar({ open: true, message: 'Meeting link updated successfully!', severity: 'success' });
      setMeetingLinkDialog(false);
      setSelectedAppointment(null);
      setMeetingLink('');
      
      // Refresh appointments
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;
      if (doctorId) {
        const appointmentsRes = await axios.get(`http://localhost:5000/api/doctors/appointments?doctorId=${doctorId}`);
        setAppointments(appointmentsRes.data);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update meeting link', severity: 'error' });
    }
  };

  const openMeetingLinkDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setMeetingLink(appointment.meetingLink || '');
    setMeetingPlatform(appointment.meetingPlatform || 'google-meet');
    setMeetingLinkDialog(true);
  };

  const handleGoogleAuth = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      window.location.href = `http://localhost:5000/api/google/auth/google?state=${user._id}`;
    } else {
      setSnackbar({ open: true, message: 'User ID not found', severity: 'error' });
    }
  };

  const handleViewFiles = (appointment) => {
    setSelectedAppointmentForFiles(appointment);
    setShowFilesDialog(true);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#18122B', mb: 4, boxShadow: 3 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/curaconnect-logo.png" alt="CuraConnect Logo" style={{ height: 40 }} />
            <Typography variant="h6" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
              {doctorName}'s Dashboard
            </Typography>
          </Box>
          <Button color="primary" variant="contained" onClick={() => {
            localStorage.removeItem('user');
            navigate('/doctor/login');
          }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} mb={4} sx={{ color: '#8B5CF6' }}>
            Welcome, {doctorName}
          </Typography>

          {/* Google Calendar Connection Section */}
          <Box mb={4} sx={{ bgcolor: '#1A1A1A', borderRadius: 3, p: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#8B5CF6' }}>
              Google Calendar Integration
            </Typography>
            <Typography variant="body2" color="white" mb={3} sx={{ opacity: 0.8 }}>
              Connect your Google Calendar to automatically generate Google Meet links for online consultations after payment.
            </Typography>
            <Button
              onClick={handleGoogleAuth}
              variant="outlined"
              startIcon={<Google />}
              sx={{ 
                borderColor: '#4285F4',
                color: '#4285F4',
                '&:hover': { 
                  borderColor: '#3367D6',
                  bgcolor: 'rgba(66, 133, 244, 0.1)'
                }
              }}
            >
              Authenticate with Google
            </Button>
          </Box>

          <Box mb={5} sx={{ bgcolor: '#1A1A1A', borderRadius: 3, p: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#8B5CF6' }}>
              My Appointments ({appointments.length})
            </Typography>
            {appointments.length === 0 ? (
              <Typography color="white">No appointments found.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2, bgcolor: '#18122B', width: '100%' }}>
                <Table sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#2D1B69' }}>
                      <TableCell sx={{ color: '#8B5CF6', fontWeight: 700 }}>Patient</TableCell>
                      <TableCell sx={{ color: '#8B5CF6', fontWeight: 700 }}>Date & Time</TableCell>
                      <TableCell sx={{ color: '#8B5CF6', fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ color: '#8B5CF6', fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appt, idx) => (
                      <TableRow key={idx} sx={{ bgcolor: '#1A1A1A', '&:hover': { bgcolor: '#2D1B69' } }}>
                        <TableCell sx={{ color: 'white' }}>
                          <Button
                            onClick={() => handleViewFiles(appt)}
                            sx={{
                              color: '#8B5CF6',
                              textDecoration: 'none',
                              textTransform: 'none',
                              fontSize: 'inherit',
                              fontWeight: 600,
                              p: 0,
                              minWidth: 'auto',
                              '&:hover': {
                                textDecoration: 'underline',
                                bgcolor: 'transparent'
                              }
                            }}
                          >
                            {appt.patient?.name || 'Unknown Patient'}
                          </Button>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {appt.patient?.email || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <Typography variant="body2">
                            {new Date(appt.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appt.start} - {appt.end}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Chip 
                              label={appt.consultationType || 'online'} 
                              size="small"
                              color={appt.consultationType === 'online' ? 'primary' : 'secondary'}
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                            <Chip 
                              label={appt.paymentStatus || 'pending'} 
                              size="small"
                              color={appt.paymentStatus === 'completed' ? 'success' : 'warning'}
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            {appt.meetingLink ? (
                              <Button
                                size="small"
                                variant="contained"
                                href={appt.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<VideocamIcon />}
                                sx={{
                                  bgcolor: '#8B5CF6',
                                  '&:hover': { bgcolor: '#7C3AED' },
                                  fontSize: '0.7rem',
                                  px: 1,
                                  py: 0.5
                                }}
                              >
                                Join
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => openMeetingLinkDialog(appt)}
                                startIcon={<VideocamIcon />}
                                sx={{
                                  color: '#8B5CF6',
                                  borderColor: '#8B5CF6',
                                  '&:hover': { borderColor: '#7C3AED' },
                                  fontSize: '0.7rem',
                                  px: 1,
                                  py: 0.5
                                }}
                              >
                                Add
                              </Button>
                            )}
                            
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewFiles(appt)}
                              startIcon={<AttachFileIcon />}
                              sx={{
                                color: '#8B5CF6',
                                borderColor: '#8B5CF6',
                                '&:hover': { borderColor: '#7C3AED' },
                                fontSize: '0.7rem',
                                px: 1,
                                py: 0.5
                              }}
                            >
                              Files
                            </Button>

                            {appt.meetingLink && (
                              <IconButton
                                size="small"
                                onClick={() => openMeetingLinkDialog(appt)}
                                sx={{ color: '#8B5CF6' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          <Box mb={5} sx={{ bgcolor: '#1A1A1A', borderRadius: 3, p: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#8B5CF6' }}>
              My Reviews
            </Typography>
            {doctorReviews.length === 0 ? (
              <Typography color="white">No reviews yet.</Typography>
            ) : (
              <Grid container spacing={2}>
                {doctorReviews.map((r, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Card sx={{ bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {[1,2,3,4,5].map(i => (
                            <StarIcon key={i} sx={{ color: i <= r.rating ? '#FFD700' : '#757575', fontSize: 18 }} />
                          ))}
                          <Typography variant="caption" sx={{ ml: 1, color: '#FFD700' }}>{r.rating}.0</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: 'white' }}>
                          {r.review || 'No comment provided.'}
                        </Typography>
                        <Divider sx={{ my: 1, bgcolor: '#2D1B69' }} />
                        <Typography variant="subtitle2" sx={{ color: '#8B5CF6' }}>
                          Anonymous Patient
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </Box>

      {/* Meeting Link Dialog */}
      <Dialog open={meetingLinkDialog} onClose={() => setMeetingLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6' }}>
          Update Meeting Link
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
          {selectedAppointment && (
            <Box>
              <Typography variant="h6" mb={2} color="#8B5CF6">
                Appointment with {selectedAppointment.patient?.name}
              </Typography>
              <Typography mb={1}>
                <strong>Date:</strong> {selectedAppointment.date}
              </Typography>
              <Typography mb={2}>
                <strong>Time:</strong> {selectedAppointment.start} - {selectedAppointment.end}
              </Typography>
              
              <TextField
                select
                label="Meeting Platform"
                fullWidth
                margin="normal"
                value={meetingPlatform}
                onChange={(e) => setMeetingPlatform(e.target.value)}
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

              <TextField
                label="Meeting Link"
                fullWidth
                margin="normal"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
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
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
          <Button onClick={() => setMeetingLinkDialog(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button onClick={handleUpdateMeetingLink} variant="contained" sx={{ bgcolor: '#8B5CF6' }}>
            Update Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Files Dialog */}
      <Dialog open={showFilesDialog} onClose={() => setShowFilesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6', borderBottom: '1px solid #2D1B69' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#8B5CF6', mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedAppointmentForFiles?.patient?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient Files & Documents
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white', p: 3 }}>
          {selectedAppointmentForFiles && (
            <Box>
              {/* Appointment Info */}
              <Card sx={{ bgcolor: '#18122B', mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon sx={{ color: '#8B5CF6', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Appointment: {new Date(selectedAppointmentForFiles.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedAppointmentForFiles.start} - {selectedAppointmentForFiles.end}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={selectedAppointmentForFiles.consultationType || 'online'} 
                    size="small"
                    color={selectedAppointmentForFiles.consultationType === 'online' ? 'primary' : 'secondary'}
                  />
                  <Chip 
                    label={selectedAppointmentForFiles.paymentStatus || 'pending'} 
                    size="small"
                    color={selectedAppointmentForFiles.paymentStatus === 'completed' ? 'success' : 'warning'}
                  />
                </Box>
              </Card>
              
              <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2 }}>
                Upload Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Patients can upload lab reports, prescriptions or images for consultation. You can also upload files as a doctor. You can download them too.
              </Typography>
              
              <FileUpload 
                appointmentId={selectedAppointmentForFiles._id}
                onFileUploaded={(file) => {
                  console.log('File uploaded:', file);
                }}
                onFileDeleted={(fileId) => {
                  console.log('File deleted:', fileId);
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1A1A1A', p: 2, borderTop: '1px solid #2D1B69' }}>
          <Button 
            onClick={() => setShowFilesDialog(false)} 
            sx={{ 
              color: 'white',
              borderColor: '#8B5CF6',
              '&:hover': { borderColor: '#7C3AED' }
            }}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DoctorDashboard; 