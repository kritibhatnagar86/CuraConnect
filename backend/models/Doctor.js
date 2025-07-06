const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g., '2024-06-01'
  time: { type: String, required: true }  // e.g., '10:00 AM'
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  speciality: { type: String, required: true },
  location: { type: String, required: true },
  //availableSlots: [availableSlotSchema],
  workingDays: {
    type: [Number],
    required: true,
    default: [1,2,3,4,5,6] // Mon-Sat
  },
  workingHours: {
    type: {
      start: { type: String, required: true }, // e.g., '10:00'
      end: { type: String, required: true }    // e.g., '16:00'
    },
    required: true,
    default: { start: '10:00', end: '16:00' }
  },
  phone: { type: String },
  bio: { type: String },
  profileImage: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  // New fields for teleconsultation
  consultationFee: { type: Number, required: true, default: 500 }, // in INR
  meetingPlatform: { type: String, enum: ['google-meet'], default: 'google-meet' },
  googleMeetEmail: { type: String }, // for Google Meet integration

  // Google OAuth tokens for Calendar API
  googleTokens: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema); 