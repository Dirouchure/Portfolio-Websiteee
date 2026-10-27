import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { defaultProfile } from '../data/defaultData';
import './Footer.css';

function Footer() {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_profile');
      return cached ? { ...defaultProfile, ...JSON.parse(cached) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    api.get('/profile')
      .then((response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          setProfile((prev) => ({ ...defaultProfile, ...prev, ...response.data }));
        }
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    { url: profile.github_url, icon: FaGithub, label: 'GitHub' },
    { url: profile.linkedin_url, icon: FaLinkedin, label: 'LinkedIn' },
    { url: profile.twitter_url, icon: FaTwitter, label: 'Twitter' },
  ].filter((link) => link.url);

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-about">
            <h3>About</h3>
            <p>{profile.bio || 'Full Stack Web Developer passionate about creating innovative digital solutions and bringing ideas to life through clean, efficient code.'}</p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/skills">Skills</Link></li>
              <li><Link to="/experience">Experience</Link></li>
              <li><Link to="/education">Education</Link></li>
              <li><Link to="/certificates">Certificates</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Get in Touch</h3>
            {profile.email && (
              <p><FaEnvelope /> {profile.email}</p>
            )}
            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" title={label}>
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">
            &copy; {year} {profile.full_name || 'Diro Uchure'}. All rights reserved.
          </p>
          <div className="footer-admin-link">
            <Link to="/admin/login">🔒 Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
