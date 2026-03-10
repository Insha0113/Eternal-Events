import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link. Please request a new one.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/admin/reset-password', {
                token,
                newPassword
            });
            setSuccess(res.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="recovery-icon">🔐</div>
                    <h1>Set New Password</h1>
                    <p>Enter your new password for the Eternal Vows Events admin account.</p>

                    {success ? (
                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <p>{success}</p>
                            <button
                                className="btn btn-login"
                                style={{ marginTop: '1.5rem' }}
                                onClick={() => navigate('/admin')}
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="At least 6 characters"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Re-enter new password"
                                    autoComplete="new-password"
                                />
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button
                                type="submit"
                                className="btn btn-login"
                                disabled={loading || !token}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}

                    {!success && (
                        <button className="back-to-login" onClick={() => navigate('/admin')}>
                            ← Back to Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminResetPassword;
