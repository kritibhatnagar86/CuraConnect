const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // e.g., '2024-06-10'
  start: { type: String, required: true }, // e.g., '10:00'
  end: { type: String, required: true },   // e.g., '10:30'
  status: { type: String, default: 'booked' },
  // New fields for teleconsultation and payment
  consultationType: { type: String, enum: ['in-person', 'online'], default: 'online' },
  meetingLink: { type: String }, // Google Meet link
  meetingPlatform: { type: String, enum: ['google-meet'], default: 'google-meet' },
  // Payment fields
  amount: { type: Number, required: true }, // consultation fee
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paypalPaymentId: { type: String },
  paypalPayerId: { type: String },
  paymentDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema); 