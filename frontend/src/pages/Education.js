import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './Education.css';

function Education() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await api.get('/education');
      setEducation(response.data);
    } catch (error) {
      console.error('Error fetching education:', error);
    }
  };

  return (
    <div className="education">
      <div className="container">
        <h1 className="page-title">Education</h1>
        
        <div className="education-timeline">
          {education.map((edu) => (
            <div key={edu.id} className="education-item">
              <div className="education-year">
                {edu.start_year} - {edu.end_year}
              </div>
              <div className="education-content">
                <h3>{edu.degree}</h3>
                <h4>{edu.school_name}</h4>
                <p className="department">{edu.department}</p>
                {edu.description && <p className="description">{edu.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Education;
