import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Gallery.css';

import collageImage from '../assets/images/inaugration1.jpg';
import logo from '../assets/images/logo (2).png';
import weddingImage from '../assets/images/wedding.jpg';
import weddingStageImage from '../assets/images/wedding stage.jpg';
import baptismImage from '../assets/images/baptism.jpg';
import brideToBeImage from '../assets/images/bride to be.jpg';
import birthdayImage from '../assets/images/birthday.jpg';
import weddingSectionImage from '../assets/images/weddingimage.jpg';
import baptismSectionImage from '../assets/images/baptismimage.jpg';
import bridetobeImage from '../assets/images/bridetobe.jpg';
import babyshowerImage from '../assets/images/babyshower.jpg';
import firstHolyCommunionImage from '../assets/images/firstholycommunion.jpg';
import haldiImage from '../assets/images/haldi.jpg';
import weddingAnniversaryImage from '../assets/images/wedding anniversary.jpg';
import diwaliDecorImage from '../assets/images/diwali decor.jpg';
import onamDecorImage from '../assets/images/onamdecor.jpg';
import christmasDecorImage from '../assets/images/christmas decor.jpg';

// Stage images
import stage1 from '../assets/images/stage1.jpeg';
import stage2 from '../assets/images/stage2.jpeg';
import stage3 from '../assets/images/stage3.jpeg';
import stage4 from '../assets/images/stage4.jpeg';
import stage5 from '../assets/images/stage5.jpeg';
import stage6 from '../assets/images/stage6.jpeg';
import stage7 from '../assets/images/stage7.jpeg';
import stage8 from '../assets/images/stage8.jpeg';
import stage9 from '../assets/images/stage9.jpeg';
import stage10 from '../assets/images/stage10.jpeg';
import stage11 from '../assets/images/stage11.jpeg';
import stage12 from '../assets/images/stage12.jpeg';
import stage13 from '../assets/images/stage13.jpeg';
import stage14 from '../assets/images/stage14.jpeg';
import stage15 from '../assets/images/stage15.jpeg';
import stage16 from '../assets/images/stage16.jpeg';
import stage17 from '../assets/images/stage17.jpeg';
import stage18 from '../assets/images/stage18.jpeg';
import stage19 from '../assets/images/stage19.jpeg';
import stage20 from '../assets/images/stage20.jpeg';
import stage21 from '../assets/images/stage21.jpeg';
import stage22 from '../assets/images/stage22.jpeg';

// Video assets
import video5 from '../assets/video/video5.mp4';
import video4 from '../assets/video/video4.mp4';
import video1 from '../assets/video/video1.mp4';
import video2 from '../assets/video/video2.mp4';

const AUSPICIOUS_VIDEOS = [
  {
    id: 'v1',
    src: video5,
    subheading: "Anvika's B'day",
    layout: 'left',
    content: "Celebrating one year of endless smiles, tiny footsteps, and beautiful memories. Anvika's first birthday is a special milestone filled with love, laughter, and joy. This video captures the precious moments of her big day, surrounded by family, happiness, and warm wishes for a bright and beautiful future."
  },
  {
    id: 'v2',
    src: video4,
    subheading: "Riswin's Mehndi Night",
    layout: 'right',
    content: "Reswin's Mehndi Night was a beautiful celebration of love, laughter, and timeless traditions. Surrounded by family and friends, the bride's hands were adorned with intricate mehndi designs, symbolizing joy, prosperity, and the beginning of a new journey. This special evening was filled with vibrant colors, music, and heartfelt moments that made it truly unforgettable."
  },
  {
    id: 'v3',
    src: video1,
    subheading: "Anja & Bineesh's Engagement Stage",
    layout: 'left',
    content: "Anjana and Bineesh's engagement stage marked the beginning of their beautiful journey together. Surrounded by loved ones, the couple shared smiles, laughter, and heartfelt moments as they celebrated their bond of love and commitment. This special occasion reflects the joy, warmth, and promise of a lifetime together."
  },
  {
    id: 'v4',
    src: video2,
    subheading: "Jibin & Darmitha's Wedding Stage",
    layout: 'right',
    content: "Jibin and Darmitha's wedding stage was a beautiful celebration of love and togetherness. As they began their new journey as husband and wife, the stage became a symbol of unity, commitment, and lifelong promises. Surrounded by family and friends, this special moment was filled with joy, blessings, and unforgettable memories."
  }
];

