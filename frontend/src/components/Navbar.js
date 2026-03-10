import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo (2).png';
import loginIcon from '../assets/images/loginincon1.png';
import { useAuth } from '../AuthContext';
import './Navbar.css';

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=919539118207&text&type=phone_number&app_absent=0';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [navHeight, setNavHeight] = useState(70);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const isActive = (path) => location.pathname === path;

  // ── Measure real navbar height and keep CSS variable in sync
  useEffect(() => {
    if (!navRef.current) return;
    const measure = () => {
      const h = navRef.current.getBoundingClientRect().height;
      setNavHeight(h);
      document.documentElement.style.setProperty('--navbar-height', `${h}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(navRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Scroll-reveal
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY < 10) {
          setNavVisible(true);
        } else if (currentY < lastScrollY.current) {
          setNavVisible(true);
        } else if (currentY > lastScrollY.current + 5) {
          setNavVisible(false);
          setIsMenuOpen(false);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close avatar dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Close mobile menu when clicking/touching outside the drawer
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!isMenuOpen) return;
      const clickedInsideMenu = menuRef.current && menuRef.current.contains(e.target);
      const clickedToggle = toggleRef.current && toggleRef.current.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    // Stay on the current page — do not redirect
  };

  const getInitials = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) return user.firstName[0].toUpperCase();
    return user.email ? user.email[0].toUpperCase() : '?';
  };

  const AuthControl = ({ slot }) => (
    <div className={`auth-control auth-control--${slot}`} ref={slot === 'desktop' ? dropdownRef : null}>
      {user ? (
        <>
          <button
            className="profile-avatar"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User profile menu"
            aria-expanded={dropdownOpen}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={`${user.firstName} ${user.lastName}`} className="avatar-image" />
            ) : (
              <span className="avatar-initials">{getInitials()}</span>
            )}
          </button>
          {dropdownOpen && (
            <div className="avatar-dropdown">
              <div className="dropdown-user-info">
                <span className="dropdown-name">{user?.firstName} {user?.lastName}</span>
                <span className="dropdown-username">@{user?.username}</span>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-logout" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <Link to="/signup" className="login-icon-btn" aria-label="Sign up or Login">
          <img src={loginIcon} alt="Login / Sign Up" className="login-icon-img" />
        </Link>
      )}
    </div>
  );

  return (
    <>
      <nav ref={navRef} className={`navbar${navVisible ? '' : ' navbar--hidden'}`}>
        <div className="navbar-container">

          {/* ── Hamburger (mobile only, far left) */}
          <button
            ref={toggleRef}
            className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          {/* ── Logo */}
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Eternal Events" className="logo-image" />
          </Link>

          {/* ── Desktop/Mobile nav links */}
          <div ref={menuRef} className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/about" className={`navbar-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/services" className={`navbar-link ${isActive('/services') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Our Services</Link>
            <Link to="/addon-services" className={`navbar-link ${isActive('/addon-services') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Add on Services</Link>
            <Link to="/gallery" className={`navbar-link ${isActive('/gallery') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Gallery</Link>
            <Link to="/book-event" className={`navbar-link ${isActive('/book-event') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Book Event</Link>

            {/* Desktop auth */}
            <div className="desktop-auth-slot">
              <AuthControl slot="desktop" />
            </div>

            {/* Mobile social icons pinned to bottom of drawer */}
            <div className="mobile-drawer-social">
              <p className="drawer-follow-label">Follow us on</p>
              <div className="drawer-social-icons">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="drawer-social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="drawer-social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441c0-.796-.645-1.441-1.441-1.441z" />
                  </svg>
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="drawer-social-link" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                  </svg>
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="drawer-social-link" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ── Mobile auth icon (far right of header bar) */}
          <div className="mobile-auth-slot">
            <AuthControl slot="mobile" />
          </div>

        </div>
      </nav>

      {/* ── Overlay: dims area outside drawer, closes on click */}
      {isMenuOpen && (
        <div
          className="navbar-overlay"
          style={{ top: `${navHeight}px` }}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
