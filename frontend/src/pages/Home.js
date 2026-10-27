import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGithub, FaLinkedin, FaTwitter, FaTelegram, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaFileDownload, FaArrowRight, FaCopy, FaCode, FaReact, FaNodeJs,
  FaDatabase, FaServer, FaCheckCircle, FaExternalLinkAlt, FaLaptopCode,
  FaRocket, FaStar, FaTrophy, FaLayerGroup, FaCogs, FaCheckDouble,
  FaTerminal
} from 'react-icons/fa';
import api, { getUploadUrl } from '../config/api';
import defaultProfilePic from '../assets/profile.jpg';
import PageMeta from '../components/PageMeta';
import Toast from '../components/Toast';
import TypingEffect from '../components/TypingEffect';
import Testimonials from '../components/Testimonials';
import DeveloperTerminal from '../components/DeveloperTerminal';
import { defaultProfile, defaultProjects, defaultTestimonials } from '../data/defaultData';
import './Home.css';

const DEFAULT_PHONE = '+251940672637';
const DEFAULT_EMAIL = 'dirouchure@gmail.com';
const DEFAULT_LOCATION = 'Haramaya University, Ethiopia';
const DEFAULT_GITHUB = 'https://github.com/Dirouchure';
const DEFAULT_LINKEDIN = 'https://linkedin.com/in/dirouchure';
const DEFAULT_TELEGRAM = 'https://t.me/forall4037';
const DEFAULT_TWITTER = 'https://twitter.com/dirouchure';

const ROLES = [
  'Full Stack Web Developer',
  'Software Engineering Student',
  'React & Node.js Specialist',
  'REST API & Database Architect',
  'Modern UI/UX Engineer'
];

const CORE_STATS = [
  {
    number: '3+',
    label: 'Years of Experience',
    desc: 'Continuous building & learning',
    icon: <FaTrophy />
  },
  {
    number: '15+',
    label: 'Projects Completed',
    desc: 'Web apps, APIs & database systems',
    icon: <FaCode />
  },
  {
    number: '20+',
    label: 'Modern Tech Stacks',
    desc: 'Frontend, backend & tooling',
    icon: <FaLayerGroup />
  },
  {
    number: '100%',
    label: 'Code Commitment',
    desc: 'Clean architecture & reliable delivery',
    icon: <FaStar />
  }
];

const SPECIALIZATIONS = [
  {
    icon: <FaLaptopCode />,
    title: 'Frontend Engineering',
    desc: 'Designing and engineering pixel-perfect, accessible, and responsive user interfaces using React.js, modern CSS, and performance-first architecture.',
    tags: ['React.js', 'JavaScript (ES6+)', 'Responsive UI', 'State Management']
  },
  {
    icon: <FaServer />,
    title: 'Backend & REST APIs',
    desc: 'Developing scalable backend systems, authentication pipelines with JWT, error handling, rate limiting, and clean RESTful API contracts.',
    tags: ['Node.js', 'Express.js', 'JWT Auth', 'REST Architecture']
  },
  {
    icon: <FaDatabase />,
    title: 'Database Architecture',
    desc: 'Architecting robust relational database schemas in MySQL, query optimization, indexing, relationships, and resilient data integrity.',
    tags: ['MySQL', 'Schema Normalization', 'Query Optimization', 'Data Models']
  },
  {
    icon: <FaRocket />,
    title: 'Full Stack Integration',
    desc: 'Bridging client and server smoothly with end-to-end integration, API caching, secure uploads, responsive layouts, and cross-browser support.',
    tags: ['Full Stack', 'API Integration', 'Deployment', 'Git / GitHub']
  }
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Architecture & Modeling',
    desc: 'Analyze user requirements, establish relational MySQL schemas, define clear API contracts, and design clean system architecture.',
    icon: <FaCogs />
  },
  {
    step: '02',
    title: 'Component & UI Engineering',
    desc: 'Build modular, responsive React components styled with modern CSS, guaranteeing fast load times, accessibility, and intuitive UX.',
    icon: <FaLaptopCode />
  },
  {
    step: '03',
    title: 'API & Business Logic',
    desc: 'Implement Express REST APIs, secure JWT authentication, input sanitization, error-handling middleware, and database operations.',
    icon: <FaServer />
  },
  {
    step: '04',
    title: 'Testing & Optimization',
    desc: 'Execute comprehensive end-to-end testing, query optimization, Lighthouse audits, and smooth production deployment.',
    icon: <FaCheckDouble />
  }
];

