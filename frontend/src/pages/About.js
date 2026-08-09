import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaDownload, FaBriefcase, FaGraduationCap, FaAward, FaCode, FaCalendar, FaUser } from 'react-icons/fa';
import api from '../config/api';
import './About.css';

function About() {
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certificates: 0,
    experience: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [projects, skills, certificates, experience] = await Promise.all([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/certificates'),
        api.get('/experience')
      ]);
      setStats({
        projects: projects.data.length,
        skills: skills.data.length,
        certificates: certificates.data.length,
        experience: experience.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="about">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="about">
      <div className="container">
        <h1 className="page-title">About Me</h1>
        
        <div className="about-content">
          <div className="about-main">
            <div className="about-image-section">
              {profile.profile_image ? (
                <img 
                  src={`http://localhost:5000/uploads/${profile.profile_image}`} 
                  alt={profile.full_name}
                  className="about-profile-img"
                />
              ) : (
                <div className="about-placeholder">
                  <div className="placeholder-text">
                    {profile.full_name ? profile.full_name.charAt(0) : '?'}
                  </div>
                </div>
              )}
              
              <div className="about-quick-info">
                <h3>{profile.full_name || 'DIRO UCHURE'}</h3>
                <p className="title">{profile.title || 'Professional Title'}</p>
                
                {profile.resume_file && (
                  <a 
                    href={`http://localhost:5000/uploads/${profile.resume_file}`}
                    className="btn btn-primary"
                    download
                  >
                    <FaDownload /> Download CV
                  </a>
                )}
              </div>
            </div>

            <div className="about-details">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <FaBriefcase className="stat-icon" />
                  <div className="stat-number">{stats.projects}</div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="stat-card">
                  <FaCode className="stat-icon" />
                  <div className="stat-number">{stats.skills}</div>
                  <div className="stat-label">Skills</div>
                </div>
                <div className="stat-card">
                  <FaAward className="stat-icon" />
                  <div className="stat-number">{stats.certificates}</div>
                  <div className="stat-label">Certificates</div>
                </div>
                <div className="stat-card">
                  <FaGraduationCap className="stat-icon" />
                  <div className="stat-number">{stats.experience}+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
              </div>

              <div className="about-section">
                <h2><FaUser /> Who I Am</h2>
                <p className="bio-text">
                  {profile.bio || 'Information about me will be displayed here.'}
                </p>
              </div>

              {profile.objective && (
                <div className="about-section">
                  <h2>Career Objective</h2>
                  <p className="objective-text">
                    {profile.objective}
                  </p>
                </div>
              )}

              <div className="about-section">
                <h2>Contact Information</h2>
                <div className="contact-info-grid">
                  {profile.email && (
                    <div className="contact-info-item">
                      <FaEnvelope className="contact-icon" />
                      <div>
                        <strong>Email</strong>
                        <p>{profile.email}</p>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="contact-info-item">
                      <FaPhone className="contact-icon" />
                      <div>
                        <strong>Phone</strong>
                        <p>{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="contact-info-item">
                      <FaMapMarkerAlt className="contact-icon" />
                      <div>
                        <strong>Location</strong>
                        <p>{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(profile.github_url || profile.linkedin_url || profile.twitter_url) && (
                <div className="about-section">
                  <h2>Connect With Me</h2>
                  <div className="social-links">
                    {profile.github_url && (
                      <a 
                        href={profile.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-btn"
                      >
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a 
                        href={profile.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-btn"
                      >
                        <FaLinkedin /> LinkedIn
                      </a>
                    )}
                    {profile.twitter_url && (
                      <a 
                        href={profile.twitter_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-btn"
                      >
                        <FaTwitter /> Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
