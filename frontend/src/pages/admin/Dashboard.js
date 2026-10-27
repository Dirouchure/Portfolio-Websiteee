import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaProjectDiagram, FaEnvelope, FaGraduationCap,
  FaAward, FaCode, FaBriefcase, FaConciergeBell
} from 'react-icons/fa';
import api from '../../config/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"username":"admin"}');
  const [stats, setStats] = useState({
    projects: 2,
    services: 3,
    experience: 2,
    skills: 8,
    messages: 0,
    unread_messages: 0,
    certificates: 1,
    education: 1
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    let localTotal = 0;
    let localUnread = 0;
    try {
      const localMsgs = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
      localTotal = localMsgs.length;
      localUnread = localMsgs.filter(m => !m.is_read).length;
    } catch (e) {}

    api.get('/stats')
      .then((res) => {
        if (res.data) {
          const serverMsgs = Number(res.data.messages || 0);
          const serverUnread = Number(res.data.unread_messages || 0);
          setStats({
            ...res.data,
            messages: Math.max(serverMsgs, localTotal),
            unread_messages: Math.max(serverUnread, localUnread)
          });
        }
      })
      .catch(() => {
        setStats(prev => ({
          ...prev,
          messages: localTotal,
          unread_messages: localUnread
        }));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const statCards = stats ? [
    { label: 'Projects', value: stats.projects, icon: FaProjectDiagram, color: '#3498db' },
    { label: 'Services', value: stats.services, icon: FaConciergeBell, color: '#10b981' },
    { label: 'Experience', value: stats.experience, icon: FaBriefcase, color: '#6366f1' },
    { label: 'Skills', value: stats.skills, icon: FaCode, color: '#9b59b6' },
    { label: 'Messages', value: stats.messages, icon: FaEnvelope, color: '#e74c3c', badge: stats.unread_messages },
    { label: 'Certificates', value: stats.certificates, icon: FaAward, color: '#f39c12' },
    { label: 'Education', value: stats.education, icon: FaGraduationCap, color: '#34495e' },
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
                <div className="stat-value">{value ?? 0}</div>
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

        <Link to="/admin/services" className="dashboard-card">
          <h3>Manage Services</h3>
          <p>Add, edit, or remove services</p>
        </Link>

        <Link to="/admin/projects" className="dashboard-card">
          <h3>Manage Projects</h3>
          <p>Add, edit, or remove projects</p>
        </Link>

        <Link to="/admin/skills" className="dashboard-card">
          <h3>Manage Skills</h3>
          <p>Add, edit, or remove skills</p>
        </Link>

        <Link to="/admin/messages" className="dashboard-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>View Messages</h3>
            {stats.unread_messages > 0 && (
              <span className="stat-badge" style={{ position: 'static', margin: 0, padding: '0.2rem 0.55rem', fontSize: '0.75rem', borderRadius: '12px' }}>
                {stats.unread_messages} new
              </span>
            )}
          </div>
          <p>{stats.messages > 0 ? `${stats.messages} message${stats.messages > 1 ? 's' : ''} received` : 'Check contact form submissions'}</p>
        </Link>

        <Link to="/admin/education" className="dashboard-card">
          <h3>Manage Education</h3>
          <p>Add, edit, or remove education</p>
        </Link>

        <Link to="/admin/certificates" className="dashboard-card">
          <h3>Manage Certificates</h3>
          <p>Add, edit, or remove certificates</p>
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