const TECH_CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

const ALL_TECH = [
  { name: 'React.js', category: 'Frontend', icon: <FaReact style={{ color: '#61dafb' }} /> },
  { name: 'Node.js', category: 'Backend', icon: <FaNodeJs style={{ color: '#68a063' }} /> },
  { name: 'JavaScript (ES6+)', category: 'Frontend', icon: <FaCode style={{ color: '#f7df1e' }} /> },
  { name: 'MySQL', category: 'Database', icon: <FaDatabase style={{ color: '#00758f' }} /> },
  { name: 'Express.js', category: 'Backend', icon: <FaServer style={{ color: '#ffffff' }} /> },
  { name: 'HTML5 & CSS3', category: 'Frontend', icon: <FaLaptopCode style={{ color: '#e34f26' }} /> },
  { name: 'RESTful APIs', category: 'Backend', icon: <FaRocket style={{ color: '#818cf8' }} /> },
  { name: 'Git & GitHub', category: 'Tools', icon: <FaGithub style={{ color: '#f05032' }} /> },
  { name: 'JWT Authentication', category: 'Backend', icon: <FaCheckCircle style={{ color: '#a855f7' }} /> },
  { name: 'Relational Schemas', category: 'Database', icon: <FaDatabase style={{ color: '#38bdf8' }} /> }
];

