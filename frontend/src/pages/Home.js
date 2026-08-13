import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import api, { getUploadUrl } from '../config/api';
import PageMeta from '../components/PageMeta';
import { ProfileSkeleton } from '../components/LoadingSkeleton';
import './Home.css';

function Home() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProfile();
    const handleFocus = () => fetchProfile();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data || {});
      setImageError(false);
      setError('');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Could not load profile. Make sure the backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const name = profile.full_name || 'Diro Uchure';
  const title = profile.title || 'Professional Video Editor';

  if (loading) {
    return (
      <div className="home">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="home">
      <PageMeta
        title={`${name} | Video Editor Portfolio`}
        description={profile.bio || `${name} - ${title}. Professional video editor portfolio showcasing creative work.`}
      />
      <div className="home-container">
        <div className="home-content">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="greeting">Welcome to my Portfolio</div>
          <h1 className="home-title">
            Hi, I'm <span className="highlight">{name}</span>
          </h1>
          <h2 className="home-subtitle">{title}</h2>
          <p className="home-description">
            {profile.bio || 'Passionate about creating amazing digital experiences'}
          </p>
          
          <div className="home-info">
            {profile.location && (
              <div className="info-item">
                <FaMapMarkerAlt /> {profile.location}
              </div>
            )}
            {profile.email && (
              <div className="info-item">
                <FaEnvelope /> {profile.email}
              </div>
            )}
            {profile.phone && (
              <div className="info-item">
                <FaPhone /> {profile.phone}
              </div>
            )}
          </div>

          <div className="home-social">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="social-link">
                <FaGithub />
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin />
              </a>
            )}
            {profile.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter />
              </a>
            )}
          </div>
          
          <div className="home-buttons">
            <Link to="/projects" className="btn btn-primary">View My Work</Link>
            <Link to="/contact" className="btn btn-secondary">Get In Touch</Link>
            {profile.resume_file && (
              <a 
                href={getUploadUrl(profile.resume_file)} 
                className="btn btn-outline"
                download
              >
                Download CV
              </a>
            )}
          </div>
        </div>

        <div className="home-image">
          {profile.profile_image && !imageError ? (
            <img 
              src={getUploadUrl(profile.profile_image, profile.updated_at || profile.profile_image)} 
              alt={name}
              className="profile-img"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="profile-placeholder">
              <div className="placeholder-icon">
                {name.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
