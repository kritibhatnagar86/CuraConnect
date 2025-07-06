# Email OTP Setup Guide

## 🚀 Quick Start (Development Mode)

For development and testing, the system now includes a **test mode** that doesn't require email setup:

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Test the OTP functionality:**
   - Enter any email in the login form
   - Click "Send OTP"
   - The OTP will appear in an alert and console
   - Use this OTP to proceed with login

## 📧 Production Email Setup

For production use with real email sending:

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file:**
   ```env
   EMAIL_USER=your_new_healthcare_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

### Other Email Providers

For other providers (Outlook, Yahoo, etc.), you may need to:
- Enable "Less secure app access" or
- Use provider-specific app passwords
- Update the transporter configuration in `authController.js`

## 🔧 Configuration Options

### Development Mode (Current)
- Uses test endpoint: `/api/auth/test-otp`
- Shows OTP in alerts and console
- No email sending required
- Perfect for development and testing

### Production Mode
- Uses real email endpoint: `/api/auth/resend-otp`
- Sends actual emails with OTP
- Requires proper email configuration
- Secure and production-ready

## 🧪 Testing the System

### Test User Creation
The system automatically creates test users when needed:
- Email: any email you enter
- Password: `test123`
- Role: `patient`

### OTP Features
- ✅ 6-digit numeric OTP
- ✅ 10-minute expiration
- ✅ Automatic user creation for testing
- ✅ Beautiful HTML email templates
- ✅ Error handling and logging

## 🚨 Troubleshooting

### Common Issues:

1. **"Email credentials not configured"**
   - Solution: Set up `.env` file with email credentials

2. **"Invalid credentials" (Gmail)**
   - Solution: Use App Password, not regular password

3. **"Connection timeout"**
   - Solution: Check internet connection and firewall settings

4. **"User not found"**
   - Solution: The system will create a test user automatically

### Debug Mode
Check the console logs for detailed information:
- ✅ Successful operations
- ❌ Error messages
- 🔧 Development/testing info
- 📧 Email sending status

## 🔄 Switching Between Modes

To switch from test mode to production mode:

1. **Update frontend:**
   ```javascript
   // In LoginPage.js, change:
   // From: '/api/auth/test-otp'
   // To: '/api/auth/resend-otp'
   ```

2. **Configure email credentials** in `.env` file

3. **Restart the server**

## 📱 Frontend Features

- ✅ Multi-step login process
- ✅ Visual progress stepper
- ✅ Real-time error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Beautiful UI with purple theme

The system is now ready for both development testing and production use! 🎉 