const GALLERY_IMAGES = [
  {
    id: 1,
    src: weddingImage,
    alt: 'Wedding celebration',
    category: 'Wedding',
    size: 'tall',
    content: 'A celebration of eternal love, where every detail is crafted to perfection. Elegant décor, floral arrangements, and seamless coordination create unforgettable moments that honor your special day.'
  },
  {
    id: 2,
    src: weddingStageImage,
    alt: 'Wedding stage',
    category: 'Wedding',
    size: 'wide',
    content: 'Stunning stage designs that transform your venue into a dreamscape. From classic elegance to modern sophistication, we create the perfect backdrop for your vows and celebrations.'
  },
  {
    id: 3,
    src: baptismImage,
    alt: 'Baptism ceremony',
    category: 'Baptism',
    size: 'square',
    content: 'A sacred ceremony marked with grace and reverence. We provide thoughtful arrangements and décor that honor this spiritual milestone while creating beautiful memories for families.'
  },
  {
    id: 4,
    src: brideToBeImage,
    alt: 'Bride to be',
    category: 'Wedding',
    size: 'tall',
    content: 'Celebrating the journey to forever with elegant bridal showers and pre-wedding events. Every moment is designed to honor the bride with style, grace, and unforgettable experiences.'
  },
  {
    id: 5,
    src: birthdayImage,
    alt: 'Birthday celebration',
    category: 'Birthday',
    size: 'wide',
    content: 'Making every year count with vibrant celebrations. From intimate gatherings to grand parties, we bring creativity and joy to create birthday memories that last a lifetime.'
  },
  {
    id: 6,
    src: weddingSectionImage,
    alt: 'Wedding event',
    category: 'Wedding',
    size: 'tall',
    content: 'Complete wedding coordination that brings your vision to life. From ceremony to reception, we handle every detail with precision and care, ensuring your day flows flawlessly.'
  },
  {
    id: 7,
    src: baptismSectionImage,
    alt: 'Baptism event',
    category: 'Baptism',
    size: 'square',
    content: 'Graceful arrangements for this blessed occasion. We create serene and beautiful settings that reflect the spiritual significance while celebrating new beginnings with families.'
  },
  {
    id: 8,
    src: bridetobeImage,
    alt: 'Bride to be event',
    category: 'Wedding',
    size: 'wide',
    content: 'Elegant pre-wedding celebrations that honor the bride. Thoughtful décor, delightful themes, and seamless execution create cherished moments before the big day arrives.'
  },
  {
    id: 9,
    src: babyshowerImage,
    alt: 'Baby shower',
    category: 'Baby Shower',
    size: 'tall',
    content: 'Celebrating new life with warmth and joy. Adorable themes, delightful decorations, and thoughtful touches create a magical welcome for the little one on the way.'
  },
  {
    id: 10,
    src: firstHolyCommunionImage,
    alt: 'First Holy Communion',
    category: 'Communion',
    size: 'square',
    content: 'A sacred milestone celebrated with reverence and beauty. Elegant décor and careful arrangements honor this spiritual journey, creating a meaningful and memorable ceremony for families.'
  },
  {
    id: 11,
    src: haldiImage,
    alt: 'Haldi ceremony',
    category: 'Wedding',
    size: 'wide',
    content: 'Vibrant traditions brought to life with authentic décor and joyful celebrations. We honor cultural heritage while creating colorful, festive moments that families treasure forever.'
  },
  {
    id: 12,
    src: weddingAnniversaryImage,
    alt: 'Wedding anniversary',
    category: 'Anniversary',
    size: 'tall',
    content: 'Celebrating years of love and commitment with elegant gatherings. From intimate dinners to grand celebrations, we create beautiful moments that honor enduring partnerships.'
  },
  {
    id: 13,
    src: diwaliDecorImage,
    alt: 'Diwali decoration',
    category: 'Festival',
    size: 'wide',
    content: 'Illuminating celebrations with radiant décor and festive arrangements. We bring the spirit of Diwali to life with lights, colors, and traditional elegance that brighten every corner.'
  },
  {
    id: 14,
    src: onamDecorImage,
    alt: 'Onam decoration',
    category: 'Festival',
    size: 'square',
    content: 'Traditional beauty meets modern elegance in our Onam celebrations. Vibrant floral arrangements, authentic décor, and cultural touches create a festive atmosphere filled with joy.'
  },
  {
    id: 15,
    src: christmasDecorImage,
    alt: 'Christmas decoration',
    category: 'Festival',
    size: 'tall',
    content: 'Spreading holiday cheer with enchanting Christmas décor. From elegant trees to festive arrangements, we create magical settings that capture the warmth and wonder of the season.'
  },
];

