import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaFileDownload, FaLaptopCode, FaRocket } from 'react-icons/fa';
import api, { getUploadUrl } from '../config/api';
import PageMeta from '../components/PageMeta';
import { defaultExperience, defaultProfile } from '../data/defaultData';
import './Experience.css';

function Experience() {
  const [experience, setExperience] = useState(() => defaultExperience);
  const [profile, setProfile] = useState(() => defaultProfile);
  const [totalYears, setTotalYears] = useState(2.5);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const [expRes, profileRes] = await Promise.allSettled([
        api.get('/experience'),
        api.get('/profile')
      ]);

      if (expRes.status === 'fulfilled' && Array.isArray(expRes.value.data) && expRes.value.data.length > 0) {
        setExperience(expRes.value.data);
        calculateTotalYears(expRes.value.data);
      }

      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        setProfile((prev) => ({ ...defaultProfile, ...prev, ...profileRes.value.data }));
      }
    } catch (error) {
      console.log('Using default experience');
    }
  };

  const calculateTotalYears = (expData) => {
    let total = 0;
    expData.forEach(exp => {
      const start = new Date(exp.start_date);
      const end = exp.is_current ? new Date() : new Date(exp.end_date);
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      total += years;
    });
    setTotalYears(Math.max(2.5, Math.round(total * 10) / 10));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="experience">
      <PageMeta
        title="Work Experience & Career Journey | Diro Uchure"
        description="Career history, software engineering roles, key responsibilities, and technologies mastered by Diro Uchure."
      />

      <div className="container">
        <div className="experience-header">
          <span className="experience-badge">Career Track Record</span>
          <h1 className="page-title">Work Experience</h1>
          <p className="page-subtitle">
            Demonstrated track record of delivering production-ready web applications, responsive user interfaces, and robust APIs.
          </p>
        </div>
        
        {/* Experience Summary Cards */}
        <div className="experience-summary">
          <div className="summary-card">
            <FaBriefcase className="summary-icon" />
            <div className="summary-number">{experience.length}</div>
            <div className="summary-label">Key Positions</div>
          </div>
          <div className="summary-card">
            <FaCalendar className="summary-icon" />
            <div className="summary-number">{totalYears}+</div>
            <div className="summary-label">Years Practical Experience</div>
          </div>
          <div className="summary-card">
            <FaMapMarkerAlt className="summary-icon" />
            <div className="summary-number">{experience.filter(e => e.is_current).length || 1}</div>
            <div className="summary-label">Active / Current Roles</div>
          </div>
        </div>
        
        {/* Experience Timeline */}
        <div className="experience-timeline">
          {experience.map((exp) => (
            <div key={exp.id} className="experience-item">
              <div className="experience-date">
                <FaCalendar className="date-icon" />
                <span>
                  {formatDate(exp.start_date)} &mdash; {exp.is_current ? <span>Present</span> : formatDate(exp.end_date)}
                </span>
                {exp.is_current && <span className="current-badge">Current Role</span>}
              </div>
              <div className="experience-content">
                <div className="exp-role-header">
                  <FaLaptopCode className="role-icon" />
                  <div>
                    <h3>{exp.position}</h3>
                    <h4>{exp.company_name}</h4>
                  </div>
                </div>

                {exp.responsibilities && (
                  <div className="responsibilities-block">
                    <p className="responsibilities">{exp.responsibilities}</p>
                  </div>
                )}

                {exp.technologies && (
                  <div className="technologies-container">
                    <span className="tech-heading">Stack & Tools:</span>
                    <div className="tech-badge-list">
                      {exp.technologies.split(',').map((tech, idx) => (
                        <span key={idx} className="tech-badge-item">{tech.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resume Download CTA */}
        <div className="experience-resume-card">
          <div className="resume-card-content">
            <FaRocket className="resume-rocket-icon" />
            <div>
              <h3>Want a comprehensive breakdown of my background?</h3>
              <p>Download my official curriculum vitae or reach out directly for references and project portfolios.</p>
            </div>
          </div>
          <div className="resume-card-actions">
            {profile.resume_file ? (
              <a 
                href={getUploadUrl(profile.resume_file)} 
                className="btn btn-primary"
                download
              >
                <FaFileDownload /> Download Full CV
              </a>
            ) : (
              <Link to="/contact" className="btn btn-primary">
                <FaFileDownload /> Request Resume
              </Link>
            )}
            <Link to="/contact" className="btn btn-secondary">
              Contact Me &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;
