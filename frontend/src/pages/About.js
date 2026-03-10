import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

// Hero & founders
import aboutHeroImage from "../assets/images/stage4.jpeg"; // <-- put the correct path here
import logo from "../assets/images/logo (2).png";
import stage4Image from '../assets/images/stage4.jpeg';
import friendsImage from '../assets/images/Friends.png';

const MILESTONES = [
  {
    year: '2020',
    title: 'Eternal Vows Events started',
    description: 'We began with birthday parties, small baptism events, and intimate family celebrations. Three friends turned a shared passion into a promise to make every occasion special.',
  },
  {
    year: '2021',
    title: 'First 50 successful events',
    description: 'Word of mouth grew as we delivered one memorable event after another. From baby showers to naming ceremonies, we became the go-to choice for families who wanted warmth and attention to detail.',
  },
  {
    year: '2023',
    title: 'Expanded into corporate events',
    description: 'We brought the same care and creativity to inaugurations, conferences, and corporate gatherings. Our team grew, and so did our ability to scale from cozy celebrations to larger, professional events.',
  },
  {
    year: '2026',
    title: 'Trusted brand for weddings & celebrations',
    description: 'Today we are a trusted name across weddings, receptions, anniversaries, and every milestone in between. We continue to evolve while keeping the same friendship and commitment at the heart of every event.',
  },
];

const About = () => {
  const foundersRef = useRef(null);
  const missionRef = useRef(null);
  const milestonesRef = useRef(null);
  const [foundersVisible, setFoundersVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [milestonesVisible, setMilestonesVisible] = useState(false);

  useEffect(() => {
    const observers = [];
    const observe = (ref, setter) => {
      if (!ref?.current) return;
      const ob = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setter(true); },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
      );
      ob.observe(ref.current);
      observers.push(() => ob.disconnect());
    };
    observe(foundersRef, setFoundersVisible);
    observe(missionRef, setMissionVisible);
    observe(milestonesRef, setMilestonesVisible);
    return () => observers.forEach((fn) => fn());
  }, []);

  return (
    <div className="about-page">
      {/* Hero */}
      {/* Hero */}
      <div
        className="page-hero"
        style={{ backgroundImage: `url(${aboutHeroImage})` }}
      >
        <div className="page-hero-overlay">
          <img src={logo} alt="Logo" className="page-hero-logo" />
          <h1>About Us</h1>
          <p>
            Discover who we are and how we turn your dreams into unforgettable events.
          </p>
        </div>
      </div>

      <div className="about-content">
        {/* How It All Began */}
        <section ref={foundersRef} className={`about-section about-founders${foundersVisible ? ' visible' : ''}`}>
          <div className="about-founders-container">
            <div className="about-founders-image-wrap">
              <img src={friendsImage} alt="Aashiq, Antony and Ashkar - founders of Eternal Vows Events" className="about-founders-image" />
            </div>
            <div className="about-founders-text">
              <h2>How It All Began</h2>
              <p>
                Eternal Vows Events started in 2020 when three friends—<strong>Arun</strong>, <strong>Akhil</strong>, and <strong>Antony</strong>—decided to turn their shared passion for celebrations into something lasting. What began as a small venture with a handful of events soon grew into a trusted name across weddings, corporate events, and special occasions.
              </p>
              <p>
                Through dedication, creativity, and an unwavering focus on quality, the team has built lasting relationships with clients and vendors alike. From 2020 to 2026, Eternal Vows Events has created countless memorable experiences, earning a reputation for elegance, reliability, and attention to detail. Today we continue to evolve, bringing the same friendship and commitment to every event we plan.
              </p>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section ref={missionRef} className={`about-section about-mission-vision${missionVisible ? ' visible' : ''}`}>
          <div className="about-mv-container">
            <div className="about-mv-card about-mission">
              <div className="about-mv-accent" />
              <h2>Our Mission</h2>
              <p>
                Our mission is to design and deliver meaningful celebrations that reflect each client’s story and vision. We focus on thoughtful planning, artistic presentation, and flawless execution so every event feels personal and unforgettable.
              </p>
            </div>
            <div className="about-mv-card about-vision">
              <div className="about-mv-accent" />
              <h2>Our Vision</h2>
              <p>
                Our vision is to become a trusted name in the event industry by continuously redefining elegance and innovation—blending modern ideas with timeless traditions and inspiring unforgettable moments across generations.
              </p>
            </div>
          </div>
          <div className="about-values-wrap">
            <h2 className="about-values-heading">Our Values</h2>
            <div className="about-values-grid">
              {['Excellence', 'Integrity', 'Creativity', 'Dedication'].map((value, i) => (
                <div key={value} className="about-value-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <span className="about-value-dot" />
                  <h3>{value}</h3>
                  <p>
                    {value === 'Excellence' && 'We pursue perfection in every detail.'}
                    {value === 'Integrity' && 'Honest and transparent in all relationships.'}
                    {value === 'Creativity' && 'Unique ideas for unique celebrations.'}
                    {value === 'Dedication' && "Fully committed to your event's success."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey / Milestones */}
        <section ref={milestonesRef} className={`about-section about-milestones${milestonesVisible ? ' visible' : ''}`}>
          <div className="about-milestones-inner">
            <h2 className="about-milestones-title">Our Journey</h2>
            <p className="about-milestones-subtitle">Growth, trust, and countless celebrations—our story in milestones.</p>
            <div className="about-milestones-timeline">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="about-milestone-item" style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="about-milestone-marker">
                    <span className="about-milestone-year">{m.year}</span>
                  </div>
                  <div className="about-milestone-content">
                    <h3 className="about-milestone-title">{m.title}</h3>
                    <p className="about-milestone-desc">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

