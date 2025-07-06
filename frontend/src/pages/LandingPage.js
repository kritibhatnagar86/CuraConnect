import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { 
  LocalHospital, 
  VideoCall, 
  Payment, 
  Security, 
  Schedule, 
  Person,
  CheckCircle, 
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GoogleIcon from '@mui/icons-material/Google';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LandingPage = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);

  const features = [
    {
      icon: <MedicalServicesIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Teleconsultation',
      description: 'Book and attend online consultations with top doctors from across the country—remotely connect for the best care.'
    },
    {
      icon: <GoogleIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Google Meet Integration',
      description: 'Seamless video consultations powered by Google Meet, integrated with your calendar.'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Secure Payments',
      description: 'Pay easily and securely for your appointments using PayPal.'
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'File Sharing',
      description: 'Upload and share medical reports, prescriptions and images with your doctor.'
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Doctor Reviews',
      description: 'Read and submit reviews for doctors after your consultation.'
    }
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews/testimonials');
        setTestimonials(res.data);
      } catch (err) {}
    };
    fetchTestimonials();
  }, []);

  return (
    <Box sx={{ bgcolor: '#0F0F0F', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section with Logo */}
      <Box sx={{ pt: 8, pb: 4, textAlign: 'center', bgcolor: 'black' }}>
        <img src="/curaconnect-logo.png" alt="CuraConnect Logo" style={{ height: 120, marginBottom: 16 }} />
        <Typography variant="h2" sx={{ fontWeight: 800, color: '#8B5CF6', mb: 1, letterSpacing: 2 }}>
          CuraConnect
        </Typography>
        <Typography variant="h5" sx={{ color: '#B39DDB', mb: 2, fontWeight: 400, letterSpacing: 1 }}>
          Where Care Meets Convenience
        </Typography>
        <Typography variant="h6" sx={{ color: 'white', opacity: 0.8, maxWidth: 600, mx: 'auto', mb: 4 }}>
          A trusted platform for seamless teleconsultations, secure payments and collaborative healthcare.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonIcon />}
            sx={{
              bgcolor: '#8B5CF6',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: 3,
              '&:hover': { bgcolor: '#7C3AED' }
            }}
            onClick={() => navigate('/login')}
          >
            Login / Signup as Patient
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<LocalHospitalIcon />}
            sx={{
              borderColor: '#8B5CF6',
              color: '#8B5CF6',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: 3,
              '&:hover': { borderColor: '#A855F7', color: '#A855F7', bgcolor: 'rgba(139, 92, 246, 0.1)' }
            }}
            onClick={() => navigate('/doctor/login')}
          >
            Login / Signup as Doctor
          </Button>
        </Stack>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#8B5CF6' }}>
            Why Choose CuraConnect?
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8, color: 'white' }}>
            Everything you need for modern, secure and convenient healthcare - on one platform.
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: 340,
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#18122B',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.10)',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                    borderColor: 'rgba(139, 92, 246, 0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6, color: 'white' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#8B5CF6' }}>
            What Our Patients Say
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8, color: 'white' }}>
            Real feedback from patients who have used CuraConnect for teleconsultations.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.length === 0 ? (
            <Typography color="text.secondary" sx={{ mx: 'auto' }}>No testimonials yet.</Typography>
          ) : testimonials.map((t, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ bgcolor: '#18122B', color: 'white', borderRadius: 3, boxShadow: 3, p: 2, minHeight: 200 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {[1,2,3,4,5].map(i => (
                      <StarIcon key={i} sx={{ color: i <= t.rating ? '#FFD700' : '#757575', fontSize: 18 }} />
                    ))}
                    <Typography variant="caption" sx={{ ml: 1, color: '#FFD700' }}>{t.rating}.0</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: 'white' }}>
                    {t.review || 'No comment provided.'}
                  </Typography>
                  <Divider sx={{ my: 1, bgcolor: '#2D1B69' }} />
                  <Typography variant="subtitle2" sx={{ color: '#8B5CF6' }}>
                    Anonymous
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    For {t.doctor?.name || 'Doctor'} ({t.doctor?.speciality || ''})
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700, mb: 2 }}>
            FAQs
          </Typography>
        </Box>
        <Accordion sx={{ mb: 2, bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8B5CF6' }} />}>
            <Typography sx={{ fontWeight: 600 }}>What is CuraConnect?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              CuraConnect is a teleconsultation platform that lets you book, pay for and attend online appointments with top doctors, securely share files and more - all from home.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2, bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8B5CF6' }} />}>
            <Typography sx={{ fontWeight: 600 }}>How do I book an appointment?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Simply sign up or log in as a patient, search for doctors, select a slot and follow the steps to book and pay for your consultation.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2, bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8B5CF6' }} />}>
            <Typography sx={{ fontWeight: 600 }}>What types of consultations are available?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We offer various consultation types including general health check-ups, specialist consultations (cardiology, dermatology, pediatrics, gynaecology, ENT,etc.), follow-up appointments, prescription renewals and mental health counselling. All consultations are conducted securely online with qualified doctors.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2, bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8B5CF6' }} />}>
            <Typography sx={{ fontWeight: 600 }}>Are my reviews anonymous?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes, all patient reviews are displayed anonymously to protect your privacy. Doctors and other users will never see your name associated with a review.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2, bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8B5CF6' }} />}>
            <Typography sx={{ fontWeight: 600 }}>How do I prepare for my online consultation?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Before your consultation, ensure you have a stable internet connection, prepare your medical history, list your current medications and have any relevant test reports ready. You can upload relevant documents for the doctor to review during your consultation.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2, bgcolor: '#18122B', color: 'white', borderRadius: 2, boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8B5CF6' }} />}>
            <Typography sx={{ fontWeight: 600 }}>Is my medical information kept private and secure?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes, we prioritize your privacy and security. All medical information, consultations and uploaded documents are encrypted and stored securely. We follow strict healthcare privacy standards and your data is only accessible to authorized healthcare professionals involved in your care.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#18122B', color: '#B39DDB', py: 4, mt: 'auto', textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 600, letterSpacing: 1, color: '#8B5CF6' }}>
          CuraConnect
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Contact: <a href="mailto:curaconnect25@gmail.com" style={{ color: '#B39DDB', textDecoration: 'underline' }}>curaconnect25@gmail.com</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage; 