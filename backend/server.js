require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { ETERNAL_VOWS_KNOWLEDGE } = require('./data/eternalVowsKnowledge');

// Ensure fetch is available on all supported Node versions
if (typeof fetch === 'undefined') {
  fetch = (...args) =>
    import('node-fetch').then(({ default: fetchImpl }) => fetchImpl(...args));
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'eternal-vows-secret-key-2024';

// Admin emails that will receive password/username reset links and booking notifications
const ADMIN_EMAILS = [
  'aaj059369@gmail.com',
  'ashiqmuhammed720@gmail.com',
  'ashkarask123@gmail.com',
  'antonyjohneternalevents@gmail.com'
];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage files
const BOOKINGS_FILE = path.join(__dirname, 'data', 'bookings.json');
const ADMIN_FILE = path.join(__dirname, 'data', 'admin.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize data files if they don't exist
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(ADMIN_FILE)) {
  const defaultAdmin = {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    resetToken: null,
    resetTokenExpiry: null
  };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin));
}

// ── Helper functions ──────────────────────────────────────────────────────────

const readBookings = () => {
  try { return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8')); }
  catch { return []; }
};
const writeBookings = (data) => fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(data, null, 2));

const readAdmin = () => {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8')); }
  catch { return null; }
};
const writeAdmin = (data) => fs.writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2));

const readUsers = () => {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
  catch { return []; }
};
const writeUsers = (data) => fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));

