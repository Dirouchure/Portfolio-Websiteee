import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../config/api';
import './Experience.css';

function Experience() {
  const [experience, setExperience] = useState([]);
  const [totalYears, setTotalYears] = useState(0);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await api.get('/experience');
      setExperience(response.data);
      calculateTotalYears(response.data);
    } catch (error) {
      console.error('Error fetching experience:', error);
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
    setTotalYears(Math.round(total * 10) / 10);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="experience">
      <div className="container">
        <h1 className="page-title">Work Experience</h1>
        
        {/* Experience Summary */}
        <div className="experience-summary">
          <div className="summary-card">
            <FaBriefcase className="summary-icon" />
            <div className="summary-number">{experience.length}</div>
            <div className="summary-label">Positions</div>
          </div>
          <div className="summary-card">
            <FaCalendar className="summary-icon" />
            <div className="summary-number">{totalYears}+</div>
            <div className="summary-label">Years Experience</div>
          </div>
          <div className="summary-card">
            <FaMapMarkerAlt className="summary-icon" />
            <div className="summary-number">{experience.filter(e => e.is_current).length}</div>
            <div className="summary-label">Current Roles</div>
          </div>
        </div>
        
        <div className="experience-timeline">
          {experience.map((exp) => (
            <div key={exp.id} className="experience-item">
              <div className="experience-date">
                {formatDate(exp.start_date)} - {exp.is_current ? <><span>Present</span><span className="current-badge">Current</span></> : formatDate(exp.end_date)}
              </div>
              <div className="experience-content">
                <h3>{exp.position}</h3>
                <h4>{exp.company_name}</h4>
                {exp.responsibilities && (
                  <p className="responsibilities">{exp.responsibilities}</p>
                )}
                {exp.technologies && (
                  <div className="technologies">
                    <strong>Technologies:</strong> {exp.technologies}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Experience;
