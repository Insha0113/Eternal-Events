import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';



// Wedding section image – add weddingimage.jpg to src/assets/images and switch import if you prefer
import servicesHeroImage from "../assets/images/dance1.jpg";
import logo from "../assets/images/logo (2).png";
import weddingSectionImage from '../assets/images/weddingimage.jpg';
import baptismSectionImage from '../assets/images/baptismimage.jpg';
import bridetobeImage from '../assets/images/bridetobe.jpg';
import babyshowerImage from '../assets/images/babyshower.jpg';
import firstHolyCommunionImage from '../assets/images/firstholycommunion.jpg';
import valakappuImage from '../assets/images/momo to be.jpg';
import namingCeremonyImage from '../assets/images/namingceremony.jpg';
import madhuramveppuImage from '../assets/images/madhuramveppu.jpg';
import inaugurationsImage from '../assets/images/inaugrations.jpg';
import haldiImage from '../assets/images/Haldi Stage.jpg';
import weddingAnniversaryImage from '../assets/images/wedding anniversary.jpg';
import diwaliDecorImage from '../assets/images/diwali decor.jpg';
import onamDecorImage from '../assets/images/onamdecor.jpg';
import christmasDecorImage from '../assets/images/christmas decor.jpg';

// Add-on service images
import buffet4Image from '../assets/images/buffet4.jpg';
import host4Image from '../assets/images/host4.png';
import weddingcake2Image from '../assets/images/wedding cake2.jpg';
import photography2Image from '../assets/images/photography2.jpg';
import photoboothImage from '../assets/images/photobooth.png';
import weddingmusicbandImage from '../assets/images/weddingmusicband.jpg';
import weddingdaydanceImage from '../assets/images/weddingdaydance.jpg';

// Sub-service images: add these to public/images/ (e.g. public/images/buffet1.jpg)
const img = (name) => `${process.env.PUBLIC_URL || ''}/images/${name}`;

const WEDDING_FULL_TEXT =
  'Taking care of every detail from initial planning to the final celebration. Our team handles venue selection, theme design, décor, catering coordination, entertainment, and guest management to ensure a smooth and stress-free experience. We work closely with you to understand your vision, preferences, and budget, creating a wedding that reflects your personality and traditions. With careful planning, creative ideas, and professional execution, we transform your special day into a beautiful and unforgettable event for you and your family to cherish forever.';

const BAPTISM_FULL_TEXT =
  "Baptism is a sacred and joyful occasion that marks an important spiritual milestone in a child’s life. We plan and organize beautiful baptism ceremonies with elegant décor, seating arrangements, and thoughtful detailing that reflects the significance of the day. From church coordination to venue setup and family gathering arrangements, our team ensures everything runs smoothly and peacefully. We focus on creating a warm and welcoming atmosphere for family and guests while taking care of every small requirement so you can cherish this meaningful celebration without stress.";

const BRIDEGROOM_FULL_TEXT =
  "Celebrate the beginning of your wedding journey with a charming bride and groom-to-be event. We design stylish and meaningful setups with themed décor, lighting, and personalized elements that highlight your love story. Our services include stage arrangement, seating, entertainment coordination, and refreshment planning to ensure a joyful experience for your friends and family. With creative ideas and smooth execution, we transform this pre-wedding celebration into a memorable and picture-perfect occasion.";


const BABYSHOWER_FULL_TEXT =
  "Baby showers are special celebrations filled with love, blessings, and happiness for the parents-to-be. We organize delightful baby shower events with soft color themes, balloon décor, floral arrangements, and comfortable seating for guests. Our team manages games, stage setup, and catering coordination to make the event lively and stress-free. We focus on creating a warm and cheerful environment that captures the excitement of welcoming a new life into the family.";

