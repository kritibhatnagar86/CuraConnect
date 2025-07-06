const express = require('express');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const PayPalService = require('../utils/paypalService');
const router = express.Router();

// Helper to generate half-hour slots for a given day
function generateHalfHourSlots(dateStr, workingHours) {
  const slots = [];
  // Parse start and end times (e.g., '10:00')
  const [startHour, startMinute] = workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = workingHours.end.split(':').map(Number);
  let start = new Date(`${dateStr}T${workingHours.start}:00`);
  let end = new Date(`${dateStr}T${workingHours.end}:00`);

  // Get current date and time
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  while (start < end) {
    let slotEnd = new Date(start.getTime() + 30 * 60000); // add 30 minutes
    if (slotEnd > end) slotEnd = end;
    const pad = n => n.toString().padStart(2, '0');
    // Only include slots after current time for today
    if (
      dateStr > todayStr ||
      (dateStr === todayStr && start > now)
    ) {
      slots.push({
        date: dateStr,
        start: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        end: `${pad(slotEnd.getHours())}:${pad(slotEnd.getMinutes())}`
      });
    }
    start = slotEnd;
  }
  return slots;
}

// Helper to generate next N available days with half-hour slots
function generateNextSlots(workingDays, workingHours, n = 7) {
  const slots = [];
  const today = new Date();
  let count = 0;
  let day = 0;
  while (count < n && day < 30) { // look ahead up to 30 days
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const weekday = date.getDay(); // 0=Sunday
    if (workingDays.includes(weekday)) {
      // Format date as YYYY-MM-DD
      const dateStr = date.toISOString().slice(0, 10);
      slots.push(...generateHalfHourSlots(dateStr, workingHours));
      count++;
    }
    day++;
  }
  return slots;
}

