import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AddOnServices.css';
import logo from '../assets/images/logo (2).png';
import heroImage from '../assets/images/collage.png';
import buffet4Image from '../assets/images/buffet4.jpg';
import host4Image from '../assets/images/host4.png';
import musicbandImage from '../assets/images/musicband.jpg';
import weddingdaydanceImage from '../assets/images/weddingdaydance.jpg';
import baptismcakeImage from '../assets/images/baptism cake.jpg';
import makeupImage from '../assets/images/makeup.jpg';
import ornamentsImage from '../assets/images/ornaments.jpg';
import groomingImage from '../assets/images/grooming.jpg';
import boquetImage from '../assets/images/boquet.jpg';
import sareeDrapingImage from '../assets/images/saree_draping.jpg';
import houseDecorImage from '../assets/images/house decor.jpg';
import website2Image from '../assets/images/weddingwebsite.jpg';
import photobooth2Image from '../assets/images/photobooth2.png';
import photography2Image from '../assets/images/photography2.jpg';

function ReadMoreText({ text, maxLength = 180 }) {
    const [expanded, setExpanded] = useState(false);
    if (text.length <= maxLength) return <p>{text}</p>;
    return (
        <p>
            {expanded ? text : text.slice(0, maxLength) + '... '}
            <span
                onClick={() => setExpanded(!expanded)}
                style={{ color: '#c89b3c', cursor: 'pointer', fontWeight: '600' }}
            >
                {expanded ? ' Read less' : ' Read more'}
            </span>
        </p>
    );
}

const SECTIONS = [
    {
        id: 'catering',
        title: 'Catering',
        image: buffet4Image,
        alt: 'Catering buffet setup',
        text: 'Delight your guests with delicious meals through our professional catering services, offering buffet and customized menu options prepared with quality ingredients and elegant presentation.',
        direction: 'left',
    },
    {
        id: 'hosting',
        title: 'Professional Hosting',
        image: host4Image,
        alt: 'Professional host at event',
        text: 'Ensure smooth flow and engaging interaction throughout your event with our professional hosts. From welcoming guests to coordinating activities, our hosts keep the celebration organized, entertaining, and stress-free.',
        direction: 'right',
    },
    {
        id: 'band',
        title: 'Event Band',
        image: musicbandImage,
        alt: 'Live music band at event',
        text: 'Create a lively and joyful atmosphere with our professional event bands. From soulful melodies to energetic performances, our musicians elevate your celebration with live entertainment that perfectly matches the mood of your occasion.',
        direction: 'left',
    },
    {
        id: 'dance',
        title: 'Dance',
        image: weddingdaydanceImage,
        alt: 'Dance performance at wedding',
        text: 'Add charm and excitement to your event with choreographed dance performances. Whether traditional, cinematic, or contemporary styles, our talented dancers bring vibrant energy and visual appeal to your special moments.',
        direction: 'right',
    },
    {
        id: 'cake',
        title: 'Wedding Cake',
        image: baptismcakeImage,
        alt: 'Beautiful wedding cake',
        text: 'Make your celebration sweeter with a beautifully crafted wedding cake customized to your theme and taste. Our cakes combine elegant design with delightful flavors, creating a perfect centerpiece for your special occasion.',
        direction: 'left',
    },
    {
        id: 'makeup',
        title: 'Makeup',
        image: makeupImage,
        alt: 'Professional bridal makeup',
        text: 'Look radiant on your special day with professional makeup services tailored to your skin tone and style. Our experts use high-quality products to create flawless, long-lasting looks that enhance your natural beauty.',
        direction: 'right',
    },
    {
        id: 'ornaments',
        title: 'Ornaments',
        image: ornamentsImage,
        alt: 'Bridal ornaments and jewelry',
        text: 'Complete your bridal look with stunning ornaments that add grace and elegance. From traditional jewelry to modern accessories, our collection is carefully selected to match your outfit and overall event theme.',
        direction: 'left',
    },
    {
        id: 'grooming',
        title: 'Groom Grooming',
        image: groomingImage,
        alt: 'Groom grooming and styling',
        text: 'Give the groom a confident and polished look with our professional grooming services. From hairstyling to skincare and beard styling, we ensure a neat and refined appearance for the big day.',
        direction: 'right',
    },
    {
        id: 'bouquet',
        title: 'Bouquet',
        image: boquetImage,
        alt: 'Beautiful bridal bouquet',
        text: 'Enhance your bridal look with beautifully arranged bouquets crafted from fresh and premium flowers. Our designs are customized to match your attire and event theme, adding charm and elegance to your special moments.',
        direction: 'left',
    },
    {
        id: 'saree',
        title: 'Saree Draping',
        image: sareeDrapingImage,
        alt: 'Expert saree draping',
        text: 'Achieve a flawless and graceful look with expert saree draping services. Our professionals ensure perfect pleats, secure fitting, and elegant styling that complements your outfit and keeps you comfortable throughout the event.',
        direction: 'right',
    },
    {
        id: 'housedecor',
        title: 'House Decor',
        image: houseDecorImage,
        alt: 'Beautiful home decoration',
        text: 'Add festive charm to your home with elegant and tasteful decorations. From floral arrangements to lighting and themed accents, our house decor service creates a welcoming and celebratory atmosphere for your guests.',
        direction: 'left',
    },
    {
        id: 'website',
        title: 'Personalized Event Website',
        image: website2Image,
        alt: 'Personalized event website',
        text: 'Share your event details with a personalized website designed just for your celebration. It includes your story, schedule, photos, and updates, making it easy for guests to stay informed and connected anytime, anywhere.',
        direction: 'right',
    },
    {
        id: 'photobooth',
        title: '360° Photobooth',
        image: photobooth2Image,
        alt: '360 degree photobooth',
        text: 'Capture fun and dynamic moments with our 360-degree photobooth experience. Guests can enjoy interactive videos and creative poses, making your event more engaging and providing unique memories to cherish.',
        direction: 'left',
    },
    {
        id: 'photography',
        title: 'Photography / Videography',
        image: photography2Image,
        alt: 'Professional photography and videography',
        text: 'Preserve every special moment with our professional photography and videography services. From candid emotions to grand highlights, we capture your celebration in high-quality visuals that you can relive for years.',
        direction: 'right',
    },
];

