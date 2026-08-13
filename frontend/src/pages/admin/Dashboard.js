import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaProjectDiagram, FaEnvelope, FaGraduationCap, FaBriefcase,
  FaAward, FaConciergeBell, FaCode
} from 'react-icons/fa';
import api from '../../config/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats')
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const statCards = stats ? [
    { label: 'Projects', value: stats.projects, icon: FaProjectDiagram, color: '#3498db' },
    { label: 'Skills', value: stats.skills, icon: FaCode, color: '#9b59b6' },
    { label: 'Messages', value: stats.messages, icon: FaEnvelope, color: '#e74c3c', badge: stats.unread_messages },
    { label: 'Certificates', value: stats.certificates, icon: FaAward, color: '#f39c12' },
    { label: 'Experience', value: stats.experience, icon: FaBriefcase, color: '#1abc9c' },
    { label: 'Education', value: stats.education, icon: FaGraduationCap, color: '#34495e' },
    { label: 'Services', value: stats.services, icon: FaConciergeBell, color: '#6366f1' },
  ] : [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage your portfolio content</p>
        </div>
        <div className="dashboard-user">
          <span>Welcome, {user.username}</span>
          <Link to="/admin/change-password" className="btn btn-outline btn-sm">Change Password</Link>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          {statCards.map(({ label, value, icon: Icon, color, badge }) => (
            <div key={label} className="stat-card" style={{ borderTopColor: color }}>
              <div className="stat-icon" style={{ color }}>
                <Icon />
              </div>
              <div className="stat-info">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
              {badge > 0 && <span className="stat-badge">{badge} new</span>}
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-grid">
        <Link to="/admin/profile" className="dashboard-card">
          <h3>Manage Profile</h3>
          <p>Update personal information</p>
        </Link>

        <Link to="/admin/projects" className="dashboard-card">
          <h3>Manage Projects</h3>
          <p>Add, edit, or remove projects</p>
        </Link>

        <Link to="/admin/skills" className="dashboard-card">
          <h3>Manage Skills</h3>
          <p>Add, edit, or remove skills</p>
        </Link>

        <Link to="/admin/messages" className="dashboard-card">
          <h3>View Messages</h3>
          <p>Check contact form submissions</p>
        </Link>

        <Link to="/admin/education" className="dashboard-card">
          <h3>Manage Education</h3>
          <p>Add, edit, or remove education</p>
        </Link>

        <Link to="/admin/experience" className="dashboard-card">
          <h3>Manage Experience</h3>
          <p>Add, edit, or remove experience</p>
        </Link>

        <Link to="/admin/certificates" className="dashboard-card">
          <h3>Manage Certificates</h3>
          <p>Add, edit, or remove certificates</p>
        </Link>

        <Link to="/admin/services" className="dashboard-card">
          <h3>Manage Services</h3>
          <p>Add, edit, or remove services</p>
        </Link>

        <Link to="/admin/change-password" className="dashboard-card dashboard-card-highlight">
          <h3>Change Password</h3>
          <p>Update your admin credentials</p>
        </Link>

        <Link to="/" className="dashboard-card">
          <h3>View Website</h3>
          <p>Visit public portfolio</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