// ── Email transporter ─────────────────────────────────────────────────────────

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmailToAdmins = async (subject, htmlBody, replyTo = null) => {
  try {
    const transporter = createTransporter();
    // Send to all admin emails
    for (const email of ADMIN_EMAILS) {
      await transporter.sendMail({
        from: `"Eternal Vows Events" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: htmlBody,
        ...(replyTo ? { replyTo } : {})
      });
    }
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
};

// ── Auth middleware ───────────────────────────────────────────────────────────

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ════════════════════════════════════════════════════════════════════════════
//  USER AUTH ROUTES
// ════════════════════════════════════════════════════════════════════════════

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'firstName, lastName, email and password are required.' });
    }

    const users = readUsers();

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const username = (firstName.trim() + lastName.trim()).toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username,
      mobile: mobile || '',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: 'local',
      photoURL: null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    const { password: _pw, ...safeUser } = newUser;
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const users = readUsers();
    const user = users.find(
      u => u.username === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase()
    );

    if (!user || user.provider !== 'local') {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const { password: _pw, ...safeUser } = user;
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// POST /api/auth/google
app.post('/api/auth/google', async (req, res) => {
  try {
    const { googleUser } = req.body;

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ error: 'Google user data is required.' });
    }

    const users = readUsers();
    let user = users.find(u => u.email.toLowerCase() === googleUser.email.toLowerCase());

    if (!user) {
      const nameParts = (googleUser.name || '').split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';
      const username = (firstName + lastName).toLowerCase().replace(/\s/g, '');

      user = {
        id: Date.now().toString(),
        firstName,
        lastName,
        username,
        mobile: '',
        email: googleUser.email.toLowerCase(),
        password: null,
        provider: 'google',
        photoURL: googleUser.picture || null,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeUsers(users);
    } else {
      if (googleUser.picture && !user.photoURL) {
        user.photoURL = googleUser.picture;
        writeUsers(users);
      }
    }

    const { password: _pw, ...safeUser } = user;
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Server error during Google auth.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', verifyUser, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const { password: _pw, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/auth/mybookings — returns ALL user bookings regardless of deletedByAdmin flag
// User should always see their booking status even after admin archives it
app.get('/api/auth/mybookings', verifyUser, (req, res) => {
  try {
    const bookings = readBookings();
    const users = readUsers();
    const currentUser = users.find(u => u.id === req.user.id);
    // Return ALL bookings for the user — including admin-archived ones
    // so the user always sees their confirmed/cancelled status
    const myBookings = bookings.filter(
      b => b.userId === req.user.id ||
        (currentUser && b.email && b.email.toLowerCase() === currentUser.email.toLowerCase())
    );
    res.json(myBookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN ROUTES
// ════════════════════════════════════════════════════════════════════════════

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = readAdmin();

    if (!admin || admin.username !== username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/forgot-password
// Generates a reset token and sends reset link to all admin emails
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const admin = readAdmin();
    if (!admin) return res.status(500).json({ error: 'Admin not configured' });

    // Generate a secure reset token (random hex string)
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

    // Store token in admin.json
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = expiry;
    writeAdmin(admin);

    // The reset link points to the frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetLink = `${frontendUrl}/admin/reset-password?token=${resetToken}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #fdf6f0; border-radius: 12px;">
        <h2 style="color: #c99a7a; text-align: center; margin-bottom: 8px;">🔑 Admin Password Reset</h2>
        <p style="color: #4a4a4a; text-align: center; margin-bottom: 24px;">A password reset was requested for the Eternal Vows Events admin account.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetLink}" 
             style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #c99a7a, #b8956e); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1rem;">
            Reset Password
          </a>
        </div>
        <p style="color: #7a6558; font-size: 0.88rem; text-align: center;">This link expires in <strong>1 hour</strong>. If you did not request a reset, please ignore this email.</p>
        <p style="color: #aaa; font-size: 0.78rem; text-align: center; margin-top: 20px;">– Eternal Vows Events System</p>
      </div>
    `;

    const sent = await sendEmailToAdmins('Eternal Vows Events – Admin Password Reset', emailHtml);

    if (sent) {
      res.json({ message: 'Password reset link sent to all admin email addresses.' });
    } else {
      res.status(500).json({ error: 'Failed to send email. Please check server email configuration.' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/reset-password
// Validates token and updates password
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const admin = readAdmin();
    if (!admin || !admin.resetToken || admin.resetToken !== token) {
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    }
    if (Date.now() > admin.resetTokenExpiry) {
      return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
    }

    // Update password and clear token
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    writeAdmin(admin);

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/forgot-username
// Sends the admin username to all admin email addresses
app.post('/api/admin/forgot-username', async (req, res) => {
  try {
    const admin = readAdmin();
    if (!admin) return res.status(500).json({ error: 'Admin not configured' });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #fdf6f0; border-radius: 12px;">
        <h2 style="color: #c99a7a; text-align: center; margin-bottom: 8px;">👤 Admin Username Reminder</h2>
        <p style="color: #4a4a4a; text-align: center; margin-bottom: 24px;">Your Eternal Vows Events admin username is:</p>
        <div style="text-align: center; background: #fff; border: 2px solid #c99a7a; border-radius: 8px; padding: 18px 32px; margin: 0 auto 24px; display: inline-block; width: fit-content;">
          <span style="font-size: 1.6rem; font-weight: 700; color: #c99a7a; letter-spacing: 2px;">${admin.username}</span>
        </div>
        <p style="color: #7a6558; font-size: 0.88rem; text-align: center;">If you also need to reset your password, use the "Forgot Password" option on the admin login page.</p>
        <p style="color: #aaa; font-size: 0.78rem; text-align: center; margin-top: 20px;">– Eternal Vows Events System</p>
      </div>
    `;

    const sent = await sendEmailToAdmins('Eternal Vows Events – Admin Username Reminder', emailHtml);

    if (sent) {
      res.json({ message: 'Your username has been sent to all admin email addresses.' });
    } else {
      res.status(500).json({ error: 'Failed to send email. Please check server email configuration.' });
    }
  } catch (error) {
    console.error('Forgot username error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/bookings — only returns non-archived bookings (deletedByAdmin !== true)
app.get('/api/admin/bookings', verifyAdmin, (req, res) => {
  try {
    const all = readBookings();
    // Admin only sees bookings not yet archived
    const visible = all.filter(b => !b.deletedByAdmin);
    res.json(visible);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/bookings/:id
app.put('/api/admin/bookings/:id', verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const bookings = readBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    writeBookings(bookings);
    res.json(bookings[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/bookings/:id
// SOFT DELETE: sets deletedByAdmin = true instead of removing the record.
// The booking record stays in bookings.json so the user can still see their status.
// The admin dashboard will no longer show it (filtered out in GET /api/admin/bookings).
app.delete('/api/admin/bookings/:id', verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const bookings = readBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Booking not found' });

    // Soft delete — keep record for user, just hide from admin view
    bookings[idx].deletedByAdmin = true;
    bookings[idx].deletedAt = new Date().toISOString();
    writeBookings(bookings);

    res.json({ message: 'Booking archived successfully. User can still see their booking status.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/users — admin only
app.get('/api/admin/users', verifyAdmin, (req, res) => {
  try {
    const users = readUsers().map(({ password: _pw, ...safe }) => safe);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  BOOKING ROUTES
// ════════════════════════════════════════════════════════════════════════════

app.post('/api/bookings/event', async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, eventTime, numberOfGuests, message, services, userId } = req.body;
    if (!name || !email || !phone || !eventType || !eventDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const bookings = readBookings();
    const newBooking = {
      id: Date.now().toString(), type: 'event', name, email, phone,
      eventType, eventDate, eventTime, numberOfGuests, message,
      services: services || '', status: 'pending',
      userId: userId || null,
      deletedByAdmin: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    writeBookings(bookings);

    // Send email notification with full booking details to all admins
    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : eventDate;
    const bookingEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fdf6f0; border-radius: 12px;">
        <h2 style="color: #c99a7a; text-align: center; margin-bottom: 4px;">📋 New Event Booking Received</h2>
        <p style="color: #888; text-align: center; margin-bottom: 28px; font-size: 0.9rem;">Submitted on ${new Date().toLocaleString('en-IN')}</p>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
          <tbody>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558; width: 40%;">Full Name</td><td style="padding: 12px 18px; color: #333;">${name}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Email</td><td style="padding: 12px 18px; color: #333;"><a href="mailto:${email}" style="color: #c99a7a;">${email}</a></td></tr>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Phone</td><td style="padding: 12px 18px; color: #333;">${phone}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Event Type</td><td style="padding: 12px 18px; color: #333;">${eventType}</td></tr>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Event Date</td><td style="padding: 12px 18px; color: #333;">${formattedDate}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Event Time</td><td style="padding: 12px 18px; color: #333;">${eventTime || '—'}</td></tr>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">No. of Guests</td><td style="padding: 12px 18px; color: #333;">${numberOfGuests || '—'}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Services Requested</td><td style="padding: 12px 18px; color: #333;">${services || '—'}</td></tr>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Message</td><td style="padding: 12px 18px; color: #333;">${message || '—'}</td></tr>
          </tbody>
        </table>
        <p style="color: #aaa; font-size: 0.78rem; text-align: center; margin-top: 24px;">– Eternal Vows Events Booking System</p>
      </div>
    `;
    sendEmailToAdmins('📋 New Event Booking – Eternal Vows Events', bookingEmailHtml, email).catch(err =>
      console.error('Failed to send booking notification email:', err)
    );

    res.status(201).json({ message: 'Event booking submitted successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/bookings/host', async (req, res) => {
  try {
    const { name, email, phone, hostType, eventDate, eventTime, eventLocation, message } = req.body;
    if (!name || !email || !phone || !hostType || !eventDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const bookings = readBookings();
    const newBooking = {
      id: Date.now().toString(), type: 'host', name, email, phone,
      hostType, eventDate, eventTime, eventLocation, message,
      status: 'pending',
      deletedByAdmin: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    writeBookings(bookings);

    // Send email notification with full host booking details to all admins
    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : eventDate;
    const hostEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fdf6f0; border-radius: 12px;">
        <h2 style="color: #c99a7a; text-align: center; margin-bottom: 4px;">🎤 New Host Booking Received</h2>
        <p style="color: #888; text-align: center; margin-bottom: 28px; font-size: 0.9rem;">Submitted on ${new Date().toLocaleString('en-IN')}</p>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
          <tbody>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558; width: 40%;">Full Name</td><td style="padding: 12px 18px; color: #333;">${name}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Email</td><td style="padding: 12px 18px; color: #333;"><a href="mailto:${email}" style="color: #c99a7a;">${email}</a></td></tr>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Phone</td><td style="padding: 12px 18px; color: #333;">${phone}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Host Type</td><td style="padding: 12px 18px; color: #333;">${hostType}</td></tr>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Event Date</td><td style="padding: 12px 18px; color: #333;">${formattedDate}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Event Time</td><td style="padding: 12px 18px; color: #333;">${eventTime || '—'}</td></tr>
            <tr style="background: #fdf0e6;"><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Event Location</td><td style="padding: 12px 18px; color: #333;">${eventLocation || '—'}</td></tr>
            <tr><td style="padding: 12px 18px; font-weight: 600; color: #7a6558;">Message</td><td style="padding: 12px 18px; color: #333;">${message || '—'}</td></tr>
          </tbody>
        </table>
        <p style="color: #aaa; font-size: 0.78rem; text-align: center; margin-top: 24px;">– Eternal Vows Events Booking System</p>
      </div>
    `;
    sendEmailToAdmins('🎤 New Host Booking – Eternal Vows Events', hostEmailHtml, email).catch(err =>
      console.error('Failed to send host booking notification email:', err)
    );

    res.status(201).json({ message: 'Host booking submitted successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  MISC ROUTES
// ════════════════════════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Chatbot is not configured. Missing OPENAI_API_KEY on the server.' });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages (array) is required.' });
    }
    const systemPrompt = `
You are Antony, an AI assistant representing Eternal Vows Events, a premium event management company.
Answer as a friendly, professional human team member.
Use ONLY the following company information as your knowledge base. If you are not sure about something, clearly say you are not fully sure and suggest the user contact the team directly.
${ETERNAL_VOWS_KNOWLEDGE}
    `.trim();
    const conversation = messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 2000),
    }));
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, ...conversation], temperature: 0.4, max_tokens: 400 }),
    });
    const data = await response.json();
    if (!response.ok) { console.error('OpenAI API error:', data); return res.status(500).json({ error: 'Failed to generate chatbot response.' }); }
    const answer = data.choices?.[0]?.message?.content?.trim();
    res.json({ answer: answer || "I'm sorry, I'm having trouble answering right now. Please try again or contact the Eternal Vows Events team directly." });
  } catch (error) {
    console.error('Chatbot endpoint error:', error);
    res.status(500).json({ error: 'Server error while generating chatbot response.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
