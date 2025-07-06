require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const googleAuthRouter = require('./googleAuth');
const fileRoutes = require('./routes/files');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Health check route
app.get('/', (req, res) => {
  res.send('Healthcare Management System Backend Running');
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/google', googleAuthRouter);
app.use('/api/files', fileRoutes);
app.use('/api/reviews', reviewRoutes);
