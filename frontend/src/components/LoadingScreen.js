import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './LoadingScreen.css';
import logo from '../assets/images/logo (2).png';

const LoadingScreen = () => {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const location = useLocation();

    const show = () => {
        setFadeOut(false);
        setVisible(true);
        const fadeTimer = setTimeout(() => setFadeOut(true), 700);
        const hideTimer = setTimeout(() => setVisible(false), 1200);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    };

    // Show on first mount
    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeOut(true), 900);
        const hideTimer = setTimeout(() => setVisible(false), 1400);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    // Show on every route change (navigation between pages)
    useEffect(() => {
        const cleanup = show();
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    if (!visible) return null;

    return (
        <div className={`loading-screen${fadeOut ? ' loading-screen--fade' : ''}`}>
            <div className="loading-screen-content">
                <img src={logo} alt="Eternal Events Logo" className="loading-screen-logo" />
                <p className="loading-screen-brand">Eternal Vows Events</p>
                <div className="loading-bar-track">
                    <div className="loading-bar-fill" />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