// Stage work images — no text overlay
const STAGE_IMAGES = [
  { id: 's1', src: stage1, alt: 'Stage Work 1', size: 'tall' },
  { id: 's2', src: stage2, alt: 'Stage Work 2', size: 'wide' },
  { id: 's3', src: stage3, alt: 'Stage Work 3', size: 'square' },
  { id: 's4', src: stage4, alt: 'Stage Work 4', size: 'tall' },
  { id: 's5', src: stage5, alt: 'Stage Work 5', size: 'wide' },
  { id: 's6', src: stage6, alt: 'Stage Work 6', size: 'square' },
  { id: 's7', src: stage7, alt: 'Stage Work 7', size: 'tall' },
  { id: 's8', src: stage8, alt: 'Stage Work 8', size: 'wide' },
  { id: 's9', src: stage9, alt: 'Stage Work 9', size: 'square' },
  { id: 's10', src: stage10, alt: 'Stage Work 10', size: 'tall' },
  { id: 's11', src: stage11, alt: 'Stage Work 11', size: 'wide' },
  { id: 's12', src: stage12, alt: 'Stage Work 12', size: 'square' },
  { id: 's13', src: stage13, alt: 'Stage Work 13', size: 'tall' },
  { id: 's14', src: stage14, alt: 'Stage Work 14', size: 'wide' },
  { id: 's15', src: stage15, alt: 'Stage Work 15', size: 'square' },
  { id: 's16', src: stage16, alt: 'Stage Work 16', size: 'tall' },
  { id: 's17', src: stage17, alt: 'Stage Work 17', size: 'wide' },
  { id: 's18', src: stage18, alt: 'Stage Work 18', size: 'square' },
  { id: 's19', src: stage19, alt: 'Stage Work 19', size: 'tall' },
  { id: 's20', src: stage20, alt: 'Stage Work 20', size: 'wide' },
  { id: 's21', src: stage21, alt: 'Stage Work 21', size: 'square' },
  { id: 's22', src: stage22, alt: 'Stage Work 22', size: 'tall' },
];

const STAGE_DEFAULT_COUNT = 12;

