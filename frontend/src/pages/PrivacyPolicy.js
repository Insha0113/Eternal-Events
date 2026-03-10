import React from 'react';
import { Link } from 'react-router-dom';
import './PolicyPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <h1>Privacy Policy</h1>
        <p className="policy-effective">Effective Date: 2026</p>
      </div>
      <div className="policy-content">
        <div className="policy-body">
          <p className="policy-intro">
            Eternal Vows Events ("we," "our," or "us") respects your privacy and is committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or use our website, book our services, or otherwise engage with our offerings (collectively, the "Service").
          </p>
          <p className="policy-intro">
            We comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). By using our Service, you agree to the practices described in this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li><strong>Contact Information:</strong> Name, email address, phone number, postal address.</li>
            <li><strong>Booking & Event Details:</strong> Event date, venue, type of event, special requests, and preferences.</li>
            <li><strong>Transaction Information:</strong> Invoices, payment details (processed securely via third-party providers), and service history.</li>
            <li><strong>Technical Information:</strong> IP address, browser type, device identifiers, operating system, and usage data.</li>
            <li><strong>Communications:</strong> Emails, messages, feedback, reviews, or customer support inquiries.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and manage our event planning and coordination services</li>
            <li>Communicate with you about bookings, updates, offers, and support</li>
            <li>Personalize your experience and tailor our services to your needs</li>
            <li>Improve our website, services, and marketing efforts</li>
            <li>Comply with legal obligations and prevent fraud or misuse</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal data. We may share your information with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Vendors, decorators, photographers, caterers, payment processors, and marketing platforms involved in delivering our services.</li>
            <li><strong>Legal Requirements:</strong> When required to comply with law or protect our rights and safety.</li>
            <li><strong>Business Transfers:</strong> In the event of a sale, merger, or reorganization of our business.</li>
          </ul>

          <h2>4. Cookies & Tracking Technologies</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Understand how our website is used</li>
            <li>Enhance user experience</li>
            <li>Provide personalized content and promotions</li>
          </ul>
          <p>You can control or disable cookies through your browser settings.</p>

          <h2>5. Your Rights & Choices</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access, correct, or delete your personal information</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Request a copy of your data or restrict its processing</li>
            <li>File a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise these rights, contact us at: [insert your business email here]</p>

          <h2>6. Data Security</h2>
          <p>We use appropriate technical and organizational measures to protect your personal data against loss, theft, and unauthorized access. While we strive to safeguard your information, no system is 100% secure.</p>

          <h2>7. Data Retention</h2>
          <p>We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>

          <h2>8. Children's Privacy</h2>
          <p>Our services are not intended for individuals under the age of 16. We do not knowingly collect personal data from children.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website with an updated "Effective Date."</p>
        </div>
      </div>
      <div className="policy-footer-links">
        <Link to="/terms-and-conditions">Terms & Conditions</Link>
        <span className="policy-sep">|</span>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
