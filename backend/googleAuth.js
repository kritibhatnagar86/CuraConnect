const express = require('express');
const router = express.Router();
const fs = require('fs');
const { google } = require('googleapis');
const Doctor = require('./models/Doctor');

const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id } = credentials.web;
const redirect_uri = 'http://localhost:5000/api/google/oauth/callback';

const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, redirect_uri
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

// Step 1: Redirect user to Google for consent
// router.get('/auth/google', (req, res) => {
//   const doctorEmail = req.query.email;
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//     prompt: 'consent',
//     state: doctorEmail // Pass email in state parameter
//   });
//   res.redirect(authUrl);
// });
router.get('/auth/google', (req, res) => {
  const state = req.query.state; // get state from frontend
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state // pass state to Google
  });
  res.redirect(authUrl);
});

// Step 2: Google redirects back with code
router.get('/oauth/callback', async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    if (!code) {
      return res.send('No code received from Google.');
    }
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    let doctor = null;
    // Prefer state as doctorId (ObjectId), fallback to email for legacy
    if (state && state.match && state.match(/^[0-9a-fA-F]{24}$/)) {
      doctor = await Doctor.findById(state);
    } else if (state) {
      doctor = await Doctor.findOne({ email: state });
    }
    if (!doctor) {
      return res.send('No doctor found with this ID or email.');
    }
    const updateResult = await Doctor.updateOne({ _id: doctor._id }, { googleTokens: tokens });
    console.log('Google token update result:', updateResult);
    return res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h2>Google Calendar connected!</h2>
          <p>You can close this tab and return to the app.</p>
          <a href="http://localhost:3000/doctor/dashboard">
            <button style="padding: 10px 20px; font-size: 16px; background: #8B5CF6; color: white; border: none; border-radius: 5px; cursor: pointer;">Go to Doctor Dashboard</button>
          </a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.send('OAuth error: ' + error.message);
  }
});

module.exports = router;
