import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Videocam as VideoIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import FileUpload from './FileUpload';

const AppointmentDetailsModal = ({ open, onClose, appointment }) => {
  if (!appointment) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1A1A1A',
          color: 'white',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6', borderBottom: '1px solid #2D1B69' }}>
        <Typography variant="h5" fontWeight={700}>
          Appointment Details
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Doctor Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2, display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Doctor Information
              </Typography>
              
              <Box sx={{ bgcolor: '#18122B', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  {appointment.doctor?.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                  <Typography variant="body2" color="text.secondary">
                    {appointment.doctor?.speciality}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                  <Typography variant="body2" color="text.secondary">
                    {appointment.doctor?.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                  <Typography variant="body2" color="text.secondary">
                    {appointment.doctor?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Patient Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2, display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Patient Information
              </Typography>
              
              <Box sx={{ bgcolor: '#18122B', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  {appointment.patient?.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                  <Typography variant="body2" color="text.secondary">
                    {appointment.patient?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Appointment Details */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2, display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1 }} />
                Appointment Details
              </Typography>
              
              <Box sx={{ bgcolor: '#18122B', p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                      <Typography variant="body2" color="text.secondary">
                        Date: {formatDate(appointment.date)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                      <Typography variant="body2" color="text.secondary">
                        Time: {formatTime(appointment.start)} - {formatTime(appointment.end)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <VideoIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                      <Typography variant="body2" color="text.secondary">
                        Type: {appointment.consultationType}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PaymentIcon sx={{ mr: 1, fontSize: 16, color: '#8B5CF6' }} />
                      <Typography variant="body2" color="text.secondary">
                        Fee: ₹{appointment.amount}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Status: ${appointment.status}`}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                  <Chip 
                    label={`Payment: ${appointment.paymentStatus}`}
                    color={getPaymentStatusColor(appointment.paymentStatus)}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Meeting Link */}
          {appointment.meetingLink && (
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2, display: 'flex', alignItems: 'center' }}>
                  <VideoIcon sx={{ mr: 1 }} />
                  Meeting Link
                </Typography>
                
                <Box sx={{ bgcolor: '#18122B', p: 2, borderRadius: 2 }}>
                  <Button
                    variant="contained"
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<VideoIcon />}
                    sx={{
                      bgcolor: '#8B5CF6',
                      '&:hover': { bgcolor: '#7C3AED' }
                    }}
                  >
                    Join Meeting
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}

          {/* File Upload Section */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2 }}>
                Upload Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload lab reports, prescriptions, or images for your consultation.
              </Typography>
              
              <FileUpload 
                appointmentId={appointment._id}
                onFileUploaded={(file) => {
                  console.log('File uploaded:', file);
                }}
                onFileDeleted={(fileId) => {
                  console.log('File deleted:', fileId);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ bgcolor: '#18122B', p: 2, borderTop: '1px solid #2D1B69' }}>
        <Button 
          onClick={onClose}
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
  );
};

export default AppointmentDetailsModal; 