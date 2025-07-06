# Google Meet Integration Setup Guide

## Overview
This guide helps you set up automated Google Meet link generation for online consultations. The system will automatically create Google Calendar events with Meet links after successful payment.

## Prerequisites
1. Google Cloud Project with Calendar API enabled
2. `credentials.json` file in the backend directory
3. PayPal sandbox accounts configured

## Step 1: Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials (Desktop application)
5. Download `credentials.json` and place it in the `backend/` directory
6. **Important**: Update the redirect URI in Google Cloud Console to: `http://localhost:5000/api/google/auth/google/callback`

## Step 2: Doctor Google OAuth Connection
There are two ways for doctors to connect their Google account:

### Option A: During Login
1. Go to Doctor Login page
2. Enter doctor's email address
3. Click "Connect Google Calendar" button
4. Complete Google OAuth flow
5. Tokens will be saved to the doctor's profile

### Option B: From Dashboard
1. Login as a doctor
2. In the dashboard, find the "Google Calendar Integration" section
3. Click "Connect Google Calendar" button
4. Complete Google OAuth flow
5. Tokens will be saved to the doctor's profile

## Step 3: Testing the Complete Flow

### 1. Connect Doctor's Google Account
```
1. Login as a doctor
2. Click "Connect Google Calendar" 
3. Authorize the application
4. You should see "Google Calendar connected!" message
```

### 2. Book and Pay for Appointment
```
1. Login as a patient
2. Search for the doctor who connected their Google account
3. Book an online consultation
4. Complete PayPal payment
```

### 3. Verify Meet Link Generation
```
1. After payment, check the appointment in doctor dashboard
2. The appointment should have a valid Google Meet link
3. The link should work and open Google Meet
```

## Troubleshooting

### "Invalid video call name" Error
- **Cause**: Random meeting links were being generated
- **Solution**: The system now only generates valid Meet links via Google Calendar API
- **Action**: Make sure the doctor has connected their Google account

### "Doctor doesn't have Google tokens" Error
- **Cause**: Doctor hasn't completed Google OAuth
- **Solution**: Have the doctor connect their Google account first
- **Action**: Use the "Connect Google Calendar" button in login or dashboard

### Google OAuth Not Working
- **Check**: `credentials.json` file exists in backend directory
- **Check**: Google Calendar API is enabled in Google Cloud Console
- **Check**: OAuth consent screen is configured
- **Check**: Redirect URI in Google Cloud Console is set to: `http://localhost:5000/api/google/auth/google/callback`
- **Check**: Server is running and routes are properly mounted

## API Endpoints

### Google OAuth Flow
- `GET /api/google/auth/google?email=doctor@example.com` - Start OAuth
- `GET /api/google/auth/google/callback` - OAuth callback (handles token saving)

### Manual Event Creation (for testing)
- `POST /api/google/create-event` - Create a test calendar event

## Environment Variables
Make sure these are set in your `.env` file:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
FRONTEND_URL=http://localhost:3000
```

## Notes
- Meet links are only generated for online consultations
- Links are generated automatically after successful payment
- Each doctor needs to connect their own Google account
- Meet links are persistent and can be used anytime
- The system uses the doctor's primary calendar for event creation 