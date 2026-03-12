import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './BookEvent.css';
import API_BASE_URL from '../api';

// ── Validation helpers ────────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;

// Returns tomorrow's date in YYYY-MM-DD format
const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// Validate all fields; returns an errors object (empty = valid)
const validateFields = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'Enter full name';
  if (!formData.email.trim() || !emailRegex.test(formData.email.trim()))
    errors.email = 'Enter a valid mail address';
  const rawPhone = formData.phone.replace(/\s/g, '');
  if (!rawPhone || !phoneRegex.test(rawPhone))
    errors.phone = 'Enter a valid mobile number';
  if (!formData.eventType) errors.eventType = 'Select event type';
  if (formData.eventType === 'Other' && !formData.otherEventType.trim())
    errors.otherEventType = 'Please describe your event type';
  if (!formData.eventDate || formData.eventDate < getTomorrow())
    errors.eventDate = 'Enter a valid date';
  if (!formData.eventTime) errors.eventTime = 'Enter a valid time';
  return errors;
};

const BookEvent = () => {
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();

  const initialForm = {
    name: '', email: '', phone: '',
    eventType: '', otherEventType: '', eventDate: '', eventTime: '',
    numberOfGuests: '', services: '', message: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [authWarningShown, setAuthWarningShown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [refreshBookings, setRefreshBookings] = useState(0);
  const toastTimer = useRef(null);

  // Pre-fill from URL params
  useEffect(() => {
    const eventFromUrl = searchParams.get('event');
    const servicesFromUrl = searchParams.get('services');
    if (eventFromUrl || servicesFromUrl) {
      setFormData(prev => ({
        ...prev,
        ...(eventFromUrl && { eventType: decodeURIComponent(eventFromUrl) }),
        ...(servicesFromUrl && { services: decodeURIComponent(servicesFromUrl).replace(/,/g, ', ') })
      }));
    }
  }, [searchParams]);

  // Auto-fill name and email from logged-in user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || `${user.firstName} ${user.lastName}`.trim(),
        email: prev.email || user.email || '',
        phone: prev.phone || user.mobile || ''
      }));
    }
  }, [user]);

  // Fetch this user's booking history when logged in
  useEffect(() => {
    if (user && token) {
      setLoadingBookings(true);
      axios.get(`${API_BASE_URL}/api/auth/mybookings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setMyBookings(res.data))
        .catch(() => { })
        .finally(() => setLoadingBookings(false));
    } else {
      setMyBookings([]);
    }
  }, [user, token, refreshBookings]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the field error as soon as the user starts correcting it
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleFieldFocus = () => {
    if (!user) setAuthWarningShown(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Block submission if not logged in
    if (!user) {
      setGeneralError('Please log in or sign up to submit a booking.');
      return;
    }

    // Run full validation
    const errors = validateFields(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error field
      const firstErrorKey = Object.keys(errors)[0];
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    if (!agreedToTerms) {
      setGeneralError('Please agree to the Terms & Conditions and Privacy Policy to submit your booking.');
      return;
    }

    // ── One booking per day check ──────────────────────────────────────────────
    // A user may not have more than one active (non-cancelled) booking on the same date.
    const alreadyBookedOnDate = myBookings.some(
      b =>
        b.type === 'event' &&
        b.status !== 'cancelled' &&
        b.eventDate === formData.eventDate
    );
    if (alreadyBookedOnDate) {
      const readable = new Date(formData.eventDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      setGeneralError(
        `You already have an active booking on ${readable}. Only one event booking per day is allowed. Please choose a different date.`
      );
      // Highlight the date field
      setFieldErrors(prev => ({ ...prev, eventDate: 'A booking already exists on this date' }));
      document.getElementById('eventDate')?.focus();
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/bookings/event`, {
        ...formData,
        userId: user.id
      });

      // Reset form
      setFormData({
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email || '',
        phone: user.mobile || '',
        eventType: '', otherEventType: '', eventDate: '', eventTime: '',
        numberOfGuests: '', services: '', message: ''
      });
      setFieldErrors({});
      setAgreedToTerms(false);

      // Immediately scroll to top so they see the booking status update
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Show toast, then refresh booking list after it disappears
      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => {
        setShowToast(false);
        setRefreshBookings(r => r + 1); // triggers re-fetch of bookings
      }, 2500);
    } catch (err) {
      setGeneralError(err.response?.data?.error || 'Failed to submit booking. Please try again.');
    }
  };

  // Clean up timer on unmount
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // ── Booking status card ──────────────────────────────────────────────────────
  const BookingStatusCard = ({ booking }) => {
    const [dismissed, setDismissed] = useState(false);
    const { status, eventType, eventDate } = booking;

    if (dismissed) return null;

    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    let statusClass = '', icon = '', statusMessage = '';
    if (status === 'confirmed') {
      statusClass = 'status-confirmed'; icon = '🎉';
      statusMessage = "Great news! Your event is booked and confirmed. We can't wait to make your special day memorable.";
    } else if (status === 'cancelled') {
      statusClass = 'status-cancelled'; icon = '😔';
      statusMessage = 'Sorry for the inconvenience — your booking has been cancelled. Please reach out to us if you need any help.';
    } else {
      statusClass = 'status-pending'; icon = '⏳';
      statusMessage = 'Your booking is under review. We will confirm it soon!';
    }

    return (
      <div className={`booking-status-card ${statusClass}`}>
        {/* Close button — shown on all statuses */}
        <button
          className="status-card-close-btn"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          title="Dismiss"
        >
          &times;
        </button>
        <div className="status-card-icon">{icon}</div>
        <div className="status-card-body">
          <div className="status-card-header">
            <span className="status-event-type">{eventType}</span>
            <span className={`status-badge status-badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
          {formattedDate && <p className="status-date">📅 {formattedDate}</p>}
          <p className="status-message">{statusMessage}</p>
        </div>
      </div>
    );
  };

  const minDate = getTomorrow();

  return (
    <div className="book-event-page">
      <div className="glow-dot" style={{ top: '20%', left: '10%' }} />
      <div className="glow-dot" style={{ top: '60%', right: '15%' }} />

      {/* ── Toast notification ── */}
      {showToast && (
        <div className="booking-toast">
          <span className="booking-toast-icon">✅</span>
          <span>Your booking has been submitted!</span>
        </div>
      )}

      <div className="book-hero">
        <h1>Book Your Event</h1>
        <p>Let us make your special day unforgettable</p>
      </div>

      <div className="book-content">
        <div className="container">

          {/* ── My Booking Status (logged-in users only) ── */}
          {user && myBookings.filter(b => b.type === 'event').length > 0 && (
            <div className="my-bookings-section">
              <h2 className="my-bookings-title">📌 Your Booking Status</h2>
              {loadingBookings ? (
                <p className="loading-text">Loading your bookings...</p>
              ) : (
                <div className="my-bookings-list">
                  {myBookings
                    .filter(b => b.type === 'event')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(b => <BookingStatusCard key={b.id} booking={b} />)}
                </div>
              )}
            </div>
          )}

          {/* ── Auth Warning Banner ── */}
          {!user && authWarningShown && (
            <div className="auth-warning-banner">
              <span>⚠️ Please <strong>sign up or log in</strong> to submit a booking.</span>
              <Link to="/signup" state={{ from: '/book-event' }} className="auth-warning-btn">Sign Up / Login</Link>
            </div>
          )}

          {/* ── Booking Form ── */}
          <form onSubmit={handleSubmit} className="booking-form" noValidate>

            {/* Top notice if not logged in */}
            {!user && (
              <div className="form-auth-notice">
                <span>🔒 You need to be logged in to book an event.</span>
                <Link to="/signup" state={{ from: '/book-event' }} className="form-auth-link">Sign Up</Link>
                <span className="form-auth-sep">or</span>
                <Link to="/login" state={{ from: '/book-event' }} className="form-auth-link">Login</Link>
              </div>
            )}

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              {fieldErrors.name && <span className="field-error-msg">{fieldErrors.name}</span>}
              <input
                type="text" id="name" name="name" value={formData.name}
                onChange={handleChange} onFocus={handleFieldFocus}
                className={fieldErrors.name ? 'input-error' : ''}
                placeholder="Full name"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              {fieldErrors.email && <span className="field-error-msg">{fieldErrors.email}</span>}
              <input
                type="email" id="email" name="email" value={formData.email}
                onChange={handleChange} onFocus={handleFieldFocus}
                className={fieldErrors.email ? 'input-error' : ''}
                placeholder="email@example.com"
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              {fieldErrors.phone && <span className="field-error-msg">{fieldErrors.phone}</span>}
              <input
                type="tel" id="phone" name="phone" value={formData.phone}
                onChange={handleChange} onFocus={handleFieldFocus}
                className={fieldErrors.phone ? 'input-error' : ''}
                placeholder="e.g. 9876543210"
              />
            </div>

            {/* Event Type */}
            <div className="form-group">
              <label htmlFor="eventType">Event Type *</label>
              {fieldErrors.eventType && <span className="field-error-msg">{fieldErrors.eventType}</span>}
              <select
                id="eventType" name="eventType" value={formData.eventType}
                onChange={handleChange} onFocus={handleFieldFocus}
                className={fieldErrors.eventType ? 'input-error' : ''}
              >
                <option value="">Select Event Type</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Graduation">Graduation</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Festival">Festival</option>
                <option value="Concert">Concert/Show</option>
                <option value="Launch">Launch Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Other Event Type - shown only when Other is selected */}
            {formData.eventType === 'Other' && (
              <div className="form-group other-event-type-group">
                <label htmlFor="otherEventType">Please specify your event type *</label>
                {fieldErrors.otherEventType && <span className="field-error-msg">{fieldErrors.otherEventType}</span>}
                <input
                  type="text"
                  id="otherEventType"
                  name="otherEventType"
                  value={formData.otherEventType}
                  onChange={handleChange}
                  onFocus={handleFieldFocus}
                  className={fieldErrors.otherEventType ? 'input-error' : ''}
                  placeholder="e.g. Baby Shower, Reunion, Farewell..."
                  autoFocus
                />
              </div>
            )}

            {/* Date & Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventDate">Event Date *</label>
                {fieldErrors.eventDate && <span className="field-error-msg">{fieldErrors.eventDate}</span>}
                <input
                  type="date" id="eventDate" name="eventDate"
                  value={formData.eventDate}
                  min={minDate}
                  onChange={handleChange} onFocus={handleFieldFocus}
                  className={fieldErrors.eventDate ? 'input-error' : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventTime">Event Time *</label>
                {fieldErrors.eventTime && <span className="field-error-msg">{fieldErrors.eventTime}</span>}
                <input
                  type="time" id="eventTime" name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  className={fieldErrors.eventTime ? 'input-error' : ''}
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div className="form-group">
              <label htmlFor="numberOfGuests">Number of Guests</label>
              <input
                type="number" id="numberOfGuests" name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange} onFocus={handleFieldFocus}
                min="1" placeholder="e.g. 100"
              />
            </div>

            {/* Services */}
            <div className="form-group">
              <label htmlFor="services">Requested Services (optional)</label>
              <input
                type="text" id="services" name="services" value={formData.services}
                onChange={handleChange}
                placeholder="e.g. Photography, Catering"
                className={formData.services ? 'form-prefilled' : ''}
              />
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="message">Additional Message</label>
              <textarea
                id="message" name="message" value={formData.message}
                onChange={handleChange} rows="4"
                placeholder="Tell us about your event..."
              />
            </div>

            {/* Terms & Conditions */}
            <div className="form-group form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="booking-terms-checkbox"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="booking-policy-link">Terms &amp; Conditions</Link>
                  {' '}and{' '}
                  <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="booking-policy-link">Privacy Policy</Link>
                </span>
              </label>
            </div>

            {/* Auth block error (not logged in) */}
            {!user && generalError && (
              <div className="auth-block-error">
                <p>{generalError}</p>
                <Link to="/signup" state={{ from: '/book-event' }} className="auth-block-btn">Sign Up / Login →</Link>
              </div>
            )}

            {/* General error (logged-in user) */}
            {user && generalError && <div className="error-message">{generalError}</div>}

            {/* Submit */}
            <div className="form-submit-row">
              <button
                type="submit"
                className="btn btn-submit"
                disabled={!agreedToTerms}
                title={!agreedToTerms ? 'Please agree to the Terms & Conditions first' : ''}
              >
                Submit Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookEvent;
