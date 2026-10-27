import React, { useState, useEffect } from 'react';
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaNode, FaDatabase, FaGitAlt, FaNpm, FaBootstrap, FaPython, FaPhp, FaDocker, FaAws } from 'react-icons/fa';
import { SiMysql, SiMongodb, SiExpress, SiTypescript, SiRedux, SiTailwindcss, SiPostgresql, SiFirebase, SiGithub, SiVisualstudiocode } from 'react-icons/si';
import api from '../config/api';
import PageMeta from '../components/PageMeta';
import { defaultSkills } from '../data/defaultData';
import './Skills.css';

// Skill icon mapping
const skillIcons = {
  'react': <FaReact />,
  'react.js': <FaReact />,
  'reactjs': <FaReact />,
  'html': <FaHtml5 />,
  'html5': <FaHtml5 />,
  'css': <FaCss3Alt />,
  'css3': <FaCss3Alt />,
  'javascript': <FaJs />,
  'js': <FaJs />,
  'node': <FaNode />,
  'node.js': <FaNode />,
  'nodejs': <FaNode />,
  'mysql': <SiMysql />,
  'mongodb': <SiMongodb />,
  'database': <FaDatabase />,
  'git': <FaGitAlt />,
  'github': <SiGithub />,
  'npm': <FaNpm />,
  'bootstrap': <FaBootstrap />,
  'express': <SiExpress />,
  'express.js': <SiExpress />,
  'typescript': <SiTypescript />,
  'redux': <SiRedux />,
  'tailwind': <SiTailwindcss />,
  'tailwindcss': <SiTailwindcss />,
  'postgresql': <SiPostgresql />,
  'postgres': <SiPostgresql />,
  'firebase': <SiFirebase />,
  'python': <FaPython />,
  'php': <FaPhp />,
  'docker': <FaDocker />,
  'aws': <FaAws />,
  'vscode': <SiVisualstudiocode />,
};

// Get icon for skill
const getSkillIcon = (skillName) => {
  const name = (skillName || '').toLowerCase().trim();
  return skillIcons[name] || <FaDatabase />;
};

// Get color for skill
const getSkillColor = (skillName) => {
  const name = (skillName || '').toLowerCase().trim();
  const colors = {
    'react': '#61DAFB',
    'react.js': '#61DAFB',
    'reactjs': '#61DAFB',
    'html': '#E34F26',
    'html5': '#E34F26',
    'css': '#1572B6',
    'css3': '#1572B6',
    'javascript': '#F7DF1E',
    'js': '#F7DF1E',
    'node': '#339933',
    'node.js': '#339933',
    'nodejs': '#339933',
    'mysql': '#4479A1',
    'mongodb': '#47A248',
    'git': '#F05032',
    'github': '#181717',
    'npm': '#CB3837',
    'bootstrap': '#7952B3',
    'express': '#000000',
    'express.js': '#000000',
    'typescript': '#3178C6',
    'redux': '#764ABC',
    'tailwind': '#06B6D4',
    'tailwindcss': '#06B6D4',
    'postgresql': '#4169E1',
    'firebase': '#FFCA28',
    'python': '#3776AB',
    'php': '#777BB4',
    'docker': '#2496ED',
    'aws': '#FF9900',
    'vscode': '#007ACC',
  };
  return colors[name] || '#667eea';
};

function Skills() {
  const [skills, setSkills] = useState(() => defaultSkills);
  const [categories, setCategories] = useState(() => [
    ...new Set(defaultSkills.map((skill) => skill.category))
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setSkills(response.data);
        const uniqueCategories = [...new Set(response.data.map((skill) => skill.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.log('Using default skills (backend offline or loading)');
    }
  };

  const getSkillsByCategory = (category) => {
    return skills.filter(skill => skill.category === category);
  };

  const getFilteredSkills = () => {
    if (selectedCategory !== 'all') {
      return skills.filter(skill => skill.category === selectedCategory);
    }
    return skills;
  };

  const filteredSkills = getFilteredSkills();

  return (
    <div className="skills-page">
      <PageMeta
        title="Technical Skills & Proficiencies | Diro Uchure"
        description="Comprehensive technical skills, programming languages, backend frameworks, and databases mastered by Diro Uchure."
      />
      <div className="container">
        <div className="skills-header">
          <h1 className="page-title">Technical Skills</h1>
          <p className="page-subtitle">Technologies and tools I work with</p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button 
            className={selectedCategory === 'all' ? 'category-btn active' : 'category-btn'}
            onClick={() => setSelectedCategory('all')}
          >
            All Skills
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {selectedCategory === 'all' ? (
          // Show by categories
          categories.map((category, catIndex) => (
            <div key={catIndex} className="skill-section">
              <h2 className="section-title">{category}</h2>
              <div className="skills-grid">
                {getSkillsByCategory(category).map((skill) => (
                  <div 
                    key={skill.id} 
                    className="skill-card"
                    style={{ '--skill-color': getSkillColor(skill.skill_name) }}
                  >
                    <div className="skill-icon">
                      {getSkillIcon(skill.skill_name)}
                    </div>
                    <div className="skill-details">
                      <h3 className="skill-name">{skill.skill_name}</h3>
                      <div className="skill-progress-wrapper">
                        <div className="skill-progress-bar">
                          <div 
                            className="skill-progress-fill" 
                            style={{ 
                              width: `${skill.proficiency}%`,
                              background: getSkillColor(skill.skill_name)
                            }}
                          >
                            <span className="progress-tooltip">{skill.proficiency}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show filtered category
          <div className="skill-section">
            <h2 className="section-title">{selectedCategory}</h2>
            <div className="skills-grid">
              {filteredSkills.map((skill) => (
                <div 
                  key={skill.id} 
                  className="skill-card"
                  style={{ '--skill-color': getSkillColor(skill.skill_name) }}
                >
                  <div className="skill-icon">
                    {getSkillIcon(skill.skill_name)}
                  </div>
                  <div className="skill-details">
                    <h3 className="skill-name">{skill.skill_name}</h3>
                    <div className="skill-progress-wrapper">
                      <div className="skill-progress-bar">
                        <div 
                          className="skill-progress-fill" 
                          style={{ 
                            width: `${skill.proficiency}%`,
                            background: getSkillColor(skill.skill_name)
                          }}
                        >
                          <span className="progress-tooltip">{skill.proficiency}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredSkills.length === 0 && (
          <div className="no-skills">
            <p>No skills found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Skills;
