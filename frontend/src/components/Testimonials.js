import React, { useState } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { defaultTestimonials } from '../data/defaultData';
import './Testimonials.css';

function Testimonials({ testimonials = defaultTestimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="testimonials-section">
      <div className="section-badge">Client & Colleague Endorsements</div>
      <h2 className="testimonials-heading">What People Say</h2>
      <p className="testimonials-subheading">
        Feedback from clients, technical leaders, and collaborators on past projects
      </p>

      <div className="testimonial-card">
        <FaQuoteLeft className="quote-icon" />
        <p className="testimonial-text">"{current.text}"</p>

        <div className="testimonial-rating">
          {[...Array(current.rating || 5)].map((_, i) => (
            <FaStar key={i} className="star-icon" />
          ))}
        </div>

        <div className="testimonial-author">
          <img
            src={current.avatar}
            alt={current.name}
            className="author-avatar"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(current.name) + '&background=6366f1&color=fff';
            }}
          />
          <div className="author-info">
            <h4 className="author-name">{current.name}</h4>
            <p className="author-role">
              {current.role} &bull; <span className="author-company">{current.company}</span>
            </p>
          </div>
        </div>

        <div className="testimonial-controls">
          <button 
            type="button" 
            className="slider-btn prev" 
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>
          
          <div className="slider-dots">
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>

          <button 
            type="button" 
            className="slider-btn next" 
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