// First 6 sections always visible (Catering → Makeup)
const ADDON_DEFAULT_COUNT = 6;

const AddOnServices = () => {
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const sections = document.querySelectorAll('.addon-service-section');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.15 }
        );
        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, [showAll]); // re-run so newly revealed sections get observed

    // Mobile: toggle .mobile-active on addon-image-wrap when fully in view
    useEffect(() => {
        if (window.innerWidth > 768) return;
        const imageWraps = document.querySelectorAll('.addon-image-wrap');
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
        imageWraps.forEach((w) => mobileObserver.observe(w));
        return () => mobileObserver.disconnect();
    }, [showAll]);

    const visibleSections = showAll ? SECTIONS : SECTIONS.slice(0, ADDON_DEFAULT_COUNT);

    return (
        <div className="addon-services-page">
            {/* Hero */}
            <div className="page-hero" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="page-hero-overlay">
                    <img src={logo} alt="Eternal Vows Events Logo" className="page-hero-logo" />
                    <h1>Add on Services</h1>
                    <p>
                        Enhance your celebration with our carefully curated add-on services designed to bring
                        elegance, comfort, and unforgettable moments to your special day.
                    </p>
                </div>
            </div>

            {/* Service sections */}
            <div className="addon-services-content">
                <div className="addon-container">
                    {visibleSections.map((section) => {
                        const isLeft = section.direction === 'left';
                        return (
                            <section
                                key={section.id}
                                className={`addon-service-section ${isLeft ? 'from-left' : 'from-right'}`}
                                data-title={section.title}
                            >
                                {/* Image */}
                                <div className="addon-image-wrap">
                                    <div className="addon-image-inner">
                                        <img src={section.image} alt={section.alt} className="addon-service-image" />
                                    </div>
                                    <Link to="/book-event" className="addon-book-overlay">
                                        <span>Book Your Event</span>
                                    </Link>
                                </div>

                                {/* Text */}
                                <div className={isLeft ? 'addon-section-content-right' : 'addon-section-content-left'}>
                                    <h2 className="addon-section-title">{section.title}</h2>
                                    <p className="addon-section-text desktop-text">{section.text}</p>
                                    <div className="addon-section-text mobile-text">
                                        <ReadMoreText text={section.text} maxLength={180} />
                                    </div>
                                </div>
                            </section>
                        );
                    })}

                    {/* Show More button */}
                    {!showAll && (
                        <div className="addon-show-more-wrap">
                            <button
                                className="addon-show-more-btn"
                                onClick={() => setShowAll(true)}
                            >
                                Show More Services
                            </button>
                        </div>
                    )}

                    {/* Show Less Services button — appears after Photography/Videography (last service) */}
                    {showAll && (
                        <div className="addon-show-more-wrap">
                            <button
                                className="addon-show-more-btn"
                                onClick={() => setShowAll(false)}
                            >
                                Show Less Services
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddOnServices;
