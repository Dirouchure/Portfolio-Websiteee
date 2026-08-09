import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-user">
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/admin/profile" className="dashboard-card">
          <h3>Manage Profile</h3>
          <p>Update personal information</p>
        </Link>

        <Link to="/admin/skills" className="dashboard-card">
          <h3>Manage Skills</h3>
          <p>Add, edit, or remove skills</p>
        </Link>

        <Link to="/admin/projects" className="dashboard-card">
          <h3>Manage Projects</h3>
          <p>Add, edit, or remove projects</p>
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

        <Link to="/admin/video-reel" className="dashboard-card">
          <h3>Manage Video Reel</h3>
          <p>Add, edit, or remove videos</p>
        </Link>

        <Link to="/admin/services" className="dashboard-card">
          <h3>Manage Services</h3>
          <p>Add, edit, or remove services</p>
        </Link>

        <Link to="/admin/messages" className="dashboard-card">
          <h3>View Messages</h3>
          <p>Check contact form submissions</p>
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