function Home() {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...defaultProfile,
          ...parsed,
          phone: parsed.phone || DEFAULT_PHONE,
          email: parsed.email || DEFAULT_EMAIL,
          location: parsed.location || DEFAULT_LOCATION,
          github_url: parsed.github_url || DEFAULT_GITHUB,
          linkedin_url: parsed.linkedin_url || DEFAULT_LINKEDIN,
          telegram_url: parsed.telegram_url || DEFAULT_TELEGRAM,
          twitter_url: parsed.twitter_url || DEFAULT_TWITTER,
          profile_image: (parsed.profile_image && parsed.profile_image !== '/images/avatar.svg' && parsed.profile_image !== '/images/profile.jpg') ? parsed.profile_image : defaultProfilePic,
        };
      }
      return defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_projects');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return defaultProjects;
  });

  const [activeTechCategory, setActiveTechCategory] = useState('All');
  const [showTerminal, setShowTerminal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchProjects();
    const handleFocus = () => {
      fetchProfile();
      fetchProjects();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data && Object.keys(response.data).length > 0) {
        // Protect local edits from being overwritten by raw default fallback when DB is offline
        const localCached = localStorage.getItem('portfolio_profile');
        if (response.data._is_default && localCached) {
          return;
        }

        const updated = {
          ...defaultProfile,
          ...response.data,
          phone: response.data.phone || DEFAULT_PHONE,
          email: response.data.email || DEFAULT_EMAIL,
          location: response.data.location || DEFAULT_LOCATION,
          github_url: response.data.github_url || DEFAULT_GITHUB,
          linkedin_url: response.data.linkedin_url || DEFAULT_LINKEDIN,
          twitter_url: response.data.twitter_url || DEFAULT_TWITTER,
          telegram_url: response.data.telegram_url || DEFAULT_TELEGRAM,
        };
        setProfile(updated);
        localStorage.setItem('portfolio_profile', JSON.stringify(updated));
      }
      setImageError(false);
    } catch (err) {
      // Keep existing profile
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setProjects(response.data);
        localStorage.setItem('portfolio_projects', JSON.stringify(response.data));
      }
    } catch (err) {
      // Keep default projects
    }
  };

  const copyEmail = () => {
    const emailToCopy = profile.email || DEFAULT_EMAIL;
    navigator.clipboard.writeText(emailToCopy).then(() => {
      setToastMessage(`✓ Email copied to clipboard: ${emailToCopy}`);
      setTimeout(() => setToastMessage(''), 3500);
    }).catch(() => {
      setToastMessage(`Email: ${emailToCopy}`);
      setTimeout(() => setToastMessage(''), 3500);
    });
  };

  const name = profile.full_name || defaultProfile.full_name || 'Diro Uchure';
  const yearsExp = profile.years_of_experience || defaultProfile.years_of_experience || '3+';
  const phone = profile.phone || defaultProfile.phone || DEFAULT_PHONE;
  const email = profile.email || defaultProfile.email || DEFAULT_EMAIL;
  const location = profile.location || defaultProfile.location || DEFAULT_LOCATION;
  const githubUrl = profile.github_url || defaultProfile.github_url || DEFAULT_GITHUB;
  const linkedinUrl = profile.linkedin_url || defaultProfile.linkedin_url || DEFAULT_LINKEDIN;
  const twitterUrl = profile.twitter_url || defaultProfile.twitter_url || DEFAULT_TWITTER;
  const telegramUrl = profile.telegram_url || defaultProfile.telegram_url || DEFAULT_TELEGRAM;

  const featuredProjects = projects.slice(0, 3);

  const filteredTech = activeTechCategory === 'All' 
    ? ALL_TECH 
    : ALL_TECH.filter(item => item.category === activeTechCategory);

  return (
    <div className="home-page">
      <PageMeta
        title={`${name} | Full Stack Web Developer Portfolio`}
        description={profile.bio || `${name} - Software Engineering Student & Full Stack Web Developer. Modern web applications, scalable backend APIs, and responsive user interfaces.`}
      />

      {/* Hero Ambient Background Orbs */}
      <div className="home-ambient-glow glow-1" aria-hidden="true" />
      <div className="home-ambient-glow glow-2" aria-hidden="true" />

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left Column: Introductions & CTAs */}
          <div className="hero-content">
            <div className="status-badge">
              <span className="status-indicator">
                <span className="status-ping"></span>
                <span className="status-core"></span>
              </span>
              <span>Available for Opportunities & Projects</span>
            </div>

            <div className="hero-greeting">Welcome to my Digital Portfolio</div>

            <h1 className="hero-title">
              Hi, I'm <span className="hero-highlight">{name}</span>
            </h1>

            <div className="hero-role-wrapper">
              <span className="role-prefix">I am a </span>
              <span className="role-text">
                <TypingEffect texts={ROLES} />
              </span>
            </div>

            <p className="hero-description">
              {profile.bio || 'Software Engineering student at Haramaya University with a passion for building modern, scalable web applications. Experienced in full-stack development with React, Node.js, and MySQL. Committed to writing clean code and creating impactful digital solutions.'}
            </p>

            {/* Quick Contact Chips - Guaranteed Always Visible */}
            <div className="hero-contact-chips">
              <a 
                href={`tel:${phone.replace(/\s+/g, '')}`} 
                className="contact-chip chip-clickable phone-chip"
                title={`Call Diro: ${phone}`}
              >
                <FaPhone className="chip-icon phone-icon-color" />
                <span>{phone}</span>
              </a>

              <a 
                href={telegramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-chip chip-clickable telegram-chip"
                title="Message on Telegram"
              >
                <FaTelegram className="chip-icon telegram-icon-color" />
                <span>Telegram: @forall4037</span>
              </a>

              <button 
                type="button" 
                className="contact-chip chip-clickable email-chip" 
                onClick={copyEmail} 
                title="Click to copy email address"
              >
                <FaEnvelope className="chip-icon email-icon-color" />
                <span>{email}</span>
                <FaCopy className="chip-action-icon" />
              </button>

              <div className="contact-chip location-chip" title="Location">
                <FaMapMarkerAlt className="chip-icon location-icon-color" />
                <span>{location}</span>
              </div>
            </div>

            {/* Guaranteed Social Links with Distinct Labeled Badges */}
            <div className="hero-social-block">
              <span className="social-label">Find & Follow Me:</span>
              <div className="hero-social">
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn github-btn" 
                  aria-label="GitHub Profile"
                  title="GitHub: Dirouchure"
                >
                  <FaGithub />
                  <span className="btn-social-label">GitHub</span>
                </a>

                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn linkedin-btn" 
                  aria-label="LinkedIn Profile"
                  title="LinkedIn: Diro Uchure"
                >
                  <FaLinkedin />
                  <span className="btn-social-label">LinkedIn</span>
                </a>

                <a 
                  href={telegramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn telegram-btn" 
                  aria-label="Telegram"
                  title="Telegram: @forall4037"
                >
                  <FaTelegram />
                  <span className="btn-social-label">Telegram</span>
                </a>

                <a 
                  href={twitterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn twitter-btn" 
                  aria-label="Twitter / X Profile"
                  title="Twitter / X: @dirouchure"
                >
                  <FaTwitter />
                  <span className="btn-social-label">Twitter</span>
                </a>

                <a 
                  href={`tel:${phone.replace(/\s+/g, '')}`} 
                  className="social-btn phone-btn"
                  title={`Call: ${phone}`}
                >
                  <FaPhone />
                  <span className="btn-social-label">Call</span>
                </a>

                <button 
                  type="button" 
                  onClick={copyEmail} 
                  className="social-btn email-action-btn" 
                  aria-label="Copy Email"
                  title="Copy Email Address"
                >
                  <FaEnvelope />
                  <span className="btn-social-label">Email</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setShowTerminal(prev => !prev)}
                  className={`social-btn terminal-trigger-btn ${showTerminal ? 'active' : ''}`}
                  aria-label="Toggle Interactive Terminal"
                  title="Open Developer Terminal"
                >
                  <FaTerminal />
                  <span className="btn-social-label">Terminal</span>
                </button>
              </div>
            </div>

            {/* Hero CTA Buttons */}
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-primary">
                View My Projects <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get In Touch
              </Link>
              {profile.resume_file ? (
                <a 
                  href={getUploadUrl(profile.resume_file)} 
                  className="btn btn-outline"
                  download
                >
                  <FaFileDownload /> Download CV
                </a>
              ) : (
                <Link to="/contact" className="btn btn-outline">
                  <FaFileDownload /> Request CV
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Premium Visual Card */}
          <div className="hero-visual">
            <div className="visual-card">
              {/* Floating Tech Pill (Top Left) */}
              <div className="floating-card-pill pill-top">
                <div className="pill-icon-group">
                  <FaReact style={{ color: '#61dafb' }} />
                  <FaNodeJs style={{ color: '#68a063' }} />
                </div>
                <div className="pill-text-group">
                  <span className="pill-title">Full Stack</span>
                  <span className="pill-subtitle">React & Node.js</span>
                </div>
              </div>

              {/* Main Avatar Presentation */}
              <div className="avatar-frame">
                <img 
                  src={!imageError && profile.profile_image ? getUploadUrl(profile.profile_image, profile.updated_at || profile.profile_image) : defaultProfilePic} 
                  alt={name}
                  className="avatar-image"
                  onError={(e) => {
                    setImageError(true);
                    e.currentTarget.src = defaultProfilePic;
                  }}
                />
              </div>

              {/* Direct Quick Connect Links on the Avatar Card */}
              <div className="visual-quick-links">
                <a 
                  href={`tel:${phone.replace(/\s+/g, '')}`} 
                  className="quick-link-chip phone-chip"
                  title="Direct Phone Line"
                >
                  <div className="quick-link-lead">
                    <FaPhone className="lead-icon phone-icon" />
                    <span>{phone}</span>
                  </div>
                  <span className="quick-link-action">Call</span>
                </a>

                <a 
                  href={telegramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="quick-link-chip telegram-chip"
                  title="Telegram Direct Message"
                >
                  <div className="quick-link-lead">
                    <FaTelegram className="lead-icon telegram-icon" />
                    <span>t.me/forall4037</span>
                  </div>
                  <FaExternalLinkAlt className="chip-arrow" />
                </a>

                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="quick-link-chip github-chip"
                  title="GitHub Profile"
                >
                  <div className="quick-link-lead">
                    <FaGithub className="lead-icon github-icon" />
                    <span>github.com/Dirouchure</span>
                  </div>
                  <FaExternalLinkAlt className="chip-arrow" />
                </a>

                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="quick-link-chip linkedin-chip"
                  title="LinkedIn Profile"
                >
                  <div className="quick-link-lead">
                    <FaLinkedin className="lead-icon linkedin-icon" />
                    <span>linkedin.com/in/dirouchure</span>
                  </div>
                  <FaExternalLinkAlt className="chip-arrow" />
                </a>

                <a 
                  href={twitterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="quick-link-chip twitter-chip"
                  title="Twitter / X Profile"
                >
                  <div className="quick-link-lead">
                    <FaTwitter className="lead-icon twitter-icon" />
                    <span>twitter.com/dirouchure</span>
                  </div>
                  <FaExternalLinkAlt className="chip-arrow" />
                </a>
              </div>

              {/* Bottom Verified Badge */}
              <div className="card-status-strip">
                <FaCheckCircle className="strip-check-icon" />
                <span>Software Engineering · Haramaya Univ.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE DEVELOPER TERMINAL DRAWER ================= */}
      {showTerminal && (
        <section className="terminal-drawer-section">
          <div className="section-container">
            <div className="terminal-drawer-header">
              <div className="terminal-tag">
                <FaTerminal /> Interactive Shell
              </div>
              <button 
                type="button" 
                className="terminal-close-btn"
                onClick={() => setShowTerminal(false)}
              >
                ✕ Close Terminal
              </button>
            </div>
            <DeveloperTerminal isOpen={true} />
          </div>
        </section>
      )}

      {/* ================= STATS OVERVIEW ================= */}
      <section className="stats-section">
        <div className="stats-container">
          {CORE_STATS.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
              <div className="stat-info">
                <div className="stat-value">{index === 0 ? yearsExp : stat.number}</div>
                <div className="stat-title">{stat.label}</div>
                <div className="stat-desc">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SPECIALIZATIONS SECTION ================= */}
      <section className="specializations-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">Core Capabilities</span>
            <h2 className="section-title">What I Bring to the Table</h2>
            <p className="section-subtitle">
              Combining academic rigor in Software Engineering with hands-on full stack development skills to build robust web systems.
            </p>
          </div>

          <div className="specializations-grid">
            {SPECIALIZATIONS.map((spec, index) => (
              <div key={index} className="spec-card">
                <div className="spec-icon-box">
                  {spec.icon}
                </div>
                <h3 className="spec-card-title">{spec.title}</h3>
                <p className="spec-card-desc">{spec.desc}</p>
                <div className="spec-tags">
                  {spec.tags.map((tag, tIndex) => (
                    <span key={tIndex} className="spec-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="section-bottom-action">
            <Link to="/services" className="btn btn-secondary">
              View All Services & Solutions <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ENGINEERING WORKFLOW PROCESS ================= */}
      <section className="workflow-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">Development Process</span>
            <h2 className="section-title">How I Build Reliable Digital Products</h2>
            <p className="section-subtitle">
              A structured, transparent engineering methodology focused on clean code, dependable databases, and user-centric design.
            </p>
          </div>

          <div className="workflow-grid">
            {WORKFLOW_STEPS.map((wf, index) => (
              <div key={index} className="workflow-card">
                <div className="workflow-top-bar">
                  <span className="workflow-step-num">{wf.step}</span>
                  <span className="workflow-step-icon">{wf.icon}</span>
                </div>
                <h3 className="workflow-card-title">{wf.title}</h3>
                <p className="workflow-card-desc">{wf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS PREVIEW ================= */}
      <section className="featured-projects-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">Selected Work</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              A glimpse into practical applications engineered with clean code, modern architecture, and real-world utility.
            </p>
          </div>

          <div className="featured-projects-grid">
            {featuredProjects.map((project) => (
              <div key={project.id} className="project-feature-card">
                <div className="project-card-header">
                  <span className="project-badge category-badge">{project.category || 'Web Application'}</span>
                  {project.status && (
                    <span className="project-badge status-badge-pill">
                      {project.status === 'completed' ? 'Completed' : project.status}
                    </span>
                  )}
                </div>

                <h3 className="project-card-title">{project.title}</h3>
                
                <p className="project-card-desc">
                  {project.description || 'Full stack web application engineered with modern technologies and clean component architecture.'}
                </p>

                {project.technologies && (
                  <div className="project-tech-chips">
                    {project.technologies.split(',').map((tech, i) => (
                      <span key={i} className="tech-chip">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="project-card-actions">
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-btn code-btn"
                      title="View GitHub Repository"
                    >
                      <FaGithub /> Source Code
                    </a>
                  )}
                  {project.live_url ? (
                    <a 
                      href={project.live_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-btn live-btn"
                      title="View Live Demo"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  ) : (
                    <Link to="/projects" className="project-btn live-btn">
                      Explore Details <FaArrowRight />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="section-bottom-action">
            <Link to="/projects" className="btn btn-primary">
              Explore All Projects <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE TECH STACK SECTION ================= */}
      <section className="tech-stack-section">
        <div className="section-container">
          <div className="tech-stack-header">
            <span className="section-kicker">Technical Arsenal</span>
            <h3 className="tech-stack-title">Technologies & Tools</h3>
            <p className="tech-stack-sub">Core technologies I leverage daily to build scalable web applications</p>
            
            {/* Category Filter Pills */}
            <div className="tech-filter-pills">
              {TECH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`tech-filter-btn ${activeTechCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveTechCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="tech-badges-grid">
            {filteredTech.map((tech, index) => (
              <div key={index} className="tech-badge-card">
                <span className="tech-badge-icon">{tech.icon}</span>
                <span className="tech-badge-name">{tech.name}</span>
                <span className="tech-badge-cat">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CLIENT & COLLABORATOR ENDORSEMENTS ================= */}
      <Testimonials testimonials={defaultTestimonials} />

      {/* ================= CALL TO ACTION (CTA) ================= */}
      <section className="home-cta-section">
        <div className="section-container">
          <div className="cta-banner">
            <div className="cta-content">
              <span className="cta-pill">Ready to Collaborate?</span>
              <h2 className="cta-title">Let's Build Something Exceptional Together</h2>
              <p className="cta-description">
                Whether you have an upcoming project, an internship opportunity, or require a dedicated full-stack developer, I'm always open to discussing impactful ideas.
              </p>
              
              {/* Quick direct contact & social buttons inside CTA */}
              <div className="cta-social-group">
                <a 
                  href={`tel:${phone.replace(/\s+/g, '')}`} 
                  className="cta-social-link phone-cta"
                  title={`Call: ${phone}`}
                >
                  <FaPhone /> {phone}
                </a>
                <a 
                  href={telegramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-social-link telegram-cta"
                  title="Telegram Channel"
                >
                  <FaTelegram /> Telegram (@forall4037)
                </a>
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-social-link github-cta"
                  title="GitHub Profile"
                >
                  <FaGithub /> GitHub
                </a>
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-social-link linkedin-cta"
                  title="LinkedIn Profile"
                >
                  <FaLinkedin /> LinkedIn
                </a>
                <a 
                  href={twitterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-social-link twitter-cta"
                  title="Twitter / X Profile"
                >
                  <FaTwitter /> Twitter
                </a>
              </div>

              <div className="cta-buttons">
                <Link to="/contact" className="btn btn-primary">
                  Start a Conversation <FaArrowRight />
                </Link>
                <Link to="/about" className="btn btn-secondary">
                  Learn More About Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Toast Notification */}
      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />
    </div>
  );
}

export default Home;
