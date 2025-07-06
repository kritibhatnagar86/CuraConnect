const express = require('express');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const router = express.Router();

// POST /api/reviews - Submit a review (only for completed appointments, one per appointment)
router.post('/', async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, review, patientId } = req.body;
    if (!doctorId || !appointmentId || !rating || !patientId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Check appointment exists, is completed, and belongs to patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctor.toString() !== doctorId || appointment.patient.toString() !== patientId) {
      return res.status(403).json({ message: 'Invalid appointment or not authorized' });
    }
    if (appointment.status !== 'booked' || appointment.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'You can only review after a completed and paid appointment' });
    }
    // Prevent duplicate review
    const existing = await Review.findOne({ appointment: appointmentId, patient: patientId });
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this appointment' });
    }
    // Create review
    const newReview = await Review.create({
      doctor: doctorId,
      patient: patientId,
      appointment: appointmentId,
      rating,
      review
    });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review', error: err.message });
  }
});

// GET /api/doctors/:id/reviews - Get all reviews for a doctor
router.get('/doctor/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.id })
      .populate('patient', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// GET /api/reviews/mine?patientId=... - Get all reviews by a patient
router.get('/mine', async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) return res.status(400).json({ message: 'Missing patientId' });
    const reviews = await Review.find({ patient: patientId })
      .populate('doctor', 'name speciality')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your reviews' });
  }
});

// GET /api/reviews/testimonials - Get top reviews for homepage/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    // Get top 10 reviews by rating, most recent
    const reviews = await Review.find()
      .populate('doctor', 'name speciality')
      .populate('patient', 'name')
      .sort({ rating: -1, createdAt: -1 })
      .limit(10);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
});

// GET /api/reviews/appointment/:appointmentId - Get review for a specific appointment (for patient to check if already reviewed)
router.get('/appointment/:appointmentId', async (req, res) => {
  try {
    const review = await Review.findOne({ appointment: req.params.appointmentId });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching review' });
  }
});

module.exports = router; 