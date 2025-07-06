const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Email transporter setup with better error handling
const createTransport = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured!');
    console.error('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      isVerified: false,
      otp,
      otpExpiry,
    });
    await user.save();
    
    // Send OTP email
    const transporter = createTransport();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your OTP for CuraConnect Registration',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #8B5CF6;">CuraConnect</h2>
              <p>Hello ${name},</p>
              <p>Your OTP for email verification is:</p>
              <div style="background: #8B5CF6; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br>CuraConnect Team</p>
            </div>
          `,
        });
        console.log(`✅ OTP sent to ${email}: ${otp}`);
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError.message);
        // Still return success, but log the OTP for testing
        console.log(`🔧 For testing - OTP for ${email}: ${otp}`);
      }
    } else {
      console.log(`🔧 Email not configured - OTP for ${email}: ${otp}`);
    }
    
    res.status(201).json({ 
      message: 'Registration successful. Please verify your email with the OTP sent.',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only show OTP in development
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    // Mark user as verified if not already
    if (!user.isVerified) {
      user.isVerified = true;
    }
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log(`✅ OTP verified for ${email}`);
    res.json({
      message: 'OTP verified and logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ OTP verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    console.log(`📧 Resending OTP to: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Always generate new OTP, even for verified users
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    // Send new OTP email
    const transporter = createTransport();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your OTP for CuraConnect Login',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #8B5CF6;">CuraConnect</h2>
              <p>Hello ${user.name},</p>
              <p>Your OTP for login is:</p>
              <div style="background: #8B5CF6; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br>CuraConnect Team</p>
            </div>
          `,
        });
        console.log(`✅ OTP sent to ${email}: ${otp}`);
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError.message);
        console.log(`🔧 For testing - OTP for ${email}: ${otp}`);
      }
    } else {
      console.log(`🔧 Email not configured - OTP for ${email}: ${otp}`);
    }
    res.json({ 
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only show OTP in development
    });
  } catch (err) {
    console.error('❌ Resend OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.testOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    console.log(`🧪 Test OTP request for: ${email}`);
    
    // Check if user exists, if not create a test user
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`🧪 Creating test user for: ${email}`);
      const hashedPassword = await bcrypt.hash('test123', 10);
      user = new User({
        name: 'Test User',
        email,
        password: hashedPassword,
        role: 'patient',
        isVerified: false,
      });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    console.log(`🧪 Test OTP generated for ${email}: ${otp}`);
    
    res.json({ 
      message: 'Test OTP generated successfully',
      otp: otp, // Always return OTP for testing
      email: email
    });
    
  } catch (err) {
    console.error('❌ Test OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log(`✅ Login successful for ${email}`);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 