const FIRSTHOLYCOMMUNION_FULL_TEXT =
  "First Holy Communion is a deeply meaningful and spiritual ceremony that deserves careful planning and respectful presentation. We provide elegant décor, seating arrangements, and coordinated event management that reflects the sacred nature of the occasion. Our team works closely with families to ensure the celebration is graceful, organized, and memorable. From church-side arrangements to reception décor and guest comfort, we handle all details with care and dedication so families can focus on the joy of the moment.";

const VALAKAPPU_FULL_TEXT =
  "Valakappu is a joyful celebration held to bless the mother-to-be and welcome the new life with love and care. We organize Valakappu functions with beautiful traditional decorations, floral setups, stage décor, and comfortable seating for guests. Our team takes care of the complete arrangement, including theme-based backdrops, lighting, and welcome décor. We ensure the event looks elegant and meaningful while keeping the atmosphere warm and happy for family and friends. With our planning and decoration services, you can relax and enjoy this special moment while we handle all the details smoothly.";

const NAMINGCEREMONY_FULL_TEXT =
  "A Naming Ceremony is a special occasion where family and friends gather to celebrate and bless the newborn. We arrange this event with gentle and cheerful decorations, creating a pleasant and peaceful atmosphere for the baby and guests. Our services include stage setup, floral décor, welcome boards, and themed backgrounds based on your preference. We focus on making the venue look bright, neat, and welcoming while keeping the ceremony comfortable and well-organized. From decoration to coordination, we take care of everything so you can enjoy this precious moment with your loved ones.";

const MADHURAMVEPPU_FULL_TEXT =
  "Madhuramveppu is a traditional ceremony that marks the baby's first taste of sweet food, symbolizing a sweet and healthy life ahead. We organize Madhuramveppu functions with soft, elegant décor and traditional touches to suit the importance of the ritual. Our team arranges stage décor, seating, lighting, and themed backgrounds that match the cultural significance of the event. We ensure the setup is simple, beautiful, and well-planned, making the function comfortable for elders and guests. With our careful arrangements, your Madhuramveppu ceremony becomes a peaceful and memorable family celebration.";

const INAUGURATIONS_FULL_TEXT =
  "Inauguration ceremonies are important events that mark new beginnings, such as opening a business, office, or institution. We provide complete decoration and event setup services for inaugurations, including stage décor, ribbon-cutting arrangements, floral designs, and welcome boards. Our team ensures the venue looks professional, neat, and attractive to create a positive first impression. We also manage seating, lighting, and basic coordination so the program runs smoothly. Whether it is a small or large event, we focus on making the inauguration simple, organized, and meaningful for both guests and organizers.";

const HALDI_FULL_TEXT =
  "Haldi is a colorful and joyful pre-wedding ceremony filled with fun, laughter, and traditions. We decorate the venue using bright flowers, themed backdrops, and cheerful color combinations that match the festive mood of the function. Our Haldi décor includes stage setup, seating arrangements, floral props, and photo areas for beautiful pictures. We make sure the space is comfortable and lively for the couple and guests to enjoy every moment. With our creative decoration and smooth arrangements, the Haldi ceremony becomes a vibrant and memorable part of your wedding celebrations.";

const DIWALIDECOR_FULL_TEXT =
  "Diwali is the festival of lights, and our Diwali decoration services bring warmth and brightness to your home or venue. We decorate using lights, flowers, traditional elements, and themed designs to create a festive and welcoming atmosphere. Our team focuses on neat and elegant arrangements that reflect the joy and spirit of the festival. From entrance décor to indoor decorations, we ensure everything looks beautiful and well-coordinated. With our Diwali décor services, you can enjoy the celebration without worrying about setup and decoration work.";

const ONAMDECOR_FULL_TEXT =
  "Onam is a vibrant festival that celebrates tradition, culture, and togetherness. We provide Onam decoration services using flowers, pookalam designs, traditional backdrops, and themed décor that highlight the beauty of the festival. Our team creates a colorful and festive environment for homes, offices, and event venues. We carefully plan each decoration to reflect the cultural essence of Onam while keeping the setup clean and elegant. With our services, your Onam celebration becomes visually attractive and joyful, creating a perfect space for family and guests to gather and celebrate.";

