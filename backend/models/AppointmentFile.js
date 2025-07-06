const mongoose = require('mongoose');

const appointmentFileSchema = new mongoose.Schema({
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
    required: true 
  },
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  fileName: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String, 
    required: true 
  },
  fileType: { 
    type: String, 
    required: true 
  },
  fileSize: { 
    type: Number, 
    required: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  uploadedBy: { 
    type: String, 
    enum: ['patient', 'doctor'], 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('AppointmentFile', appointmentFileSchema); 