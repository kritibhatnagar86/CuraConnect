const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppointmentFile = require('../models/AppointmentFile');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/files/upload/:appointmentId - Upload file for an appointment
router.post('/upload/:appointmentId', upload.single('file'), async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { description, uploadedBy } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Verify appointment exists and user has access
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Create file record
    const appointmentFile = new AppointmentFile({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      description: description || '',
      uploadedBy: uploadedBy || 'patient'
    });

    await appointmentFile.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: appointmentFile._id,
        fileName: appointmentFile.fileName,
        originalName: appointmentFile.originalName,
        fileType: appointmentFile.fileType,
        fileSize: appointmentFile.fileSize,
        description: appointmentFile.description,
        uploadedBy: appointmentFile.uploadedBy,
        uploadedAt: appointmentFile.createdAt
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// GET /api/files/:appointmentId - Get all files for an appointment
router.get('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const files = await AppointmentFile.find({ appointment: appointmentId })
      .sort({ createdAt: -1 });

    const filesWithUrls = files.map(file => ({
      id: file._id,
      fileName: file.fileName,
      originalName: file.originalName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      description: file.description,
      uploadedBy: file.uploadedBy,
      uploadedAt: file.createdAt,
      downloadUrl: `/api/files/download/${file._id}`
    }));

    res.json(filesWithUrls);

  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// GET /api/files/download/:fileId - Download a specific file
router.get('/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await AppointmentFile.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', file.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(file.filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

// DELETE /api/files/:fileId - Delete a file
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await AppointmentFile.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete from database
    await AppointmentFile.findByIdAndDelete(fileId);

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router; 