const CHRISTMASDECOR_FULL_TEXT =
  "Christmas is a season of joy, love, and celebration, and our Christmas décor services help create a warm and festive atmosphere. We decorate using lights, themed ornaments, floral elements, and traditional Christmas colors to bring a cheerful look to your space. Our team handles tree décor, entrance décor, and indoor arrangements with care and creativity. We ensure the decorations are balanced and beautiful without looking overcrowded. With our Christmas decoration services, your home or venue becomes a cozy and joyful place to celebrate with family, friends, and guests.";

const WEDDING_ANNIVERSARY_FULL_TEXT =
  "A wedding anniversary is a beautiful celebration of love, togetherness, and lasting memories. We organize anniversary events with elegant decorations, stage setups, and themed arrangements based on your style and preference. Our services include backdrop décor, table arrangements, lighting, and welcome setups that create a romantic and joyful atmosphere. Whether it is a small family gathering or a grand celebration, we focus on making the venue look special and meaningful. With our careful planning and decoration, your anniversary celebration becomes a memorable experience filled with happiness and warmth.";


function ReadMoreText({ text, maxLength = 180 }) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) return <p>{text}</p>;

  return (
    <p>
      {expanded ? text : text.slice(0, maxLength) + "... "}
      <span
        onClick={() => setExpanded(!expanded)}
        style={{ color: "#c89b3c", cursor: "pointer", fontWeight: "600" }}
      >
        {expanded ? " Read less" : " Read more"}
      </span>
    </p>
  );
}

const WEDDING_PREVIEW_SENTENCES = 2;

const SUB_SERVICES = [
  {
    id: 'catering',
    title: 'Catering Services (Buffet)',
    image: img('buffet1.jpg'),
    content:
      'From elegant plated dinners to lavish buffets, our catering team crafts menus that delight your guests. We offer customizable options including regional cuisines, dietary accommodations, and live counters to make your wedding feast memorable.',
  },
  {
    id: 'host',
    title: 'Wedding Host',
    image: img('host 4.png'),
    content:
      'Our professional wedding hosts keep your celebration flowing seamlessly. They coordinate with vendors, manage the timeline, announce key moments, and ensure you and your guests enjoy every second of your big day without a worry.',
  },
  {
    id: 'cake',
    title: 'Wedding Cake',
    image: img('weddingcake.png'),
    content:
      'Stunning tiered cakes designed to match your theme and taste. Choose from classic, modern, or custom designs with a variety of flavours and finishes. Our bakers create edible art that looks as good as it tastes.',
  },
  {
    id: 'photography',
    title: 'Photography',
    image: img('photography2.jpg'),
    content:
      'Capture every emotion and detail with our experienced wedding photographers. We offer pre-wedding shoots, candid coverage, traditional portraits, and album design so you can relive your special day for years to come.',
  },
  {
    id: 'photobooth',
    title: '360° Photo Booth',
    image: img('photobooth.png'),
    content:
      'Let your guests have fun with our 360-degree photo booth. Interactive, shareable moments with instant prints and digital copies—a perfect entertainment add-on that doubles as a memorable favour for everyone.',
  },
  {
    id: 'band',
    title: 'Music Band',
    image: img('band1.jpg'),
    content:
      'Live music sets the mood for your celebration. From ceremony melodies to reception dance numbers, our curated bands and artists bring energy and elegance. Choose from acoustic, fusion, or full live bands to match your style.',
  },
  {
    id: 'dance',
    title: 'Dance',
    image: img('dance4.jpg'),
    content:
      'Choreographed first dance, family performances, or a full dance floor—we help you plan and execute every step. Optional dance workshops and flash mobs are available to make your wedding entertainment unforgettable.',
  },
];

