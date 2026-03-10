import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ZapierChatbot from './components/ZapierChatbot';
import BackgroundMusic from './components/BackgroundMusic';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import AddOnServices from './pages/AddOnServices';
import Gallery from './pages/Gallery';
import BookEvent from './pages/BookEvent';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import './App.css';
import './styles/Hero.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <LoadingScreen />
          <div className="App">
            <Routes>
              {/* Admin routes: separate page, no public Navbar/Footer */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Public routes: show Navbar and Footer */}
              <Route path="/*" element={
                <>
                  <BackgroundMusic />
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/addon-services" element={<AddOnServices />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/book-event" element={<BookEvent />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                  <Footer />
                  <ZapierChatbot />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
