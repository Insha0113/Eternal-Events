import React, { useState, useEffect, useRef, Suspense } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import { Bounds } from "@react-three/drei";



import weddingImage from "../assets/images/wedding.jpg";
import weddingStageImage from "../assets/images/wedding stage.jpg";
import baptismImage from "../assets/images/baptism.jpg";
import brideToBeImage from "../assets/images/bride to be.jpg";
import birthdayImage from "../assets/images/birthday.jpg";
import logo from "../assets/images/logo (2).png";
import logoGLB from "../assets/video/logo.glb";
import weddingWebsiteImage from "../assets/images/webiste2.jpg";
import ReviewsSection from "../components/ReviewsSection";

// Celebrations images
import baptismSectionImage from '../assets/images/baptismimage.jpg';
import babyshowerImage from '../assets/images/babyshower.jpg';
import haldiImage from '../assets/images/haldi.jpg';
import weddingCakeImage from '../assets/images/wedding cake2.jpg';
import weddingSectionImage from '../assets/images/weddingimage.jpg';
import weddingAnniversaryImage from '../assets/images/wedding anniversary.jpg';

import "./Home.css";
import "./About.css";

// ReadMoreText component (mobile only)
const ReadMoreText = ({ text, maxLength = 180 }) => {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) return <p>{text}</p>;

  return (
    <p>
      {expanded ? text : text.slice(0, maxLength) + "... "}
      <span
        onClick={() => setExpanded(!expanded)}
        style={{
          color: "#c99a7a",
          cursor: "pointer",
          fontWeight: "600",
          textDecoration: "underline"
        }}
      >
        {expanded ? " Read less" : " Read more"}
      </span>
    </p>
  );
};


const Logo3DInner = React.forwardRef(({ shadowRef }, ref) => {
  const groupRef = useRef();
  const { scene } = useGLTF(logoGLB);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    console.log('Model maxDim after centering:', maxDim);

    const desiredSize = 1.0;
    scene.scale.multiplyScalar(desiredSize / maxDim * 500); // MAXIMUM size

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshStandardMaterial({
          // Rose-gold / warm copper — matches reference image color
          color: new THREE.Color("#b5673a"),       // warm rosy-copper base
          metalness: 0.97,                          // near-perfect metallic
          roughness: 0.08,                          // very smooth = brilliant shine
          emissive: new THREE.Color("#6b2a10"),    // deep copper-red shadow depth
          emissiveIntensity: 0.14,                  // subtle richness in shadows
          envMapIntensity: 1.5,                     // strong env reflection
        });
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.8;

    // ── Sync shadow width/opacity directly with rotation ──
    if (shadowRef && shadowRef.current) {
      const cosY = Math.abs(Math.cos(groupRef.current.rotation.y));
      const minW = 70, maxW = 240;
      const w = minW + (maxW - minW) * cosY;
      const minOp = 0.28, maxOp = 0.88;
      const op = minOp + (maxOp - minOp) * cosY;
      shadowRef.current.style.width = `${w}px`;
      shadowRef.current.style.opacity = op;
    }
  });

  React.useImperativeHandle(ref, () => groupRef.current);

  return (
    <Bounds fit={false} clip={false} observe={false} margin={1.0}> {/* DISABLE auto-fit! */}
      <primitive ref={groupRef} object={scene} position={[0, 0, 0]} />
    </Bounds>
  );
});



useGLTF.preload(logoGLB);

// Marquee images — duplicated for seamless CSS infinite scroll
const MOMENTS_IMAGES = [
  { src: haldiImage, alt: 'Haldi ceremony', label: 'Haldi' },
  { src: baptismSectionImage, alt: 'Baptism celebration', label: 'Baptism' },
  { src: brideToBeImage, alt: 'Bride to be', label: 'Bride to Be' },
  { src: babyshowerImage, alt: 'Baby shower', label: 'Baby Shower' },
  { src: weddingCakeImage, alt: 'Cake celebration', label: 'Cake & Celebrations' },
  { src: weddingStageImage, alt: 'Night lighting', label: 'Stage & Lighting' },
  { src: weddingAnniversaryImage, alt: 'Anniversary', label: 'Anniversaries' },
  { src: weddingSectionImage, alt: 'Wedding event', label: 'Weddings' },
];

