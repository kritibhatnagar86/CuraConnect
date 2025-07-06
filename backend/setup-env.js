const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  // Create .env file with default values
  const envContent = `# Server Configuration
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthcare

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration for OTP
# For Gmail, you need to use an App Password, not your regular password
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Instructions for Gmail App Password:
# 1. Go to your Google Account settings (https://myaccount.google.com/)
# 2. Enable 2-factor authentication if not already enabled
# 3. Go to Security > 2-Step Verification > App passwords
# 4. Generate a new app password for "Mail"
# 5. Use that 16-character password in EMAIL_PASS above
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
  console.log('📧 Please update the EMAIL_USER and EMAIL_PASS in the .env file');
  console.log('🔐 For Gmail, use an App Password, not your regular password');
}

console.log('\n📋 Next steps:');
console.log('1. Edit the .env file and set your email credentials');
console.log('2. For Gmail: Enable 2FA and generate an App Password');
console.log('3. Restart the server: npm start');
console.log('4. Test the OTP functionality in the frontend'); 