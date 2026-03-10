import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';
import API_BASE_URL from '../api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'forgot-password' | 'forgot-username'
  const [successMsg, setSuccessMsg] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, credentials);
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUsername', response.data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/forgot-password`);
      setSuccessMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleForgotUsername = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/forgot-username`);
      setSuccessMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send username email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">

          {/* ── LOGIN MODE ── */}
          {mode === 'login' && (
            <>
              <h1>Admin Login</h1>
              <p>Enter your credentials to access the admin dashboard</p>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-login">Login</button>
              </form>

              <div className="forgot-links">
                <button className="forgot-link-btn" onClick={() => { setMode('forgot-password'); setError(''); setSuccessMsg(''); }}>
                  🔑 Forgot Password?
                </button>
                <span className="forgot-sep">·</span>
                <button className="forgot-link-btn" onClick={() => { setMode('forgot-username'); setError(''); setSuccessMsg(''); }}>
                  👤 Forgot Username?
                </button>
              </div>
            </>
          )}

          {/* ── FORGOT PASSWORD MODE ── */}
          {mode === 'forgot-password' && (
            <>
              <div className="recovery-icon">🔑</div>
              <h1>Reset Password</h1>
              <p>A password reset link will be sent to all registered admin email addresses.</p>

              {!successMsg ? (
                <form onSubmit={handleForgotPassword} className="login-form">
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="btn btn-login" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <p>{successMsg}</p>
                  <p className="success-sub">Check your inbox at:<br />
                    <strong>aaj059369@gmail.com</strong><br />
                    <strong>ashiqmuhammed720@gmail.com</strong><br />
                    <strong>ashkarask123@gmail.com</strong>
                  </p>
                </div>
              )}

              <button className="back-to-login" onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}>
                ← Back to Login
              </button>
            </>
          )}

          {/* ── FORGOT USERNAME MODE ── */}
          {mode === 'forgot-username' && (
            <>
              <div className="recovery-icon">👤</div>
              <h1>Forgot Username</h1>
              <p>Your admin username will be sent to all registered admin email addresses.</p>

              {!successMsg ? (
                <form onSubmit={handleForgotUsername} className="login-form">
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="btn btn-login" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Username Reminder'}
                  </button>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <p>{successMsg}</p>
                  <p className="success-sub">Check your inbox at:<br />
                    <strong>aaj059369@gmail.com</strong><br />
                    <strong>ashiqmuhammed720@gmail.com</strong><br />
                    <strong>ashkarask123@gmail.com</strong>
                  </p>
                </div>
              )}

              <button className="back-to-login" onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}>
                ← Back to Login
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
