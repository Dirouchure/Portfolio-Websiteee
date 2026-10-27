import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGithub, FaLinkedin, FaTwitter, FaFileDownload, FaCode, 
  FaLightbulb, FaShieldAlt, FaRocket, FaEnvelope, FaMapMarkerAlt, FaPaperPlane,
  FaPhone, FaTelegram
} from 'react-icons/fa';
import api, { getUploadUrl } from '../config/api';
import defaultProfilePic from '../assets/profile.jpg';
import PageMeta from '../components/PageMeta';
import { ProfileSkeleton } from '../components/LoadingSkeleton';
import AchievementBadges from '../components/AchievementBadges';
import { defaultProfile } from '../data/defaultData';
import './About.css';

function About() {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...defaultProfile,
          ...parsed,
          profile_image: (parsed.profile_image && parsed.profile_image !== '/images/avatar.svg' && parsed.profile_image !== '/images/profile.jpg') ? parsed.profile_image : defaultProfilePic,
        };
      }
      return defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data && Object.keys(response.data).length > 0) {
        const localCached = localStorage.getItem('portfolio_profile');
        if (response.data._is_default && localCached) {
          return;
        }

        setProfile((prev) => ({
          ...defaultProfile,
          ...prev,
          ...response.data,
        }));
        localStorage.setItem(
          'portfolio_profile',
          JSON.stringify({ ...defaultProfile, ...response.data }),
        );
      }
      setImageError(false);
      setError('');
    } catch (err) {
      console.log('Using default profile in About');
    }
  };

  if (loading) {
    return (
      <div className="about">
        <ProfileSkeleton />
      </div>
    );
  }

  const name = profile.full_name || 'Diro Uchure';
  const title = profile.title || 'Full Stack Web Developer';

  return (
    <div className="about">
      <PageMeta
        title={`About ${name} | Full Stack Web Developer & Software Engineer`}
        description={
          profile.bio ||
          `Learn more about ${name}, a professional Full Stack Web Developer specializing in modern web applications, React, Node.js, and scalable APIs.`
        }
      />
      
      <div className="about-container">
        <div className="about-header">
          <span className="about-badge">Career & Background</span>
          <h1 className="about-main-title">About Me</h1>
          <p className="about-subtitle">
            Passionate full-stack web developer dedicated to building impactful, scalable, and intuitive software products.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="about-grid-card">
          <div className="about-profile-col">
            <div className="about-image-wrapper">
              <img
                src={
                  !imageError && profile.profile_image
                    ? getUploadUrl(
                        profile.profile_image,
                        profile.updated_at || profile.profile_image,
                      )
                    : defaultProfilePic
                }
                alt={name}
                className="profile-photo"
                onError={(e) => {
                  setImageError(true);
                  e.currentTarget.src = defaultProfilePic;
                }}
              />
            </div>

            <h3 className="profile-name">{name}</h3>
            <p className="profile-role">{title}</p>
            
            {profile.location && (
              <p className="profile-location">
                <FaMapMarkerAlt /> {profile.location}
              </p>
            )}

            <div className="profile-actions-stacked">
              {profile.resume_file ? (
                <a 
                  href={getUploadUrl(profile.resume_file)} 
                  className="btn btn-primary"
                  download
                >
                  <FaFileDownload /> Download Resume
                </a>
              ) : (
                <Link to="/contact" className="btn btn-primary">
                  <FaPaperPlane /> Contact Me
                </Link>
              )}
            </div>

            <div className="social-links-about">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="about-social-icon" title="Email">
                  <FaEnvelope />
                </a>
              )}
              <a href="tel:+251940672637" className="about-social-icon" title="Phone">
                <FaPhone />
              </a>
              <a href="https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav" target="_blank" rel="noopener noreferrer" className="about-social-icon" title="LinkedIn">
                <FaLinkedin />
              </a>
              <a href={profile.github_url || 'https://github.com/Dirouchure'} target="_blank" rel="noopener noreferrer" className="about-social-icon" title="GitHub">
                <FaGithub />
              </a>
              <a href={profile.linkedin_url || 'https://linkedin.com/in/dirouchure'} target="_blank" rel="noopener noreferrer" className="about-social-icon" title="LinkedIn">
                <FaLinkedin />
              </a>
              <a href={profile.telegram_url || 'https://t.me/forall4037'} target="_blank" rel="noopener noreferrer" className="about-social-icon" title="Telegram">
                <FaTelegram />
              </a>
              <a href={profile.twitter_url || 'https://twitter.com/dirouchure'} target="_blank" rel="noopener noreferrer" className="about-social-icon" title="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          <div className="about-bio-col">
            <h2>Transforming Complex Ideas into Elegant Digital Realities</h2>
            
            <div className="bio-paragraphs">
              <p>
                Hello! I'm <strong>{name}</strong>, a Full Stack Web Developer with 3+ years of practical experience architecting and launching production-ready web applications. My development philosophy is rooted in writing clean, modular code, enforcing robust data integrity, and creating intuitive user experiences.
              </p>
              <p>
                I thrive at the intersection of robust backend engineering and responsive frontend design. Whether building normalized relational database schemas in MySQL, designing secure RESTful API endpoints with Express and JWT authentication, or constructing performant, interactive interfaces in React, I maintain relentless attention to detail and performance.
              </p>
              <p>
                Throughout my career, I have collaborated with diverse clients, startups, and product teams to translate complex business requirements into maintainable, scalable web solutions. I am committed to continuous learning, modern DevOps practices, and writing software that creates tangible business value.
              </p>
            </div>

            {/* Core Values / What I Bring to the Table */}
            <div className="values-section">
              <h3>What I Bring to Every Project</h3>
              <div className="values-grid">
                <div className="value-item">
                  <FaCode className="val-icon" />
                  <div>
                    <h4>Clean Code Architecture</h4>
                    <p>Maintainable, well-documented code adhering to industry design patterns and SOLID principles.</p>
                  </div>
                </div>

                <div className="value-item">
                  <FaRocket className="val-icon" />
                  <div>
                    <h4>Performance First</h4>
                    <p>Optimized bundle sizes, fast load times, and responsive mobile-first layouts across all devices.</p>
                  </div>
                </div>

                <div className="value-item">
                  <FaShieldAlt className="val-icon" />
                  <div>
                    <h4>Security & Reliability</h4>
                    <p>Robust input validation, protected routes, rate limiting, and defensive error handling.</p>
                  </div>
                </div>

                <div className="value-item">
                  <FaLightbulb className="val-icon" />
                  <div>
                    <h4>Collaborative Problem Solving</h4>
                    <p>Transparent communication, proactive updates, and rapid adaptation in agile sprint environments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="about-stats-grid">
              <div className="about-stat-box">
                <span className="stat-num">3+</span>
                <span className="stat-desc">Years of Experience</span>
              </div>
              <div className="about-stat-box">
                <span className="stat-num">15+</span>
                <span className="stat-desc">Projects Delivered</span>
              </div>
              <div className="about-stat-box">
                <span className="stat-num">100%</span>
                <span className="stat-desc">Client Dedication</span>
              </div>
            </div>

            {/* Achievement Badges */}
            <AchievementBadges />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
