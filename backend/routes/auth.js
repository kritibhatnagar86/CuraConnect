const express = require('express');
const router = express.Router();
const { register, verifyOTP, resendOTP, testOTP } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/test-otp', testOTP);
router.post('/login', require('../controllers/authController').login);

module.exports = router; 