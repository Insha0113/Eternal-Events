import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../AuthContext';
import API_BASE_URL from '../api';
import './SignUp.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const redirectTo = location.state?.from || '/';

    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                username: form.username,
                password: form.password
            });
            login(data.token, data.user);
            navigate(redirectTo);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Real Google OAuth
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const googleUser = await userInfoRes.json();
                const { data } = await axios.post(`${API_BASE_URL}/api/auth/google`, {
                    googleUser: {
                        email: googleUser.email,
                        name: googleUser.name,
                        picture: googleUser.picture,
                        sub: googleUser.sub
                    }
                });
                login(data.token, data.user);
                navigate(redirectTo);
            } catch (err) {
                setError('Google login failed. Please try again.');
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            setError('Google login was cancelled or failed.');
            setGoogleLoading(false);
        }
    });

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-accent" />

                    <div className="auth-header">
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue planning extraordinary events</p>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        className="google-btn"
                        onClick={() => handleGoogleLogin()}
                        disabled={googleLoading}
                    >
                        {googleLoading ? (
                            <span className="btn-spinner" style={{ borderTopColor: '#4285F4', borderColor: 'rgba(66,133,244,0.3)', width: 18, height: 18 }} />
                        ) : (
                            <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        Login with Google
                    </button>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="e.g. JohnDoe (first name + last name)"
                                required
                                autoComplete="username"
                            />
                            <span className="field-hint">Enter your username (FirstnameLastname) or email address</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? <span className="btn-spinner" /> : 'Login'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{' '}
                        <Link to="/signup" state={{ from: redirectTo }} className="auth-switch-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
