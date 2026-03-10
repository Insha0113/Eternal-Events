require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

transporter.sendMail({
  from: `"Eternal Vows Events" <${process.env.EMAIL_USER}>`,
  to: 'antonyjohneternalevents@gmail.com',
  subject: 'Test - Booking Notification Working',
  html: '<h2>Test Email</h2><p>Booking notifications are working correctly from the server.</p>'
}, (err, info) => {
  if (err) { console.log('SEND ERROR:', err.message); }
  else { console.log('Email sent! MessageId:', info.messageId); }
});
