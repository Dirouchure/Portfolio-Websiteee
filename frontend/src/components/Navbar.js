import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaCode, FaBars, FaTimes } from 'react-icons/fa';
import api from '../config/api';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteName, setSiteName] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.full_name) return parsed.full_name;
      }
    } catch {
      // ignore
    }
    return 'Diro Uchure';
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/profile')
      .then((response) => {
        if (response.data?.full_name) {
          setSiteName(response.data.full_name);
        }
      })
      .catch(() => {});
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <div className="logo-badge">
            <FaCode />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">{siteName}</span>
            <span className="logo-subtitle">Full Stack Dev</span>
          </div>
        </Link>

        <div className="menu-icon" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Services
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/projects" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Projects
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/skills" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Skills
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/experience" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Experience
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/education" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Education
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/certificates" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Certificates
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
