import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Chip,
  Link,
  FormControl,
  InputLabel,
  Select,
  Stack
} from '@mui/material';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import PaymentIcon from '@mui/icons-material/Payment';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ReviewModal from '../components/ReviewModal';
import FileUpload from '../components/FileUpload';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [speciality, setSpeciality] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [appointments, setAppointments] = useState([]);
  const [consultationType, setConsultationType] = useState('online');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [doctorReviews, setDoctorReviews] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDoctor, setReviewDoctor] = useState(null);
  const [reviewAppointment, setReviewAppointment] = useState(null);
  const [reviewedAppointments, setReviewedAppointments] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [doctorProfileReviews, setDoctorProfileReviews] = useState([]);
  const [showDoctorProfileReviews, setShowDoctorProfileReviews] = useState(false);
  const [doctorProfileName, setDoctorProfileName] = useState('');
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [fileUploadAppointment, setFileUploadAppointment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setPatientName(user.name || 'Patient');
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
        setFilteredDoctors(res.data);
        setSpecialities([...new Set(res.data.map(doc => doc.speciality))]);
        setLocations([...new Set(res.data.map(doc => doc.location))]);
      } catch (err) {
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();

    const fetchAppointments = async () => {
      try {
        const patientId = user.id;
        if (!patientId) return;
        const res = await axios.get(`http://localhost:5000/api/doctors/appointments?patientId=${patientId}`);
        setAppointments(res.data);
      } catch (err) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [navigate]);

  useEffect(() => {
    const fetchAllDoctorReviews = async () => {
      try {
        const reviewMap = {};
        for (const doc of doctors) {
          const res = await axios.get(`http://localhost:5000/api/reviews/doctor/${doc._id}`);
          const reviews = res.data;
          const avg = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
          reviewMap[doc._id] = { avg, count: reviews.length };
        }
        setDoctorReviews(reviewMap);
      } catch (err) {
        // ignore
      }
    };
    if (doctors.length) fetchAllDoctorReviews();
  }, [doctors]);

  useEffect(() => {
    const fetchReviewed = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const res = await axios.get(`http://localhost:5000/api/reviews/mine?patientId=${user.id}`);
      setReviewedAppointments(res.data.map(r => r.appointment));
      setMyReviews(res.data);
    };
    fetchReviewed();
  }, [appointments]);

  const handleFilter = () => {
    let filtered = doctors;
    if (speciality) filtered = filtered.filter(doc => doc.speciality === speciality);
    if (location) filtered = filtered.filter(doc => doc.location === location);
    if (date) {
      filtered = filtered.filter(doc =>
        Array.isArray(doc.nextAvailableSlots) &&
        doc.nextAvailableSlots.some(slot => slot.date === date)
      );
    }
    setFilteredDoctors(filtered);
  };

  const handleBookClick = (doctor, slot) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(slot);
    setConfirmOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedSlot) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const patientId = user?.id;
      if (!patientId) throw new Error('User not logged in');
      
      const res = await axios.post('http://localhost:5000/api/doctors/appointments', {
        doctorId: selectedDoctor._id,
        patientId,
        date: selectedSlot.date,
        start: selectedSlot.start,
        end: selectedSlot.end,
        consultationType
      });
      
      if (res.data.payment) {
        setPaymentDetails(res.data.payment);
        setShowPaymentDialog(true);
      } else {
        setSnackbar({ open: true, message: 'Appointment booked successfully!', severity: 'success' });
      }
      
      // Refresh doctors list to update slot availability
      const doctorsRes = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(doctorsRes.data);
      setFilteredDoctors(doctorsRes.data);
      
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Booking failed', severity: 'error' });
    }
    setConfirmOpen(false);
  };

  const handlePaymentSuccess = async (paymentId, payerId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/doctors/execute-payment', {
        paymentId,
        payerId,
        appointmentId: paymentDetails.appointmentId
      });
      
      setSnackbar({ open: true, message: 'Payment successful! Appointment confirmed.', severity: 'success' });
      setShowPaymentDialog(false);
      setPaymentDetails(null);
      
      // Refresh appointments
      const user = JSON.parse(localStorage.getItem('user'));
      const patientId = user?.id;
      if (patientId) {
        const appointmentsRes = await axios.get(`http://localhost:5000/api/doctors/appointments?patientId=${patientId}`);
        setAppointments(appointmentsRes.data);
      }
      
      // Refresh doctors list to update slot availability
      const doctorsRes = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(doctorsRes.data);
      setFilteredDoctors(doctorsRes.data);
      
    } catch (err) {
      setSnackbar({ open: true, message: 'Payment execution failed', severity: 'error' });
    }
  };

  const handlePayment = () => {
    if (paymentDetails && paymentDetails.approval_url) {
      // Redirect to PayPal for payment
      window.location.href = paymentDetails.approval_url;
    } else {
      setSnackbar({ open: true, message: 'Payment URL not available', severity: 'error' });
    }
  };

  const handleCancelBooking = () => {
    setConfirmOpen(false);
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  const handleDoctorClick = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleViewDoctorReviews = async (doctor) => {
    if (doctor?._id) {
      setDoctorProfileName(doctor.name);
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/doctor/${doctor._id}`);
        setDoctorProfileReviews(res.data);
        setShowDoctorProfileReviews(true);
      } catch (err) {
        setDoctorProfileReviews([]);
        setShowDoctorProfileReviews(true);
      }
    }
  };

  const handleUploadFiles = (appointment) => {
    setFileUploadAppointment(appointment);
    setShowFileUploadDialog(true);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#18122B', mb: 4, boxShadow: 3, minHeight: 72 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 72 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/curaconnect-logo.png" alt="CuraConnect Logo" style={{ height: 56 }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {patientName ? `${patientName}'s Dashboard` : 'Patient Dashboard'}
            </Typography>
          </Box>
          <Button color="primary" variant="contained" onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{
        minHeight: '100vh',
        py: 6,
        bgcolor: 'background.default'
      }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} mb={4} color="white">
            Welcome, {patientName}
          </Typography>
          {/* Appointments Table */}
          <Box mb={5} sx={{ bgcolor: '#1A1A1A', borderRadius: 3, p: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#8B5CF6' }}>
              My Appointments
            </Typography>
            {appointments.length === 0 ? (
              <Typography color="white">No appointments found.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2, bgcolor: '#18122B', width: '100%' }}>
                <Table sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#2D1B69' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Doctor</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Speciality</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Date & Time</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Type</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Payment</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Meeting Link</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, px: 3, py: 2 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appt, idx) => (
                      <TableRow key={idx} sx={{ bgcolor: '#1A1A1A', '&:hover': { bgcolor: '#2D1B69' } }}>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', px: 3, py: 2 }}>
                          <Button
                            onClick={() => handleDoctorClick(appt)}
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              textTransform: 'none',
                              fontSize: 'inherit',
                              fontWeight: 600,
                              p: 0,
                              minWidth: 'auto',
                              '&:hover': {
                                textDecoration: 'underline',
                                bgcolor: 'transparent',
                                color: 'white'
                              }
                            }}
                          >
                            {appt.doctor?.name || 'Unknown Doctor'}
                          </Button>
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', px: 3, py: 2 }}>{appt.doctor?.speciality || '-'}</TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', px: 3, py: 2 }}>
                          {appt.date}<br/>
                          <Typography variant="caption" color="text.secondary">
                            {appt.start} - {appt.end}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', px: 3, py: 2 }}>
                          <Chip 
                            label={appt.consultationType || 'online'} 
                            size="small"
                            color={appt.consultationType === 'online' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', px: 3, py: 2 }}>
                          <Chip 
                            label={appt.paymentStatus || 'pending'} 
                            size="small"
                            color={appt.paymentStatus === 'completed' ? 'success' : 'warning'}
                          />
                          {appt.amount && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              ₹{appt.amount}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', px: 3, py: 2 }}>
                          {appt.meetingLink ? (
                            <Link 
                              href={appt.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              sx={{ color: '#8B5CF6', textDecoration: 'none' }}
                            >
                              <VideocamIcon sx={{ mr: 0.5, fontSize: 16 }} />
                              Join Meeting
                            </Link>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Not available
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: appt.status === 'booked' ? '#8B5CF6' : 'white', fontWeight: 600, fontSize: '1rem', px: 3, py: 2 }}>
                          {appt.status}
                          {/* Show review button if eligible */}
                          {appt.status === 'booked' && appt.paymentStatus === 'completed' && !reviewedAppointments.includes(appt._id) && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1, color: '#8B5CF6', borderColor: '#8B5CF6', fontSize: '0.7rem' }}
                              onClick={() => {
                                setReviewDoctor(appt.doctor);
                                setReviewAppointment(appt);
                                setShowReviewModal(true);
                              }}
                            >
                              Leave a Review
                            </Button>
                          )}
                          {appt.status === 'booked' && appt.paymentStatus === 'completed' && reviewedAppointments.includes(appt._id) && (
                            <Typography variant="caption" color="#FFD700" sx={{ ml: 1 }}>
                              Reviewed
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: 'white', px: 3, py: 2 }}>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ color: '#8B5CF6', borderColor: '#8B5CF6', fontSize: '0.8rem' }}
                              onClick={() => handleUploadFiles(appt)}
                            >
                              Upload Files
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ color: '#FFD700', borderColor: '#FFD700', fontSize: '0.8rem' }}
                              onClick={() => handleViewDoctorReviews(appt.doctor)}
                            >
                              View Reviews
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          <Grid container spacing={2} mb={4} alignItems="center">
            <Grid item xs={12} sm="auto">
              <TextField
                select
                label="Speciality"
                value={speciality}
                onChange={e => setSpeciality(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Select speciality"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">All Specialities</MenuItem>
                {specialities.map((spec, idx) => (
                  <MenuItem key={idx} value={spec}>{spec}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm="auto">
              <TextField
                select
                label="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Select location"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((loc, idx) => (
                  <MenuItem key={idx} value={loc}>{loc}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm="auto">
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Select date"
                sx={{ minWidth: 200 }}
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleFilter} 
                sx={{ 
                  minWidth: 120,
                  bgcolor: '#8B5CF6',
                  '&:hover': { bgcolor: '#7C3AED' }
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : filteredDoctors.length === 0 ? (
              <Typography>No doctors found.</Typography>
            ) : (
              filteredDoctors.map(doc => (
                <Grid item xs={12} sm={12} key={doc._id}>
                  <Card sx={{
                    bgcolor: '#18122B',
                    borderRadius: 3,
                    boxShadow: '0 4px 24px 0 rgba(139, 92, 246, 0.15)',
                    border: '1.5px solid #8B5CF6',
                    color: 'white',
                    mb: 2
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} color="#2D1B69">
                        {doc.name}
                        {doctorReviews[doc._id] && (
                          <Box component="span" sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}>
                            {[1,2,3,4,5].map(i => (
                              i <= Math.round(doctorReviews[doc._id].avg)
                                ? <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
                                : <StarBorderIcon key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
                            ))}
                            <Typography variant="caption" sx={{ ml: 0.5, color: '#FFD700' }}>
                              {doctorReviews[doc._id].avg.toFixed(1)} ({doctorReviews[doc._id].count})
                            </Typography>
                          </Box>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doc.speciality} | {doc.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {doc.bio}
                      </Typography>
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography fontWeight={600}>Available Slots</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {(!doc.nextAvailableSlots || doc.nextAvailableSlots.length === 0) ? (
                            <Typography color="text.secondary">No available slots.</Typography>
                          ) : (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {doc.nextAvailableSlots.map((slot, idx) => (
                                <Button
                                  key={idx}
                                  variant={slot.booked ? "outlined" : "contained"}
                                  size="small"
                                  sx={{
                                    minWidth: 0,
                                    px: 2,
                                    mb: 1,
                                    bgcolor: slot.booked ? 'transparent' : '#4caf50',
                                    color: slot.booked ? '#9e9e9e' : 'white',
                                    borderColor: slot.booked ? '#9e9e9e' : 'transparent',
                                    cursor: slot.booked ? 'not-allowed' : 'pointer',
                                    opacity: slot.booked ? 0.6 : 1,
                                    '&:hover': {
                                      bgcolor: slot.booked ? 'transparent' : '#388e3c',
                                      borderColor: slot.booked ? '#9e9e9e' : 'transparent'
                                    },
                                    '&:disabled': {
                                      bgcolor: 'transparent',
                                      color: '#9e9e9e',
                                      borderColor: '#9e9e9e'
                                    }
                                  }}
                                  disabled={slot.booked}
                                  onClick={() => !slot.booked && handleBookClick(doc, slot)}
                                >
                                  {slot.date} {slot.start}-{slot.end}
                                  {slot.booked && ' (Booked)'}
                                </Button>
                              ))}
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          <Dialog open={confirmOpen} onClose={handleCancelBooking} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6' }}>
              Confirm Appointment
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
              {selectedDoctor && selectedSlot && (
                <Box>
                  <Typography variant="h6" mb={2} color="#8B5CF6">
                    Dr. {selectedDoctor.name}
                  </Typography>
                  <Typography mb={1}>
                    <strong>Date:</strong> {selectedSlot.date}
                  </Typography>
                  <Typography mb={1}>
                    <strong>Time:</strong> {selectedSlot.start} - {selectedSlot.end}
                  </Typography>
                  <Typography mb={1}>
                                            <strong>Speciality:</strong> {selectedDoctor.speciality}
                  </Typography>
                  <Typography mb={2}>
                    <strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee || 500}
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: 'white' }}>Consultation Type</InputLabel>
                    <Select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                      sx={{ color: 'white' }}
                    >
                      <MenuItem value="online">Online (Video Call)</MenuItem>
                      <MenuItem value="in-person">In-Person</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {consultationType === 'online' && (
                    <Box sx={{ p: 2, bgcolor: '#2D1B69', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" color="#8B5CF6">
                        <VideocamIcon sx={{ mr: 1, fontSize: 16 }} />
                        Meeting link will be generated after payment
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
              <Button onClick={handleCancelBooking} sx={{ color: 'white' }}>
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking} variant="contained" sx={{ bgcolor: '#8B5CF6' }}>
                Proceed to Payment
              </Button>
            </DialogActions>
          </Dialog>

          {/* Payment Dialog */}
          <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6' }}>
              Complete Payment
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
              {paymentDetails && (
                <Box>
                  <Typography variant="h6" mb={2} color="#8B5CF6">
                    Payment Details
                  </Typography>
                  <Typography mb={1}>
                    <strong>Amount:</strong> ${paymentDetails.amount}
                  </Typography>
                  <Typography mb={1}>
                    <strong>Payment ID:</strong> {paymentDetails.id}
                  </Typography>
                  <Typography mb={2}>
                    <strong>Description:</strong> Consultation with Dr. {selectedDoctor?.name}
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: '#2D1B69', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="#8B5CF6">
                      <PaymentIcon sx={{ mr: 1, fontSize: 16 }} />
                      Secure payment powered by PayPal
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
              <Button onClick={() => setShowPaymentDialog(false)} sx={{ color: 'white' }}>
                Cancel
              </Button>
              <Button onClick={handlePayment} variant="contained" sx={{ bgcolor: '#8B5CF6' }}>
                Pay with PayPal
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
              {snackbar.message}
            </MuiAlert>
          </Snackbar>

          {/* Appointment Details Modal */}
          <AppointmentDetailsModal
            open={showAppointmentDetails}
            onClose={() => {
              setShowAppointmentDetails(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
          />

          {/* Review Modal */}
          <ReviewModal
            open={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            doctorName={reviewDoctor?.name || ''}
            onSubmit={async (rating, review) => {
              try {
                const user = JSON.parse(localStorage.getItem('user'));
                await axios.post('http://localhost:5000/api/reviews', {
                  doctorId: reviewDoctor._id,
                  appointmentId: reviewAppointment._id,
                  rating,
                  review,
                  patientId: user.id
                });
                setSnackbar({ open: true, message: 'Review submitted!', severity: 'success' });
                setShowReviewModal(false);
                setReviewedAppointments(prev => [...prev, reviewAppointment._id]);
                // Optionally refresh doctor reviews
                const res = await axios.get(`http://localhost:5000/api/reviews/doctor/${reviewDoctor._id}`);
                const reviews = res.data;
                const avg = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
                setDoctorReviews(prev => ({ ...prev, [reviewDoctor._id]: { avg, count: reviews.length } }));
              } catch (err) {
                setSnackbar({ open: true, message: err.response?.data?.message || 'Error submitting review', severity: 'error' });
              }
            }}
          />

          {/* My Reviews Section */}
          <Box sx={{ bgcolor: '#1A1A1A', borderRadius: 3, p: 3, boxShadow: 3, mb: 5 }}>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#8B5CF6' }}>
              My Reviews
            </Typography>
            {myReviews.length === 0 ? (
              <Typography color="text.secondary">You have not submitted any reviews yet.</Typography>
            ) : (
              <Grid container spacing={2}>
                {myReviews.map((r, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card sx={{ bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {[1,2,3,4,5].map(i => (
                            <StarIcon key={i} sx={{ color: i <= r.rating ? '#FFD700' : '#757575', fontSize: 18 }} />
                          ))}
                          <Typography variant="caption" sx={{ ml: 1, color: '#FFD700' }}>{r.rating}.0</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'white' }}>
                          {r.review || 'No comment provided.'}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: '#8B5CF6' }}>
                          For {r.doctor?.name && !/^Dr\.?/i.test(r.doctor.name) ? `Dr. ${r.doctor.name}` : r.doctor?.name || 'Doctor'} ({r.doctor?.speciality || ''})
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Doctor Profile Reviews Modal */}
          <Dialog open={showDoctorProfileReviews} onClose={() => setShowDoctorProfileReviews(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6' }}>
              Reviews for {/^dr\.?/i.test(doctorProfileName || '') ? doctorProfileName : `Dr. ${doctorProfileName}`}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
              {doctorProfileReviews.length === 0 ? (
                <Typography color="text.secondary">No reviews yet for this doctor.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {doctorProfileReviews.map((r, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Card sx={{ bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2, p: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {[1,2,3,4,5].map(i => (
                              <StarIcon key={i} sx={{ color: i <= r.rating ? '#FFD700' : '#757575', fontSize: 18 }} />
                            ))}
                            <Typography variant="caption" sx={{ ml: 1, color: '#FFD700' }}>{r.rating}.0</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'white' }}>
                            {r.review || 'No comment provided.'}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: '#8B5CF6' }}>
                            Anonymous Patient
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
              <Button onClick={() => setShowDoctorProfileReviews(false)} sx={{ color: 'white' }}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* File Upload Dialog */}
          {showFileUploadDialog && fileUploadAppointment && (
            <Dialog open={showFileUploadDialog} onClose={() => setShowFileUploadDialog(false)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6' }}>Upload Files for Appointment</DialogTitle>
              <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
                <FileUpload appointmentId={fileUploadAppointment._id} onFileUploaded={() => {}} onFileDeleted={() => {}} />
              </DialogContent>
              <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
                <Button onClick={() => setShowFileUploadDialog(false)} sx={{ color: 'white' }}>Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </Container>
      </Box>
    </>
  );
};

export default PatientDashboard; 