// Helper to generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// GET /api/doctors - get all doctors with next available half-hour slots and booked status
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const allAppointments = await Appointment.find({ status: 'booked' });
    const doctorsWithSlots = doctors.map(doc => {
      const docObj = doc.toObject();
      //console.log('Doctor:', doc.email, 'workingDays:', doc.workingDays, 'workingHours:', doc.workingHours);
      const slots = generateNextSlots(
        doc.workingDays || [1,2,3,4,5,6],
        doc.workingHours || { start: '10:00', end: '16:00' },
        7
      );
      console.log('Generated slots for', doc.email, ':', slots);
      docObj.nextAvailableSlots = slots.map(slot => {
        const isBooked = allAppointments.some(appt =>
          appt.doctor.toString() === doc._id.toString() &&
          appt.date === slot.date &&
          appt.start === slot.start &&
          appt.end === slot.end &&
          appt.status === 'booked'
        );
        return { ...slot, booked: isBooked };
      });
      return docObj;
    });
    res.json(doctorsWithSlots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/appointments - book an appointment with payment
router.post('/appointments', async (req, res) => {
  try {
    const { doctorId, patientId, date, start, end, consultationType = 'online' } = req.body;
    if (!doctorId || !patientId || !date || !start || !end) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get doctor details for consultation fee
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if slot is already booked
    const exists = await Appointment.findOne({ doctor: doctorId, date, start, end, status: 'booked' });
    if (exists) {
      return res.status(409).json({ message: 'Slot already booked' });
    }

    // Meeting link will be generated after payment completion
    let meetingLink = null;
    let meetingPlatform = doctor.meetingPlatform || 'google-meet';

    // Create appointment with payment details
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      start,
      end,
      status: 'booked',
      consultationType,
      meetingLink,
      meetingPlatform,
      amount: doctor.consultationFee,
      paymentStatus: 'pending'
    });

    // Create PayPal payment
    const payment = await PayPalService.createPayment(
      doctor.consultationFee, 
      'USD', 
      `Consultation with Dr. ${doctor.name}`,
      appointment._id
    );

    res.status(201).json({ 
      message: 'Appointment created, payment pending', 
      appointment,
      payment: {
        id: payment.id,
        approval_url: payment.links.find(link => link.rel === 'approval_url').href,
        amount: doctor.consultationFee,
        currency: 'USD',
        appointmentId: appointment._id
      }
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/doctors/appointments?patientId=...&doctorId=...
router.get('/appointments', async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;
    if (!patientId && !doctorId) {
      return res.status(400).json({ message: 'Missing patientId or doctorId' });
    }
    let query = {};
    if (patientId) query.patient = patientId;
    if (doctorId) query.doctor = doctorId;
    const appointments = await Appointment.find(query)
              .populate('doctor', 'name speciality location')
      .populate('patient', 'name email')
      .sort({ date: 1, start: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/doctors/register - register a new doctor
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      speciality, 
      location, 
      workingDays, 
      workingHours, 
      phone, 
      bio, 
      profileImage,
      consultationFee = 500,
      meetingPlatform = 'google-meet',
      googleMeetEmail
    } = req.body;
    
    if (!name || !email || !password || !speciality || !location || !workingDays || !workingHours) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered as doctor' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      speciality,
      location,
      workingDays,
      workingHours,
      phone,
      bio,
      profileImage,
      consultationFee,
      meetingPlatform,
      googleMeetEmail
    });
    
    res.status(201).json({ message: 'Doctor registered successfully', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/doctors/send-otp - send OTP to doctor email
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    doctor.otp = otp;
    doctor.otpExpiry = otpExpiry;
    await doctor.save();
    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Doctor Login',
      html: `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP will expire in 10 minutes.</p>`
    });
    res.json({ message: 'OTP sent successfully', otp: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/doctors/verify-otp - verify OTP for doctor login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (doctor.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > doctor.otpExpiry) return res.status(400).json({ message: 'OTP has expired' });
    // Clear OTP
    doctor.otp = undefined;
    doctor.otpExpiry = undefined;
    await doctor.save();
    // Return doctor info (simulate login)
    res.json({
      message: 'OTP verified and logged in successfully',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
        location: doctor.location
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/doctors/execute-payment - execute PayPal payment
router.post('/execute-payment', async (req, res) => {
  try {
    const { paymentId, payerId, appointmentId } = req.body;
    
    if (!paymentId || !payerId || !appointmentId) {
      return res.status(400).json({ message: 'Missing required payment details' });
    }

    // Execute PayPal payment
    const payment = await PayPalService.executePayment(paymentId, payerId);

    // Update appointment with payment details
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.paymentStatus = 'completed';
    appointment.paypalPaymentId = paymentId;
    appointment.paypalPayerId = payerId;
    appointment.paymentDate = new Date();

    // If online consultation and doctor has Google tokens, create Meet event
    if (appointment.consultationType === 'online') {
      const doctor = await Doctor.findById(appointment.doctor);
      if (doctor && doctor.googleTokens) {
        // Google Calendar API integration
        const { google } = require('googleapis');
        const fs = require('fs');
        const credentials = JSON.parse(fs.readFileSync('credentials.json'));
        const { client_secret, client_id } = credentials.web;
        const redirect_uri = 'http://localhost:5000/api/google/oauth/callback';
        const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uri
        );
        oAuth2Client.setCredentials(doctor.googleTokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        // Build event times in RFC3339 format
        const startDateTime = new Date(`${appointment.date}T${appointment.start}:00`);
        const endDateTime = new Date(`${appointment.date}T${appointment.end}:00`);
        const event = {
          summary: 'Teleconsultation Appointment',
          description: 'Online healthcare appointment',
          start: { dateTime: startDateTime.toISOString() },
          end: { dateTime: endDateTime.toISOString() },
          conferenceData: {
            createRequest: { requestId: `${appointment._id}` }
          }
        };
        try {
          const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1
          });
          appointment.meetingLink = response.data.hangoutLink;
          appointment.meetingPlatform = 'google-meet';
          console.log('Google Meet link generated:', response.data.hangoutLink);
        } catch (err) {
          console.error('Error creating Google Meet event:', err.message);
        }
      }
    }
    await appointment.save();

    res.json({ 
      message: 'Payment completed successfully', 
      appointment 
    });
  } catch (err) {
    console.error('Error executing payment:', err);
    res.status(500).json({ message: 'Payment execution failed' });
  }
});

// PUT /api/doctors/appointments/:id/update-meeting-link - update meeting link
router.put('/appointments/:id/update-meeting-link', async (req, res) => {
  try {
    const { id } = req.params;
    const { meetingLink, meetingPlatform } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.meetingLink = meetingLink;
    appointment.meetingPlatform = meetingPlatform;
    await appointment.save();

    res.json({ 
      message: 'Meeting link updated successfully', 
      appointment 
    });
  } catch (err) {
    console.error('Error updating meeting link:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/doctors/payment-status/:paymentId - get PayPal payment status
router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await PayPalService.getPayment(paymentId);
    
    res.json({ 
      paymentId: payment.id,
      state: payment.state,
      amount: payment.transactions[0].amount,
      create_time: payment.create_time,
      update_time: payment.update_time
    });
  } catch (err) {
    console.error('Error getting payment status:', err);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
});

// GET /api/doctors/test-paypal - test PayPal connection
router.get('/test-paypal', async (req, res) => {
  try {
    const testPayment = await PayPalService.createPayment(10, 'USD', 'Test Consultation');
    res.json({ 
      message: 'PayPal test successful', 
      paymentId: testPayment.id,
      approvalUrl: testPayment.links.find(link => link.rel === 'approval_url').href
    });
  } catch (err) {
    console.error('PayPal test error:', err);
    res.status(500).json({ 
      message: 'PayPal test failed', 
      error: err.message,
      details: err.response?.information_link
    });
  }
});

module.exports = router; 