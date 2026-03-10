import React, { useState } from 'react';
import axios from 'axios';
import './BookHost.css';

const BookHost = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hostType: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/bookings/host', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        hostType: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit booking. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="book-host-page">
        <div className="success-message">
          <h2>✅ Host Booking Submitted Successfully!</h2>
          <p>Thank you for your booking. We will contact you soon to confirm the details.</p>
          <button onClick={() => setSubmitted(false)} className="btn btn-primary">
            Submit Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-host-page">
      <div className="book-hero">
        <h1>Book a Host</h1>
        <p>Professional hosts to make your event memorable</p>
      </div>

      <div className="book-content">
        <div className="container">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hostType">Host Type *</label>
              <select
                id="hostType"
                name="hostType"
                value={formData.hostType}
                onChange={handleChange}
                required
              >
                <option value="">Select Host Type</option>
                <option value="MC">Master of Ceremonies (MC)</option>
                <option value="DJ">DJ</option>
                <option value="Entertainer">Entertainer</option>
                <option value="Speaker">Keynote Speaker</option>
                <option value="Comedian">Comedian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventDate">Event Date *</label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventTime">Event Time</label>
                <input
                  type="time"
                  id="eventTime"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="eventLocation">Event Location</label>
              <input
                type="text"
                id="eventLocation"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                placeholder="Enter event location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us more about your event and host requirements..."
              ></textarea>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-submit">
              Submit Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookHost;
