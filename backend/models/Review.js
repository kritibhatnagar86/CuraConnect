const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, trim: true },
}, { timestamps: true });

// Prevent duplicate reviews for the same appointment
reviewSchema.index({ appointment: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 