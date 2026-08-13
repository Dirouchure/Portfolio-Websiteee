import React, { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaFilter, FaSearch, FaTimes, FaCalendar, FaUsers, FaClock, FaEye, FaStar, FaCheckCircle, FaSpinner, FaLightbulb } from 'react-icons/fa';
import api, { BASE_URL } from '../config/api';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, selectedCategory, searchTerm]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
      
      const uniqueCategories = [...new Set(response.data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      setFilteredProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.technologies?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handleViewDetails = async (project) => {
    setSelectedProject(project);
    setShowModal(true);
    try {
      await api.get(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheckCircle />;
      case 'in-progress': return <FaSpinner />;
      case 'planning': return <FaLightbulb />;
      default: return <FaCheckCircle />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-progress';
      case 'planning': return 'status-planning';
      default: return 'status-completed';
    }
  };

  const featuredProjects = filteredProjects.filter(p => p.is_featured);
  const regularProjects = filteredProjects.filter(p => !p.is_featured);

  return (
    <div className="projects">
      <div className="container">
        <h1 className="page-title">My Projects</h1>
        
        {/* Search and Filter */}
        <div className="projects-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects by name, tech, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button 
              className={selectedCategory === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedCategory('all')}
            >
              <FaFilter /> All ({projects.length})
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={selectedCategory === category ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({projects.filter(p => p.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* Projects Count */}
        {searchTerm && (
          <div className="results-info">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        )}

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="featured-section">
            <h2 className="section-title">
              <FaStar /> Featured Projects
            </h2>
            <div className="projects-grid">
              {featuredProjects.map((project) => (
                <div key={project.id} className="project-card featured" onClick={() => handleViewDetails(project)}>
                  {project.image && (
                    <div className="project-image">
                      <img 
                        src={`${BASE_URL}/uploads/${project.image}`} 
                        alt={project.title} 
                      />
                      <div className="project-overlay">
                        <span className="view-details">View Details</span>
                      </div>
                    </div>
                  )}
                  <div className="project-content">
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <span className="featured-badge"><FaStar /> Featured</span>
                    </div>
                    {project.category && <span className="project-category">{project.category}</span>}
                    <p className="project-description">{project.description}</p>
                    
                    {project.status && (
                      <div className={`project-status ${getStatusClass(project.status)}`}>
                        {getStatusIcon(project.status)} {project.status.replace('-', ' ')}
                      </div>
                    )}

                    <div className="project-meta">
                      {project.duration && (
                        <span><FaClock /> {project.duration}</span>
                      )}
                      {project.team_size && (
                        <span><FaUsers /> Team: {project.team_size}</span>
                      )}
                      {project.views > 0 && (
                        <span><FaEye /> {project.views} views</span>
                      )}
                    </div>

                    {project.technologies && (
                      <div className="project-tech">
                        {project.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Projects */}
        {regularProjects.length > 0 && (
          <>
            {featuredProjects.length > 0 && <h2 className="section-title">All Projects</h2>}
            <div className="projects-grid">
              {regularProjects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => handleViewDetails(project)}>
                  {project.image && (
                    <div className="project-image">
                      <img 
                        src={`${BASE_URL}/uploads/${project.image}`} 
                        alt={project.title} 
                      />
                      <div className="project-overlay">
                        <span className="view-details">View Details</span>
                      </div>
                    </div>
                  )}
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    {project.category && <span className="project-category">{project.category}</span>}
                    <p className="project-description">{project.description}</p>
                    
                    {project.status && (
                      <div className={`project-status ${getStatusClass(project.status)}`}>
                        {getStatusIcon(project.status)} {project.status.replace('-', ' ')}
                      </div>
                    )}

                    <div className="project-meta">
                      {project.duration && (
                        <span><FaClock /> {project.duration}</span>
                      )}
                      {project.team_size && (
                        <span><FaUsers /> Team: {project.team_size}</span>
                      )}
                      {project.views > 0 && (
                        <span><FaEye /> {project.views} views</span>
                      )}
                    </div>

                    {project.technologies && (
                      <div className="project-tech">
                        {project.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredProjects.length === 0 && (
          <div className="no-results">
            <p>No projects found matching your criteria</p>
          </div>
        )}

        {/* Project Details Modal */}
        {showModal && selectedProject && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                <FaTimes />
              </button>

              {selectedProject.image && (
                <div className="modal-image">
                  <img 
                    src={`${BASE_URL}/uploads/${selectedProject.image}`} 
                    alt={selectedProject.title} 
                  />
                </div>
              )}

              <div className="modal-body">
                <div className="modal-header">
                  <h2>{selectedProject.title}</h2>
                  {selectedProject.is_featured && (
                    <span className="featured-badge"><FaStar /> Featured</span>
                  )}
                </div>

                {selectedProject.category && (
                  <span className="project-category">{selectedProject.category}</span>
                )}

                {selectedProject.status && (
                  <div className={`project-status ${getStatusClass(selectedProject.status)}`}>
                    {getStatusIcon(selectedProject.status)} {selectedProject.status.replace('-', ' ')}
                  </div>
                )}

                <div className="modal-info-grid">
                  {selectedProject.client_name && (
                    <div className="info-item">
                      <strong>Client:</strong> {selectedProject.client_name}
                    </div>
                  )}
                  {selectedProject.duration && (
                    <div className="info-item">
                      <FaClock /> <strong>Duration:</strong> {selectedProject.duration}
                    </div>
                  )}
                  {selectedProject.team_size && (
                    <div className="info-item">
                      <FaUsers /> <strong>Team Size:</strong> {selectedProject.team_size} members
                    </div>
                  )}
                  {selectedProject.start_date && (
                    <div className="info-item">
                      <FaCalendar /> <strong>Start:</strong> {new Date(selectedProject.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {selectedProject.end_date && (
                    <div className="info-item">
                      <FaCalendar /> <strong>End:</strong> {new Date(selectedProject.end_date).toLocaleDateString()}
                    </div>
                  )}
                  <div className="info-item">
                    <FaEye /> <strong>Views:</strong> {selectedProject.views}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Description</h3>
                  <p>{selectedProject.description}</p>
                </div>

                {selectedProject.highlights && (
                  <div className="modal-section">
                    <h3>Key Highlights</h3>
                    <ul className="highlights-list">
                      {selectedProject.highlights.split(',').map((highlight, idx) => (
                        <li key={idx}><FaCheckCircle /> {highlight.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.technologies && (
                  <div className="modal-section">
                    <h3>Technologies Used</h3>
                    <div className="tech-tags">
                      {selectedProject.technologies.split(',').map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.tags && (
                  <div className="modal-section">
                    <h3>Tags</h3>
                    <div className="project-tags">
                      {selectedProject.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="tag-item">{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-links">
                  {selectedProject.github_url && (
                    <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                      <FaGithub /> View Code
                    </a>
                  )}
                  {selectedProject.live_url && (
                    <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                  {selectedProject.project_url && (
                    <a href={selectedProject.project_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                      <FaExternalLinkAlt /> Project Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