// ── Lightbox Modal ──────────────────────────────────────────────────────────
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    // Prevent body scroll when lightbox open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  const current = images[currentIndex];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Prevent clicks on the content from closing */}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>

        {/* Left arrow */}
        <button
          className="lightbox-arrow lightbox-arrow--left"
          onClick={onPrev}
          aria-label="Previous image"
        >
          &#8249;
        </button>

        {/* Image */}
        <img
          src={current.src}
          alt={current.alt}
          className="lightbox-image"
        />

        {/* Right arrow */}
        <button
          className="lightbox-arrow lightbox-arrow--right"
          onClick={onNext}
          aria-label="Next image"
        >
          &#8250;
        </button>

        {/* Counter */}
        <div className="lightbox-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [visible, setVisible] = useState({});
  const itemRefs = useRef({});

  // Stage "See More" state
  const [stageExpanded, setStageExpanded] = useState(false);
  const [stageVisible, setStageVisible] = useState({});
  const stageRefs = useRef({});

  // Lightbox state
  const [lightbox, setLightbox] = useState(null); // { images, index }

  const openLightbox = useCallback((images, index) => {
    setLightbox({ images, index });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prevImage = useCallback(() => {
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : null
    );
  }, []);

  const nextImage = useCallback(() => {
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : null
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.galleryId;
            setVisible((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { rootMargin: '40px 0px', threshold: 0.05 }
    );

    GALLERY_IMAGES.forEach((img) => {
      const el = itemRefs.current[img.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Observer for stage images
  useEffect(() => {
    const stageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.stageId;
            setStageVisible((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { rootMargin: '40px 0px', threshold: 0.05 }
    );

    const visibleStages = stageExpanded ? STAGE_IMAGES : STAGE_IMAGES.slice(0, STAGE_DEFAULT_COUNT);
    visibleStages.forEach((img) => {
      const el = stageRefs.current[img.id];
      if (el) stageObserver.observe(el);
    });

    return () => stageObserver.disconnect();
  }, [stageExpanded]);

  const displayedStages = stageExpanded ? STAGE_IMAGES : STAGE_IMAGES.slice(0, STAGE_DEFAULT_COUNT);

  return (
    <div className="gallery-page">
      <div
        className="page-hero"
        style={{ backgroundImage: `url(${collageImage})` }}
      >
        <div className="page-hero-overlay">
          <img src={logo} alt="Logo" className="page-hero-logo" />
          <h1>Our Gallery</h1>
          <p>
            Explore our collection and relive the beautiful moments we've created.
          </p>
        </div>
      </div>

      {/* ── Main gallery section ── */}
      <div className="gallery-content">
        <div className="gallery-container">
          <div className="gallery-masonry">
            {GALLERY_IMAGES.map((image, index) => (
              <div
                key={image.id}
                ref={(el) => (itemRefs.current[image.id] = el)}
                data-gallery-id={image.id}
                className={`gallery-item gallery-item--${image.size} ${visible[image.id] ? 'gallery-item--visible' : ''}`}
                style={{ '--stagger': `${index * 0.05}s` }}
              >
                <div
                  className="gallery-item-inner"
                  onClick={() => openLightbox(GALLERY_IMAGES, index)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="gallery-image"
                  />
                  <div className="gallery-item-overlay">
                    <span className="gallery-item-title">{image.category}</span>
                    <p className="gallery-item-description">{image.content}</p>
                  </div>
                  <div className="gallery-item-category-label">{image.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Our Auspicious Moments section ── */}
      <div className="auspicious-section">
        <div className="gallery-container">
          <div className="stage-works-header">
            <h2 className="stage-works-title">Our Auspicious Moments</h2>
            <div className="stage-works-divider" />
          </div>

          {AUSPICIOUS_VIDEOS.map((item) => (
            <div
              key={item.id}
              className={`auspicious-row auspicious-row--${item.layout}`}
            >
              {/* Video side */}
              <div className="auspicious-video-wrap">
                <div className="auspicious-video-inner">
                  <video
                    src={item.src}
                    className="auspicious-video"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => {
                      const vid = e.currentTarget;
                      const playPromise = vid.play();
                      if (playPromise !== undefined) {
                        playPromise.catch(() => {/* interrupted — ignore */ });
                      }
                    }}
                    onMouseLeave={(e) => {
                      const vid = e.currentTarget;
                      const playPromise = vid.play();
                      if (playPromise !== undefined) {
                        playPromise.then(() => {
                          vid.pause();
                          vid.currentTime = 0;
                        }).catch(() => {/* already paused or interrupted — ignore */ });
                      } else {
                        vid.pause();
                        vid.currentTime = 0;
                      }
                    }}
                  />
                </div>
              </div>

              {/* Text side */}
              <div className="auspicious-content">
                <h3 className="auspicious-subheading">{item.subheading}</h3>
                <p className="auspicious-text">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Our Stage Works section ── */}
      <div className="stage-works-section">
        <div className="gallery-container">
          <div className="stage-works-header">
            <h2 className="stage-works-title">Our Stage Works</h2>
            <div className="stage-works-divider" />
          </div>

          <div className="gallery-masonry">
            {displayedStages.map((image, index) => (
              <div
                key={image.id}
                ref={(el) => (stageRefs.current[image.id] = el)}
                data-stage-id={image.id}
                className={`gallery-item gallery-item--${image.size} ${stageVisible[image.id] ? 'gallery-item--visible' : ''}`}
                style={{ '--stagger': `${index * 0.05}s` }}
              >
                <div
                  className="gallery-item-inner gallery-item-inner--no-overlay"
                  onClick={() => openLightbox(displayedStages, index)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="gallery-image"
                  />
                </div>
              </div>
            ))}
          </div>

          {!stageExpanded && (
            <div className="stage-see-more-wrap">
              <button
                className="about-explore-services-btn stage-see-more-btn"
                onClick={() => setStageExpanded(true)}
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          currentIndex={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

export default Gallery;