/* ---------------- SCENE ---------------- */
const Scene3D = React.forwardRef(({ shadowRef }, ref) => {
  return (
    <>
      {/* Warm ambient – rose-gold base warmth */}
      <ambientLight intensity={1.6} color="#ffe0d0" />
      {/* Primary key light – warm copper from top-front-right */}
      <directionalLight position={[4, 6, 4]} intensity={5.5} color="#ffb89a" />
      {/* Cool fill from left – metallic light/shadow contrast */}
      <directionalLight position={[-5, 2, 2]} intensity={1.5} color="#ffd0c0" />
      {/* Bottom rim – dark shadow for depth */}
      <pointLight position={[0, -6, 2]} intensity={0.3} color="#1a0800" />
      {/* Specular hot-spot – creates the copper glint */}
      <spotLight position={[1, 10, 5]} intensity={9.0} color="#ff9060" angle={0.35} penumbra={0.5} />

      <Suspense fallback={null}>
        <Logo3DInner ref={ref} shadowRef={shadowRef} />
      </Suspense>
    </>
  );
});



/* ---------------- HOME ---------------- */
const Home = () => {
  const sceneRef = useRef();
  const shadowRef = useRef(null);
  // currentImageIndex is always 0 (carousel auto-advance removed; value never changed)
  const currentImageIndex = 0;

  // Section fade-in
  const momentsRef = useRef(null);
  const [momentsVisible, setMomentsVisible] = useState(false);
  const [marqueeHovered, setMarqueeHovered] = useState(false);

  const images = [
    { src: weddingImage, alt: "Wedding Celebration" },
    { src: weddingStageImage, alt: "Wedding Stage" },
    { src: baptismImage, alt: "Baptism Ceremony" },
    { src: brideToBeImage, alt: "Bride to Be" },
    { src: birthdayImage, alt: "Birthday Celebration" },
  ];

  useEffect(() => {
    const observers = [];
    const observe = (ref, setVisible) => {
      if (!ref.current) return;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            ob.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      ob.observe(ref.current);
      observers.push(() => ob.disconnect());
    };
    observe(momentsRef, setMomentsVisible);
    return () => observers.forEach((fn) => fn());
  }, []);



  return (
    <div className="home">
      <div className="page-hero">
        <div className="image-carousel">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentImageIndex ? "active" : ""
                }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="carousel-image"
              />
            </div>
          ))}
        </div>

        <div className="page-hero-overlay">
          <img src={logo} alt="Logo" className="page-hero-logo" />
          <h1>Welcome to Eternal Events</h1>
          <p>Creating Unforgettable Moments, One Event at a Time</p>
          <div className="hero-buttons">
            <Link to="/book-event" className="btn btn-primary">
              Book Your Event
            </Link>
          </div>
        </div>
      </div>

      {/* 3D LOGO SECTION */}
      {/* WHY CHOOSE US - 3D LOGO SECTION */}
      <section className="logo-showcase-section">
        <div className="logo-showcase-container">
          <h2 className="logo-section-title">Why Choose Eternal Vows Events?</h2>

          <div className="logo-showcase-wrapper">
            {/* Left column: 3D logo + About Us button */}
            <div className="logo-left-col">
              <div className="logo-canvas-wrapper">
                <Canvas
                  className="logo-canvas"
                  gl={{ alpha: true }}
                  camera={{
                    position: [0, 0, 800],
                    fov: 45,
                    near: 0.1,
                    far: 10500
                  }}
                >
                  <Scene3D ref={sceneRef} shadowRef={shadowRef} />
                </Canvas>
                {/* Dynamic shadow that moves as the logo rotates */}
                <div ref={shadowRef} className="logo-3d-shadow" aria-hidden="true" />
              </div>

              {/* About Us button directly under the 3D logo */}
              <div className="about-us-btn-wrap">
                <Link to="/about" className="about-explore-services-btn">About Us</Link>
              </div>
            </div>

            {/* Vertical separator line — desktop only */}
            <div className="logo-section-separator" aria-hidden="true" />

            <div className="logo-showcase-content">
              {/* DESKTOP: Full text */}
              <div className="desktop-text" style={{ textAlign: 'right' }}>
                <p>
                  Because every vow, every memory, and every moment deserves to be eternal. Founded in 2023 by three visionary friends, Eternal Vows Events is dedicated to transforming your most cherished occasions into unforgettable experiences. Our team believes that every celebration—whether a wedding, baptism, anniversary, or milestone event—deserves to reflect the unique story, style, and personality of the people it honors.
                </p>
                <p>
                  At Eternal Vows Events, we blend modern sophistication with timeless elegance, carefully curating every detail from décor and lighting to music and photography, ensuring each event resonates with beauty and meaning. We understand that planning an event can be overwhelming, which is why we take pride in offering personalized guidance, creative solutions, and seamless execution.
                </p>
                <p>
                  By combining innovation, meticulous planning, and a passion for celebrating life's precious milestones, Eternal Vows Events turns dreams into reality, making every celebration truly eternal. Let us take your vision and craft an experience that you, your family, and your guests will remember for a lifetime.
                </p>
              </div>

              {/* MOBILE: Read More */}
              <div className="mobile-text">
                <ReadMoreText
                  text="Because every vow, every memory, and every moment deserves to be eternal. Founded in 2023 by three visionary friends, Eternal Vows Events is dedicated to transforming your most cherished occasions into unforgettable experiences with personalized guidance, creative solutions, and seamless execution that blends modern sophistication with timeless elegance."
                  maxLength={120}
                />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* PERSONALIZED EVENT WEBSITE SECTION */}
      <section className="event-website-section">
        <div className="event-website-container">
          <h2 className="event-website-title">Personalized Event Website</h2>
          <div className="event-website-wrapper">
            <div className="event-website-image-wrap">
              <img
                src={weddingWebsiteImage}
                alt="Personalized Event Website"
                className="event-website-image"
              />
            </div>

            {/* Vertical separator line — desktop only */}
            <div className="event-website-separator" aria-hidden="true" />

            <div className="event-website-content">
              {/* DESKTOP: Full text */}
              <div className="desktop-text" style={{ textAlign: 'justify' }}>
                <p>
                  We create a beautifully designed and fully personalized website for your wedding or baptism, crafted to preserve and celebrate the memories of your most meaningful day in a timeless digital form. This custom website becomes more than just a page on the internet — it becomes a living memory of your special occasion, where emotions, stories, and moments are captured and presented with elegance and care.
                </p>
                <p>
                  Your personalized website includes all essential event details such as the date, venue, schedule of ceremonies, and important announcements, ensuring your guests have everything they need in one convenient place. It also features dedicated photo galleries to showcase your favorite moments, from candid smiles to cherished family memories.
                </p>
                <p>
                  Designed for both beauty and accessibility, the website works seamlessly across mobile phones, tablets, and desktop computers, allowing your family and friends to view it anytime and from anywhere in the world.
                </p>
              </div>

              {/* MOBILE: Read More */}
              <div className="mobile-text">
                <ReadMoreText
                  text="We create a beautifully designed and fully personalized website for your wedding or baptism, crafted to preserve and celebrate the memories of your most meaningful day. Your custom website includes essential event details, photo galleries, and works perfectly on mobile, tablet, and desktop devices for sharing with family worldwide."
                  maxLength={120}
                />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Celebrations We Create Section — CSS Marquee */}
      <section ref={momentsRef} className={`about-section about-moments${momentsVisible ? ' visible' : ''}`}>
        <div className="about-moments-inner">
          <h2 className="about-moments-title">Celebrations We Create</h2>
          <p className="about-moments-subtitle">From intimate gatherings to grand occasions—every moment crafted with care.</p>

          {/* Marquee strip — no arrows, pure CSS animation */}
          <div
            className="marquee-viewport"
            onMouseEnter={() => setMarqueeHovered(true)}
            onMouseLeave={() => setMarqueeHovered(false)}
          >
            <div
              className="marquee-track"
              style={{ animationPlayState: marqueeHovered ? 'paused' : 'running' }}
            >
              {/* First set */}
              {MOMENTS_IMAGES.map((item, i) => (
                <div key={`a-${i}`} className="marquee-card">
                  <div className="about-moment-image-wrap">
                    <img src={item.src} alt={item.alt} />
                    <div className="about-moment-overlay"><span>{item.label}</span></div>
                  </div>
                </div>
              ))}
              {/* Duplicate set — makes seamless loop */}
              {MOMENTS_IMAGES.map((item, i) => (
                <div key={`b-${i}`} className="marquee-card" aria-hidden="true">
                  <div className="about-moment-image-wrap">
                    <img src={item.src} alt={item.alt} />
                    <div className="about-moment-overlay"><span>{item.label}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-moments-cta">
            <Link to="/services" className="about-explore-services-btn">Explore our services</Link>
          </div>
        </div>
      </section>

      <section className="client-reviews-section">
        <ReviewsSection />
      </section>
    </div>

  );
};

export default Home;

