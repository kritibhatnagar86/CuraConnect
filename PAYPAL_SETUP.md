# PayPal Integration Setup Guide

## 🚀 Features Implemented

1. **PayPal Payment Gateway** - Secure payment processing
2. **Google Meet/Zoom Integration** - Meeting link generation and management
3. **Online Consultation Support** - Video call appointments
4. **Payment Status Tracking** - Real-time payment verification

## 🔧 Backend Setup

### 1. Install PayPal SDK
```bash
cd backend
npm install paypal-rest-sdk
```

### 2. Environment Variables
Add these to your `backend/config.env`:

```env
# PayPal Payment Gateway Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=sandbox

# Optional: Frontend URL for redirects
FRONTEND_URL=http://localhost:3000
```

### 3. Get PayPal Credentials
1. Go to [PayPal Developer Portal](https://developer.paypal.com)
2. Create a PayPal Developer account
3. Go to **Apps & Credentials**
4. Create a new app
5. Copy the **Client ID** and **Secret**
6. Use **Sandbox** for testing, **Live** for production

## 🎯 Frontend Setup

### 1. Add Payment Pages to Routes
Update your `App.js` to include the new payment pages:

```javascript
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

// Add these routes
<Route path="/payment-success" element={<PaymentSuccessPage />} />
<Route path="/payment-cancel" element={<PaymentCancelPage />} />
```

## 🧪 Testing PayPal Integration

### Sandbox Test Accounts
PayPal provides sandbox accounts for testing:

#### Personal Account (Buyer):
- **Email**: sb-personal@business.example.com
- **Password**: (provided in PayPal sandbox)

#### Business Account (Seller):
- **Email**: sb-business@business.example.com
- **Password**: (provided in PayPal sandbox)

### Test Payment Flow
1. Use sandbox personal account to make payments
2. Use sandbox business account to receive payments
3. All transactions are simulated (no real money)

## 📋 New Features

### For Patients:
- **Consultation Type Selection**: Choose online or in-person
- **PayPal Payment**: Secure payment through PayPal
- **Meeting Links**: Access Google Meet/Zoom links
- **Payment Status**: Track payment status
- **Enhanced Dashboard**: Shows payment and meeting info

### For Doctors:
- **Consultation Fee Setting**: Set fees during registration
- **Meeting Platform Preferences**: Choose Google Meet/Zoom
- **Meeting Link Management**: Add/edit meeting links
- **Payment Tracking**: View payment status
- **Enhanced Dashboard**: Shows payment and meeting info

## 🗄️ Database Changes

### Doctor Model Updates:
- `consultationFee`: Doctor's consultation fee (default: $50)
- `meetingPlatform`: Preferred platform (google-meet/zoom/both)
- `googleMeetEmail`: Google Meet email (optional)
- `zoomEmail`: Zoom email (optional)

### Appointment Model Updates:
- `consultationType`: online/in-person
- `meetingLink`: Google Meet or Zoom link
- `meetingPlatform`: Platform used
- `amount`: Consultation fee amount
- `paymentStatus`: pending/completed/failed
- `paypalPaymentId`: PayPal payment ID
- `paypalPayerId`: PayPal payer ID
- `paymentDate`: Payment completion date

## 🔌 API Endpoints

### New Endpoints:
- `POST /api/doctors/execute-payment` - Execute PayPal payment
- `GET /api/doctors/payment-status/:paymentId` - Get payment status

### Updated Endpoints:
- `POST /api/doctors/appointments` - Now includes PayPal payment creation
- `POST /api/doctors/register` - Now includes consultation fee and meeting platform

## 🔄 Payment Flow

### Patient Booking Flow:
1. Patient searches for doctors
2. Selects appointment slot
3. Chooses consultation type (online/in-person)
4. Proceeds to PayPal payment
5. Redirected to PayPal for payment
6. Returns to success/cancel page
7. Payment is executed and appointment confirmed
8. Receives meeting link (for online consultations)

### Doctor Management Flow:
1. Doctor registers with consultation fee and meeting platform
2. Views appointments with payment status
3. Can add/edit meeting links for appointments
4. Receives payment notifications
5. Can join meetings using provided links

## 🔒 Security Features

- **PayPal OAuth**: Secure authentication with PayPal
- **Payment Verification**: Server-side payment execution
- **Secure Meeting Links**: Links generated securely
- **Environment Variables**: Sensitive data protected

## 🎯 Testing Scenarios

### 1. Successful Payment Flow
1. Patient books appointment
2. Selects online consultation
3. Redirected to PayPal
4. Completes payment with sandbox account
5. Returns to success page
6. Payment executed successfully
7. Appointment status updates to "completed"
8. Meeting link becomes available

### 2. Cancelled Payment Flow
1. Patient books appointment
2. Redirected to PayPal
3. Cancels payment
4. Returns to cancel page
5. Appointment remains with "pending" payment status

### 3. Doctor Dashboard Testing
1. Doctor logs in
2. Views appointments with payment status
3. Can add/edit meeting links
4. Sees payment amounts and status

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid Client ID" Error
**Solution**: 
- Check PayPal credentials in environment variables
- Ensure you're using sandbox credentials for testing
- Verify PayPal app is properly configured

### Issue 2: Payment Not Completing
**Solution**:
- Check browser console for errors
- Verify redirect URLs are correct
- Check network connectivity
- Ensure PayPal sandbox is accessible

### Issue 3: Redirect URLs Not Working
**Solution**:
- Check FRONTEND_URL environment variable
- Verify routes are properly configured
- Test URLs manually

### Issue 4: Payment Execution Fails
**Solution**:
- Check PayPal credentials
- Verify payment ID and payer ID
- Check server logs for detailed errors

## 📱 Mobile Testing

### For Mobile Testing:
1. Test on mobile browsers
2. Ensure responsive design works
3. Test PayPal mobile interface
4. Verify redirects work on mobile

## 🔒 Security Notes

### Sandbox Mode Security:
- Sandbox credentials are safe to use in code
- No real money is involved
- Sandbox accounts don't work in production
- Test thoroughly before going live

### Production Considerations:
- Use live credentials only in production
- Implement proper SSL certificates
- Use environment variables for all secrets
- Implement rate limiting
- Add proper error handling

## 📊 Monitoring & Debugging

### PayPal Dashboard:
- Monitor payments in sandbox mode
- Check payment status
- View transaction logs
- Debug failed payments

### Application Logs:
- Check backend console for errors
- Monitor payment execution logs
- Track redirect processing
- Debug payment creation issues

## 🎉 Success Indicators

### When Everything Works:
✅ Payment creation succeeds
✅ PayPal redirect works correctly
✅ Payment execution completes
✅ Payment status updates to "completed"
✅ Meeting link becomes available
✅ Doctor can see payment status
✅ Success/cancel pages work properly

### Next Steps:
1. Test all payment scenarios
2. Verify meeting link functionality
3. Test doctor dashboard features
4. Prepare for production deployment
5. Set up live PayPal credentials

## 🔄 Production Deployment

### 1. Switch to Live Mode
```env
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
```

### 2. Update Frontend URL
```env
FRONTEND_URL=https://yourdomain.com
```

### 3. SSL Certificate
Ensure your domain has a valid SSL certificate for secure payments.

### 4. Error Handling
Implement comprehensive error handling for production use.

## 📞 Support

For PayPal integration issues:
1. Check [PayPal Developer Documentation](https://developer.paypal.com/docs/)
2. Review PayPal sandbox testing guide
3. Check application logs for errors
4. Verify all environment variables are set correctly 