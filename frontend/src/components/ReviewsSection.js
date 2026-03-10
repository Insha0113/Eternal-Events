import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./ReviewsSection.css";
import akhilImg from "../assets/images/akhilsanthosh.jpg";
import anannyaImg from "../assets/images/anannyaraman.jpg";
import frPeterImg from "../assets/images/frpeterambathinkal.png";

const ReviewsSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // The redirect target includes the current path + hash so after login the user
  // lands back exactly at the reviews section
  const reviewFrom = location.pathname + '#reviews';

  // Seed reviews
  const [reviews, setReviews] = useState([
    {
      name: "Fr. Peter Ambalathinkal",
      rating: 5,
      text: "Amazing service! Everything was perfect for the church day. Eternal Vows made the day truly heavenly.",
      avatar: frPeterImg,
    },
    {
      name: "Akhil Santhosh",
      rating: 5,
      text: "Great experience from start to finish. Highly recommend for any event. Professional and on point.",
      avatar: akhilImg,
    },
    {
      name: "Anannya Raman",
      rating: 5,
      text: "Professional and friendly staff. Loved every detail—decor, coordination, and the overall vibe. Will book again!",
      avatar: anannyaImg,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
        setIsAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Form state
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Inline auth banner state — shown when non-logged-in user clicks any field
  const [showAuthBanner, setShowAuthBanner] = useState(false);

  // Pre-fill name when user logs in
  useEffect(() => {
    if (user) {
      const displayName =
        user.name ||
        (user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || "");
      setName(displayName);
      setShowAuthBanner(false); // hide banner once logged in
    } else {
      setName("");
    }
  }, [user]);

  // Called whenever a non-logged-in user interacts with any form field
  const handleGuestInteraction = () => {
    if (!user) {
      setShowAuthBanner(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthBanner(true);
      return;
    }
    if (!name.trim() || !text.trim()) {
      alert("Please fill in your name and review.");
      return;
    }
    const newReview = {
      name: name.trim(),
      rating,
      text: text.trim(),
      avatar: user.picture || undefined,
    };
    setReviews((prev) => [...prev, newReview]);
    setText("");
    setRating(5);
    setHoverRating(0);
  };

  const current = reviews[currentIndex];

  const renderAvatar = (review) => {
    if (review.avatar) {
      return (
        <img
          src={review.avatar}
          alt={review.name}
          className="review-avatar-img"
        />
      );
    }
    const firstLetter = review.name ? review.name.charAt(0).toUpperCase() : "?";
    return (
      <div className="review-avatar-placeholder">
        <span>{firstLetter}</span>
      </div>
    );
  };

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">
        <h2 className="reviews-heading">What Our Clients Say</h2>

        {/* Review Carousel */}
        <div className="reviews-carousel">
          <div
            className={`reviews-carousel-inner ${isAnimating ? "slide-out" : ""}`}
            key={currentIndex}
          >
            <div className="review-card">
              <div className="review-card-top">
                {renderAvatar(current)}
                <div className="review-card-meta">
                  <p className="review-author">{current.name}</p>
                  <p className="review-stars" aria-hidden="true">
                    {"★".repeat(current.rating)}
                    {"☆".repeat(5 - current.rating)}
                  </p>
                </div>
              </div>
              <blockquote className="review-text">"{current.text}"</blockquote>
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="reviews-dots" aria-label="Review navigation">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`reviews-dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* Feedback Form */}
        <div className="reviews-feedback">
          <h3 className="reviews-feedback-heading">Share Your Experience</h3>

          {/* ── Auth Banner ── shown only when guest clicks a field */}
          {showAuthBanner && !user && (
            <div className="reviews-auth-banner">
              <p className="reviews-auth-banner-msg">
                Please <strong>log in</strong> or <strong>sign up</strong> to leave a review.
              </p>
              <div className="reviews-auth-banner-actions">
                <Link to="/login" state={{ from: reviewFrom }} className="reviews-auth-btn reviews-auth-btn-login">
                  Log In
                </Link>
                <Link to="/signup" state={{ from: reviewFrom }} className="reviews-auth-btn reviews-auth-btn-signup">
                  Sign Up
                </Link>
              </div>
              <button
                type="button"
                className="reviews-auth-banner-close"
                onClick={() => setShowAuthBanner(false)}
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reviews-form">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onFocus={handleGuestInteraction}
              onChange={(e) => {
                if (user) setName(e.target.value);
              }}
              className="reviews-input"
              aria-label="Your name"
              readOnly={!user}
            />
            <textarea
              placeholder="Your review about our service..."
              value={text}
              onFocus={handleGuestInteraction}
              onChange={(e) => {
                if (user) setText(e.target.value);
              }}
              rows={3}
              className="reviews-textarea"
              aria-label="Your review"
              readOnly={!user}
            />

            {/* Stars inside form */}
            <div className="reviews-rating-wrap">
              <span className="reviews-rating-label">Rating:</span>
              <div
                className="reviews-stars-input"
                role="group"
                aria-label="Rate 1 to 5 stars"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      className={`reviews-star-btn ${isActive ? "active" : "inactive"}`}
                      onClick={() => {
                        if (!user) {
                          handleGuestInteraction();
                          return;
                        }
                        setRating(star);
                      }}
                      onMouseEnter={() => {
                        // Never show alert on hover — only update visual highlight if logged in
                        if (user) setHoverRating(star);
                      }}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      aria-pressed={star <= rating}
                    >
                      {isActive ? "★" : "☆"}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="reviews-submit">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
