import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo (2).png';
import './Footer.css';

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=919539118207&text&type=phone_number&app_absent=0';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Our Services' },
  { to: '/addon-services', label: 'Add on Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/book-event', label: 'Book Event' },
];

const Footer = () => {
  const { pathname } = useLocation();

  const handleNavClick = (to) => {
    // If clicking the link for the current page, scroll to top immediately
    if (pathname === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* ── Column 1: Brand ─────────────────────────────────────────── */}
        <div className="footer-col footer-col-brand">
          <Link to="/" className="footer-logo-link" aria-label="Eternal Vows Events Home" onClick={() => handleNavClick('/')}>
            <img src={logo} alt="Eternal Vows Events Logo" className="footer-logo" />
          </Link>
          <p className="footer-tagline">
            Making every celebration unforgettable — one event at a time.
          </p>
          {/* Social icons */}
          <div className="footer-social">
            <button className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441c0-.796-.645-1.441-1.441-1.441z" />
              </svg>
            </button>
            <a href={WHATSAPP_URL} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Column 2: Navigation ─────────────────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-heading">Quick Links</h4>
          <ul className="footer-nav-list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer-nav-link" onClick={() => handleNavClick(to)}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>


        {/* ── Column 3: Contact / Address ──────────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-heading">Find Us</h4>
          <p className="footer-address">
            Eternal Vows Events,<br />
            near Kadavanthara Sub Post Office,<br />
            Giri Nagar, Kadavanthra,<br />
            Kochi, Kerala — 682036.
          </p>
          <div className="footer-contacts">
            <a href="tel:+918921850714" className="footer-contact-link">📞 +91 8921850714</a>
            <a href="tel:+919539118207" className="footer-contact-link">📞 +91 9539118207</a>
            <a href="tel:+918921595145" className="footer-contact-link">📞 +91 8921595145</a>
            {/* <a href="mailto:antony@eternalvowsevent.com" className="footer-contact-link">✉️ antony@eternalvowsevent.com</a> */}
            <a href="mailto:antonyjohneternalevents@gmail.com" className="footer-contact-link">✉️ antonyjohneternalevents@gmail.com</a>
          </div>
        </div>

        {/* ── Column 4: Map ────────────────────────────────────────────── */}
        <div className="footer-col footer-col-map">
          <h4 className="footer-col-heading">Visit Us</h4>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.5!2d76.303!3d9.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU4JzQ4LjIiTiA3NsaM1MnM1LjIiRQ!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
              title="Eternal Vows Events Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>{/* /footer-inner */}

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="footer-bottom">
        <p className="footer-copy">© 2026 Eternal Vows Events. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/terms-and-conditions" className="footer-legal-link">Terms &amp; Conditions</Link>
          <span className="footer-legal-dot">·</span>
          <Link to="/privacy-policy" className="footer-legal-link">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
