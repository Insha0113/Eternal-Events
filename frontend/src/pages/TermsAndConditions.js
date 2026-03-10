import React from 'react';
import { Link } from 'react-router-dom';
import './PolicyPage.css';

const TermsAndConditions = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <h1>Terms & Conditions</h1>
        <p className="policy-effective">Effective Date: 2026</p>
      </div>
      <div className="policy-content">
        <div className="policy-body">
          <p className="policy-intro">
            Welcome to Eternal Vows Events ("we," "our," or "us"). These Terms & Conditions govern your use of our website and our event management services (collectively, the "Service"). By accessing our website or booking our services, you agree to be bound by these Terms.
          </p>
          <p className="policy-intro">
            If you do not agree with these Terms, please do not use our Service.
          </p>

          <h2>1. Services</h2>
          <p>Eternal Vows Events provides event planning and management services including, but not limited to, weddings, corporate events, parties, and special occasions. All services are subject to availability and confirmation.</p>
          <p>We reserve the right to modify or discontinue any service without prior notice.</p>

          <h2>2. Bookings & Payments</h2>
          <ul>
            <li>All bookings are subject to confirmation and availability.</li>
            <li>A booking is considered confirmed only after receipt of the required advance payment.</li>
            <li>Final payment must be completed as per the agreed schedule before the event date.</li>
          </ul>
          <p>Payments are processed through secure third-party payment providers. We are not responsible for errors or delays caused by these providers.</p>

          <h2>3. Cancellations & Refunds</h2>
          <ul>
            <li>Cancellation policies will be communicated at the time of booking.</li>
            <li>Any advance paid may be non-refundable unless stated otherwise in writing.</li>
            <li>Refunds, if applicable, will be processed according to the agreed cancellation policy.</li>
          </ul>
          <p>Eternal Vows Events reserves the right to cancel or reschedule services due to unforeseen circumstances, including but not limited to natural disasters, government restrictions, or vendor unavailability.</p>

          <h2>4. Client Responsibilities</h2>
          <ul>
            <li>Clients agree to provide accurate and complete information regarding event requirements.</li>
            <li>Clients are responsible for obtaining necessary permissions, permits, and approvals for venues or events.</li>
            <li>Any damage caused by guests or attendees during the event will be the responsibility of the client.</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and designs, is the property of Eternal Vows Events unless otherwise stated. You may not copy, reproduce, or distribute any content without our written permission.</p>

          <h2>6. Limitation of Liability</h2>
          <p>While we strive to deliver the best possible service, Eternal Vows Events shall not be held liable for:</p>
          <ul>
            <li>Delays or failures caused by third-party vendors</li>
            <li>Weather conditions or unforeseen circumstances</li>
            <li>Loss or damage to personal belongings during the event</li>
          </ul>
          <p>Our liability, if any, shall be limited to the amount paid for our services.</p>

          <h2>7. Privacy</h2>
          <p>Your use of our Service is also governed by our Privacy Policy. By using our website or services, you consent to the collection and use of your information as described in our Privacy Policy.</p>

          <h2>8. Third-Party Services</h2>
          <p>Our services may involve third-party vendors such as caterers, decorators, photographers, or venues. Eternal Vows Events is not responsible for the independent actions, performance, or policies of these third parties.</p>

          <h2>9. Changes to These Terms</h2>
          <p>We may update these Terms & Conditions from time to time. Any changes will be effective immediately upon posting on our website with an updated "Effective Date."</p>
          <p>Continued use of our Service after such changes constitutes your acceptance of the revised Terms.</p>

          <h2>10. Governing Law</h2>
          <p>These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India, without regard to conflict of law principles.</p>

          <h2>11. Contact Us</h2>
          <p>If you have any questions about these Terms & Conditions, please contact us at:</p>
          <p>
            Eternal Vows Events<br />
            Address: [Your office address]<br />
            Email: [your business email]<br />
            Phone: [your contact number]
          </p>
        </div>
      </div>
      <div className="policy-footer-links">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <span className="policy-sep">|</span>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
