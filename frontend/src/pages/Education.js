import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaCalendarAlt, FaUniversity, FaBookOpen, FaAward } from 'react-icons/fa';
import api from '../config/api';
import PageMeta from '../components/PageMeta';
import { defaultEducation } from '../data/defaultData';
import './Education.css';

const DEFAULT_COURSEWORK = [
  'Data Structures & Algorithms',
  'Relational Database Management Systems',
  'Software Architecture & Design Patterns',
  'Modern Web Engineering & Protocols',
  'Object-Oriented Programming (OOP)',
  'Operating Systems & Networking',
  'Software Testing & Quality Assurance',
  'Information Security & Cryptography'
];

function Education() {
  const [education, setEducation] = useState(() => defaultEducation);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await api.get('/education');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setEducation(response.data);
      }
    } catch (error) {
      console.log('Using default education data');
    }
  };

  return (
    <div className="education">
      <PageMeta
        title="Education & Academic Background | Diro Uchure"
        description="Academic background, degree in Computer Science, and foundational engineering principles of Diro Uchure."
      />

      <div className="container">
        <div className="education-header">
          <span className="education-badge">Academic Foundation</span>
          <h1 className="page-title">Education & Qualifications</h1>
          <p className="page-subtitle">
            Rigorous computer science curriculum grounding my practical software engineering career.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="education-timeline">
          {education.map((edu) => (
            <div key={edu.id} className="education-item">
              <div className="education-year">
                <FaCalendarAlt className="cal-icon" /> {edu.start_year} &mdash; {edu.end_year}
              </div>
              <div className="education-content">
                <div className="edu-top-row">
                  <div className="edu-degree-badge">
                    <FaGraduationCap /> Degree
                  </div>
                </div>
                <h3>{edu.degree}</h3>
                <h4><FaUniversity className="uni-icon" /> {edu.school_name}</h4>
                <p className="department">{edu.department}</p>
                {edu.description && <p className="description">{edu.description}</p>}

                {/* Key Coursework */}
                <div className="coursework-section">
                  <h5><FaBookOpen /> Core Coursework & Specializations:</h5>
                  <div className="coursework-tags">
                    {DEFAULT_COURSEWORK.map((course, idx) => (
                      <span key={idx} className="course-tag">{course}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Highlights */}
        <div className="academic-highlights-card">
          <FaAward className="academic-award-icon" />
          <div className="highlight-text">
            <h3>Rigorous Computer Science Training</h3>
            <p>
              Emphasized algorithm complexity analysis, database normalization, system architecture, and secure software development lifecycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
