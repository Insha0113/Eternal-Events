import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import API_BASE_URL from '../api';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'users'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin'); return; }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const getToken = () => localStorage.getItem('adminToken');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [bookingsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/bookings`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/users`, { headers })
      ]);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin');
      } else {
        setError('Failed to fetch data');
        setLoading(false);
      }
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBookings(res.data);
    } catch (err) {
      if (err.response?.status === 401) { navigate('/admin'); }
      else setError('Failed to fetch bookings');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/bookings/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchBookings();
    } catch (err) { setError('Failed to update booking status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchBookings();
    } catch (err) { setError('Failed to delete booking'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const username = localStorage.getItem('adminUsername');

  return (
    <div className="admin-dashboard">
      {/* ── Header ── */}
      <div className="dashboard-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {username}</span>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="dashboard-tabs">
        <div className="container">
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            📋 Bookings <span className="tab-count">{bookings.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users <span className="tab-count">{users.length}</span>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="dashboard-content">
        <div className="container">
          {error && <div className="error-message">{error}</div>}

          {/* ════ BOOKINGS TAB ════ */}
          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2>All Bookings ({bookings.length})</h2>
              {bookings.length === 0 ? (
                <div className="no-bookings"><p>No bookings found.</p></div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-header">
                        <span className="booking-type">{booking.type === 'event' ? '🎉 Event' : '🎤 Host'}</span>
                        <span className="booking-status" style={{ backgroundColor: getStatusColor(booking.status) }}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-body">
                        <h3>{booking.name}</h3>
                        <p><strong>Email:</strong> {booking.email}</p>
                        <p><strong>Phone:</strong> {booking.phone}</p>
                        {booking.type === 'event' ? (
                          <>
                            <p><strong>Event Type:</strong> {booking.eventType}</p>
                            <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                            {booking.eventTime && <p><strong>Time:</strong> {booking.eventTime}</p>}
                            {booking.numberOfGuests && <p><strong>Guests:</strong> {booking.numberOfGuests}</p>}
                            {booking.services && <p><strong>Services:</strong> {booking.services}</p>}
                          </>
                        ) : (
                          <>
                            <p><strong>Host Type:</strong> {booking.hostType}</p>
                            <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                            {booking.eventTime && <p><strong>Time:</strong> {booking.eventTime}</p>}
                            {booking.eventLocation && <p><strong>Location:</strong> {booking.eventLocation}</p>}
                          </>
                        )}
                        {booking.message && (
                          <div className="booking-message">
                            <strong>Message:</strong>
                            <p>{booking.message}</p>
                          </div>
                        )}
                        <div className="booking-meta">
                          <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                          {booking.userId && <p><strong>User ID:</strong> {booking.userId}</p>}
                        </div>
                      </div>
                      <div className="booking-actions">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className={`btn btn-delete${booking.status === 'pending' ? ' btn-delete-disabled' : ''}`}
                          disabled={booking.status === 'pending'}
                          title={booking.status === 'pending' ? 'Change status to Confirmed or Cancelled before deleting' : 'Delete this booking'}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════ USERS TAB ════ */}
          {activeTab === 'users' && (
            <div className="users-section">
              <h2>Registered Users ({users.length})</h2>
              {users.length === 0 ? (
                <div className="no-bookings"><p>No users have signed up yet.</p></div>
              ) : (
                <div className="users-table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Provider</th>
                        <th>Joined</th>
                        <th>Bookings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => {
                        const userBookings = bookings.filter(
                          b => b.userId === user.id ||
                            (b.email && b.email.toLowerCase() === user.email.toLowerCase())
                        );
                        return (
                          <tr key={user.id}>
                            <td className="user-num">{idx + 1}</td>
                            <td className="user-name">
                              <div className="user-avatar-mini">
                                {user.photoURL
                                  ? <img src={user.photoURL} alt={user.firstName} />
                                  : <span>{(user.firstName?.[0] || '?') + (user.lastName?.[0] || '')}</span>}
                              </div>
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="user-username">@{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.mobile || '—'}</td>
                            <td>
                              <span className={`provider-badge provider-${user.provider}`}>
                                {user.provider === 'google' ? '🔵 Google' : '🔑 Email'}
                              </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className="booking-count-badge">{userBookings.length}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
