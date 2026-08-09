import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import api from '../config/api';
import './Skills.css';

function Skills() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
      
      const uniqueCategories = [...new Set(response.data.map(skill => skill.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const getSkillsByCategory = (category) => {
    return skills.filter(skill => skill.category === category);
  };

  const getFilteredSkills = () => {
    let filtered = skills;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(skill => 
        skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getAverageProficiency = (category) => {
    const categorySkills = getSkillsByCategory(category);
    if (categorySkills.length === 0) return 0;
    const sum = categorySkills.reduce((acc, skill) => acc + skill.proficiency, 0);
    return Math.round(sum / categorySkills.length);
  };

  const filteredSkills = getFilteredSkills();

  return (
    <div className="skills">
      <div className="container">
        <h1 className="page-title">Technical Skills</h1>
        
        {/* Filter and Search */}
        <div className="skills-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button 
              className={selectedCategory === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedCategory('all')}
            >
              <FaFilter /> All ({skills.length})
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={selectedCategory === category ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setSelectedCategory(category)}
              >
                {category || 'Other'} ({getSkillsByCategory(category).length})
              </button>
            ))}
          </div>
        </div>

        {/* Category Overview Cards */}
        {selectedCategory === 'all' && (
          <div className="category-overview">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <h3>{category || 'Other'}</h3>
                <div className="category-stats">
                  <span className="skill-count">{getSkillsByCategory(category).length} Skills</span>
                  <span className="avg-proficiency">Avg: {getAverageProficiency(category)}%</span>
                </div>
                <div className="category-progress">
                  <div 
                    className="category-progress-bar" 
                    style={{ width: `${getAverageProficiency(category)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Display */}
        <div className="skills-container">
          {selectedCategory === 'all' ? (
            // Show by categories
            categories.map((category, index) => (
              <div key={index} className="skill-category">
                <h2 className="category-title">{category || 'Other'}</h2>
                <div className="skills-list">
                  {getSkillsByCategory(category).map((skill) => (
                    <div key={skill.id} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.skill_name}</span>
                        <span className="skill-percent">{skill.proficiency}%</span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className="skill-progress" 
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Show filtered skills
            <div className="skill-category">
              <h2 className="category-title">{selectedCategory}</h2>
              <div className="skills-list">
                {filteredSkills.map((skill) => (
                  <div key={skill.id} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.skill_name}</span>
                      <span className="skill-percent">{skill.proficiency}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress" 
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredSkills.length === 0 && (
            <div className="no-results">
              <p>No skills found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Skills;