// Add‑on services carousel (images imported from assets/images/)
const ADD_ON_SERVICES = [
  {
    id: 'addon-buffet',
    title: 'Premium Buffet Setup',
    image: buffet4Image,
  },
  {
    id: 'addon-host',
    title: 'Professional Host / Emcee',
    image: host4Image,
  },
  {
    id: 'addon-cake',
    title: 'Signature Wedding Cake',
    image: weddingcake2Image,
  },
  {
    id: 'addon-photo',
    title: 'Wedding Photography',
    image: photography2Image,
  },
  {
    id: 'addon-photobooth',
    title: '360° Photo Booth',
    image: photoboothImage,
  },
  {
    id: 'addon-band',
    title: 'Live Music Band',
    image: weddingmusicbandImage,
  },
  {
    id: 'addon-dance',
    title: 'Wedding Day Dance',
    image: weddingdaydanceImage,
  },
  {
    id: 'addon-band2',
    title: 'Reception Band',
    image: weddingmusicbandImage,
  },
];


const Services = () => {
  const [readMore, setReadMore] = useState(false);
  const [showWeddingModal, setShowWeddingModal] = useState(false);
  const [weddingAnimReady, setWeddingAnimReady] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setWeddingAnimReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Re-run whenever showAllServices changes so newly rendered sections get observed
    const sections = document.querySelectorAll(".service-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [showAllServices]);

  // Mobile: add/remove 'mobile-active' on service image wraps when fully visible
  useEffect(() => {
    if (window.innerWidth > 768) return;
    const navigate = null; // we use Link inside overlay
    const imageWraps = document.querySelectorAll('.service-image-wrap');
    const mobileObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.85) {
            entry.target.classList.add('mobile-active');
          } else {
            entry.target.classList.remove('mobile-active');
          }
        });
      },
      { threshold: [0.85] }
    );
    imageWraps.forEach((wrap) => mobileObserver.observe(wrap));
    return () => mobileObserver.disconnect();
  }, [showAllServices]);


  const previewText = WEDDING_FULL_TEXT.split(/(?<=[.!?])\s+/)
    .slice(0, WEDDING_PREVIEW_SENTENCES)
    .join(' ');
  const hasMore = WEDDING_FULL_TEXT.split(/(?<=[.!?])\s+/).length > WEDDING_PREVIEW_SENTENCES;


  return (
    <div className="services-page">
      <div
        className="page-hero"
        style={{ backgroundImage: `url(${servicesHeroImage})` }}
      >
        <div className="page-hero-overlay">
          <img src={logo} alt="Logo" className="page-hero-logo" />
          <h1>Our Services</h1>
          <p>
            Comprehensive event management solutions for your special occasions.
          </p>
        </div>
      </div>
      <div className="services-content">
        <div className="container">


          {/* Wedding section: image from left, text from right, read more, clickable image */}


          {/* Wedding section: image LEFT, content RIGHT */}
          <section className="service-section from-left wedding-section" data-title="Wedding">


            <div className="service-image-wrap">

              <div className="service-image-inner">
                <img
                  src={weddingSectionImage}
                  alt="Wedding ceremony by Eternal Events"
                  className="service-image"
                />
              </div>
              <Link to="/book-event" className="service-image-hover-overlay">
                <span>Book Your Event</span>
              </Link>
            </div>


            <div className="wedding-section-content">
              <h2 className="wedding-section-title">Wedding</h2>

              {/* Desktop → full text */}
              <p className="wedding-section-text desktop-text">
                {WEDDING_FULL_TEXT}
              </p>

              {/* Mobile → Read more */}
              <div className="mobile-text wedding-section-text">
                <ReadMoreText text={WEDDING_FULL_TEXT} maxLength={180} />
              </div>
            </div>

          </section>

          {/* Baptism section: content left, image right */}
          <section className="service-section from-right baptism-section" data-title="Baptism">

            <div className="baptism-section-content">
              <h2 className="baptism-section-title">Baptism</h2>
              <p className="baptism-section-text desktop-text">
                {BAPTISM_FULL_TEXT}
              </p>

              <div className="baptism-section-text mobile-text">
                <ReadMoreText text={BAPTISM_FULL_TEXT} maxLength={180} />
              </div>


            </div>

            <div className="service-image-wrap">

              <div className="service-image-inner">
                <img
                  src={baptismSectionImage}
                  alt="Baptism ceremony"
                  className="service-image"
                />
              </div>
              <Link to="/book-event" className="service-image-hover-overlay">
                <span>Book Your Event</span>
              </Link>
            </div>

          </section>

          {/* Bride & Groom To-Be section: image left, content right */}
          <section className="service-section from-left bridetobe-section" data-title="Bride & Groom To-Be">

            <div className="service-image-wrap">

              <div className="service-image-inner">
                <img
                  src={bridetobeImage}
                  alt="Wedding ceremony by Eternal Events"
                  className="service-image"
                />
              </div>
              <Link to="/book-event" className="service-image-hover-overlay">
                <span>Book Your Event</span>
              </Link>
            </div>


            <div className="wedding-section-content">
              <h2 className="wedding-section-title">Bride & Groom To-Be</h2>
              {/* Desktop text */}
              <p className="baptism-section-text desktop-text">
                {BRIDEGROOM_FULL_TEXT}
              </p>

              <div className="baptism-section-text mobile-text">
                <ReadMoreText text={BRIDEGROOM_FULL_TEXT} maxLength={180} />
              </div>

            </div>
          </section>

          {/* Baby Shower section: content left, image right */}
          <section className="service-section from-right babyshower-section" data-title="Baby Shower">
            <div className="baptism-section-content">
              <h2 className="baptism-section-title">Baby Shower</h2>
              <p className="baptism-section-text desktop-text">
                {BABYSHOWER_FULL_TEXT}
              </p>

              <div className="baptism-section-text mobile-text">
                <ReadMoreText text={BABYSHOWER_FULL_TEXT} maxLength={180} />
              </div>

            </div>

            <div className="service-image-wrap">

              <div className="service-image-inner">
                <img
                  src={babyshowerImage}
                  alt="Baby shower ceremony"
                  className="service-image"
                />
              </div>
              <Link to="/book-event" className="service-image-hover-overlay">
                <span>Book Your Event</span>
              </Link>
            </div>
          </section>

          <section className="service-section from-left firstholycommunion-section" data-title="First Holy Communion">
            <div className="service-image-wrap">

              <div className="service-image-inner">
                <img
                  src={firstHolyCommunionImage}
                  alt="Wedding ceremony by Eternal Events"
                  className="service-image"
                />
              </div>
              <Link to="/book-event" className="service-image-hover-overlay">
                <span>Book Your Event</span>
              </Link>
            </div>


            <div className="wedding-section-content">
              <h2 className="wedding-section-title">First Holy Communion</h2>
              <p className="baptism-section-text desktop-text">
                {FIRSTHOLYCOMMUNION_FULL_TEXT}
              </p>

              <div className="baptism-section-text mobile-text">
                <ReadMoreText text={FIRSTHOLYCOMMUNION_FULL_TEXT} maxLength={180} />
              </div>

            </div>
          </section>

          {/* ── Show More / collapse boundary ── */}
          {!showAllServices && (
            <div className="services-show-more-wrap">
              <button
                className="services-show-more-btn"
                onClick={() => setShowAllServices(true)}
              >
                Show More Services
              </button>
            </div>
          )}

          {showAllServices && (
            <>

              <section className="service-section from-right valakappu-section" data-title="Valakappu">
                <div className="baptism-section-content">
                  <h2 className="baptism-section-title">Valakappu</h2>
                  <p className="baptism-section-text desktop-text">
                    {VALAKAPPU_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={VALAKAPPU_FULL_TEXT} maxLength={180} />
                  </div>

                </div>

                <div className="service-image-wrap">
                  <div className="service-image-inner">
                    <img
                      src={valakappuImage}
                      alt="Valakappu ceremony"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>
              </section>

              <section className="service-section from-left namingceremony-section" data-title="Naming Ceremony">
                <div className="service-image-wrap">
                  <div className="service-image-inner">
                    <img
                      src={namingCeremonyImage}
                      alt="Wedding ceremony by Eternal Events"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>


                <div className="wedding-section-content">
                  <h2 className="wedding-section-title">Naming Ceremony</h2>
                  <p className="baptism-section-text desktop-text">
                    {NAMINGCEREMONY_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={NAMINGCEREMONY_FULL_TEXT} maxLength={180} />
                  </div>

                </div>
              </section>

              <section className="service-section from-right madhuramveppu-section" data-title="Madhuramveppu">
                <div className="baptism-section-content">
                  <h2 className="baptism-section-title">Madhuramveppu</h2>
                  <p className="baptism-section-text desktop-text">
                    {MADHURAMVEPPU_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={MADHURAMVEPPU_FULL_TEXT} maxLength={180} />
                  </div>

                </div>

                <div className="service-image-wrap">

                  <div className="service-image-inner">
                    <img
                      src={madhuramveppuImage}
                      alt="Madhuramveppu ceremony"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>
              </section>

              <section className="service-section from-left inaugurations-section" data-title="Inaugurations">
                <div className="service-image-wrap">

                  <div className="service-image-inner">
                    <img
                      src={inaugurationsImage}
                      alt="Wedding ceremony by Eternal Events"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>


                <div className="wedding-section-content">
                  <h2 className="wedding-section-title">Inaugurations</h2>
                  <p className="baptism-section-text desktop-text">
                    {INAUGURATIONS_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={INAUGURATIONS_FULL_TEXT} maxLength={180} />
                  </div>

                </div>
              </section>

              <section className="service-section from-right haldi-section" data-title="Haldi">
                <div className="baptism-section-content">
                  <h2 className="baptism-section-title">Haldi</h2>
                  <p className="baptism-section-text desktop-text">
                    {HALDI_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={HALDI_FULL_TEXT} maxLength={180} />
                  </div>

                </div>

                <div className="service-image-wrap">

                  <div className="service-image-inner">
                    <img
                      src={haldiImage}
                      alt="Haldi ceremony"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>
              </section>

              <section className="service-section from-left diwalidecor-section" data-title="Diwali Decor">
                <div className="service-image-wrap">

                  <div className="service-image-inner">
                    <img
                      src={diwaliDecorImage}
                      alt="Wedding ceremony by Eternal Events"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>


                <div className="wedding-section-content">
                  <h2 className="wedding-section-title">Diwali Decor</h2>
                  <p className="baptism-section-text desktop-text">
                    {DIWALIDECOR_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={DIWALIDECOR_FULL_TEXT} maxLength={180} />
                  </div>

                </div>
              </section>


              {/* Onam Decor → content LEFT, image RIGHT */}
              <section className="service-section from-right onamdecor-section" data-title="Onam Decor">
                <div className="baptism-section-content">
                  <h2 className="baptism-section-title">Onam Decor</h2>
                  <p className="baptism-section-text desktop-text">
                    {ONAMDECOR_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={ONAMDECOR_FULL_TEXT} maxLength={180} />
                  </div>

                </div>

                <div className="service-image-wrap">
                  <div className="service-image-inner">
                    <img
                      src={onamDecorImage}
                      alt="Onam decor"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>
              </section>

              {/* Christmas Decor → image LEFT, content RIGHT */}
              <section className="service-section from-left christmasdecor-section" data-title="Christmas Decor">
                <div className="service-image-wrap">
                  <div className="service-image-inner">
                    <img
                      src={christmasDecorImage}
                      alt="Wedding ceremony by Eternal Events"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>

                <div className="wedding-section-content">
                  <h2 className="wedding-section-title">Christmas Decor</h2>
                  <p className="baptism-section-text desktop-text">
                    {CHRISTMASDECOR_FULL_TEXT}
                  </p>

                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={CHRISTMASDECOR_FULL_TEXT} maxLength={180} />
                  </div>

                </div>
              </section>

              {/* Wedding Anniversary section: content left, image right */}
              <section className="service-section from-right wedding_anniversary-section" data-title="Wedding Anniversary">
                <div className="baptism-section-content">
                  <h2 className="baptism-section-title">Wedding Anniversary</h2>

                  {/* Desktop */}
                  <p className="baptism-section-text desktop-text">
                    {WEDDING_ANNIVERSARY_FULL_TEXT}
                  </p>

                  {/* Mobile with Read More */}
                  <div className="baptism-section-text mobile-text">
                    <ReadMoreText text={WEDDING_ANNIVERSARY_FULL_TEXT} maxLength={180} />
                  </div>
                </div>

                <div className="service-image-wrap">

                  <div className="service-image-inner">
                    <img
                      src={weddingAnniversaryImage}
                      alt="Wedding anniversary celebration decor"
                      className="service-image"
                    />
                  </div>
                  <Link to="/book-event" className="service-image-hover-overlay">
                    <span>Book Your Event</span>
                  </Link>
                </div>
              </section>

              {/* Show Less Services button — appears after last service, before Add On section */}
              <div className="services-show-more-wrap">
                <button
                  className="services-show-more-btn"
                  onClick={() => setShowAllServices(false)}
                >
                  Show Less Services
                </button>
              </div>
            </>
          )}

          {/* Add‑on Services – marquee horizontal scroll, subtitle & button below images */}
          <section className="service-section add-on-section" data-title="Add On Services">
            <h2 className="add-on-title">Add On Services</h2>

            {/* Marquee strip — seamless CSS infinite horizontal scroll */}
            <div className="addon-marquee-viewport">
              <div className="addon-marquee-track">
                {/* First set */}
                {ADD_ON_SERVICES.map((item, i) => (
                  <div key={`a-${i}`} className="addon-marquee-card">
                    <div className="addon-marquee-image-wrap">
                      <img src={item.image} alt={item.title} className="addon-marquee-image" />
                      <div className="add-on-label"><span>{item.title}</span></div>
                      <Link to="/book-event" className="addon-marquee-book-overlay">
                        <span>Book Your Event</span>
                      </Link>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {ADD_ON_SERVICES.map((item, i) => (
                  <div key={`b-${i}`} className="addon-marquee-card" aria-hidden="true">
                    <div className="addon-marquee-image-wrap">
                      <img src={item.image} alt={item.title} className="addon-marquee-image" />
                      <div className="add-on-label"><span>{item.title}</span></div>
                      <Link to="/book-event" className="addon-marquee-book-overlay">
                        <span>Book Your Event</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtitle text below images */}
            <p className="add-on-subtitle">
              Complete your celebration with premium extras like buffet setups, live music, photo booths, and more.
            </p>

            {/* Centered CTA button — after subtitle, before footer */}
            <div className="add-on-cta-wrap">
              <Link to="/addon-services" className="services-show-more-btn add-on-services-btn">
                Add on Services
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* Modal: Wedding sub-services */}
      {
        showWeddingModal && (
          <div
            className="wedding-modal-overlay"
            onClick={() => setShowWeddingModal(false)}
            aria-hidden="true"
          >
            <div
              className="wedding-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="wedding-modal-title"
            >
              <div className="wedding-modal-header">
                <h2 id="wedding-modal-title">Wedding Services</h2>
                <button
                  type="button"
                  className="wedding-modal-close"
                  onClick={() => setShowWeddingModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="wedding-modal-body">
                <div className="wedding-sub-services">
                  {SUB_SERVICES.map((item) => (
                    <div key={item.id} className="wedding-sub-service">
                      <div className="wedding-sub-service-image-wrap">
                        <img src={item.image} alt={item.title} className="wedding-sub-service-image" />
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Services;
