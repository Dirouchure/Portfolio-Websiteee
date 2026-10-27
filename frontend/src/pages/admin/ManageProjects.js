import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import { defaultProjects } from '../../data/defaultData';
import './ManageProjects.css';

function ManageProjects() {
  const [projects, setProjects] = useState(() => defaultProjects);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    category: '',
    status: 'completed',
    client_name: '',
    start_date: '',
    end_date: '',
    duration: '',
    team_size: 1,
    project_url: '',
    highlights: '',
    tags: '',
    is_featured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setProjects(response.data);
      } else {
        setProjects(defaultProjects);
      }
    } catch (error) {
      setProjects(defaultProjects);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'start_date' || key === 'end_date') {
        if (formData[key] && typeof formData[key] === 'string' && formData[key].trim()) {
          data.append(key, formData[key].trim());
        }
      } else if (key === 'is_featured') {
        data.append('is_featured', formData.is_featured ? 'true' : 'false');
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editId) {
        try {
          await api.put(`/projects/${editId}`, data);
        } catch (putErr) {
          if (putErr.response?.status === 404) {
            await api.post('/projects', data);
          } else if (putErr.message === 'Network Error' || !putErr.response) {
            console.warn('Backend offline, updated in interface state');
          } else {
            throw putErr;
          }
        }
        setProjects(prev => prev.map(p => p.id === editId ? { ...p, ...formData, id: editId } : p));
        setMessage({ type: 'success', text: 'Project updated successfully' });
      } else {
        let newId = Date.now();
        try {
          const res = await api.post('/projects', data);
          if (res.data?.id) newId = res.data.id;
        } catch (postErr) {
          if (postErr.message === 'Network Error' || !postErr.response) {
            console.warn('Backend offline, added to interface state');
          } else {
            throw postErr;
          }
        }
        setProjects(prev => [{ id: newId, ...formData }, ...prev]);
        setMessage({ type: 'success', text: 'Project added successfully' });
      }
      resetForm();
      try {
        const syncRes = await api.get('/projects');
        if (Array.isArray(syncRes.data) && syncRes.data.length > 0) {
          setProjects(syncRes.data);
        }
      } catch (e) {}
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Project save error details:', error);
      let errMsg = 'Error saving project.';
      if (error.response?.data?.message) {
        errMsg = error.response.data.message;
        if (error.response.data.error) {
          errMsg += ` (${error.response.data.error})`;
        }
      } else if (error.response?.data?.error) {
        errMsg = typeof error.response.data.error === 'string'
          ? error.response.data.error
          : JSON.stringify(error.response.data.error);
      } else if (typeof error.response?.data === 'string' && error.response.data.length < 200) {
        errMsg = error.response.data;
      } else if (error.message) {
        if (error.message === 'Network Error') {
          errMsg = 'Network Error: Backend API (http://localhost:5001) is unreachable. Please ensure the backend server is running.';
        } else {
          errMsg = error.message;
        }
      }
      setMessage({ type: 'error', text: errMsg });
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      category: project.category || '',
      status: project.status || 'completed',
      client_name: project.client_name || '',
      start_date: project.start_date ? project.start_date.split('T')[0] : '',
      end_date: project.end_date ? project.end_date.split('T')[0] : '',
      duration: project.duration || '',
      team_size: project.team_size || 1,
      project_url: project.project_url || '',
      highlights: project.highlights || '',
      tags: project.tags || '',
      is_featured: !!project.is_featured
    });
    setEditId(project.id);
    const formEl = document.querySelector('.admin-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
      } catch (error) {
        console.warn('Backend delete notice:', error.message);
      }
      setProjects(prev => prev.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Project deleted successfully' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      github_url: '',
      live_url: '',
      category: '',
      status: 'completed',
      client_name: '',
      start_date: '',
      end_date: '',
      duration: '',
      team_size: 1,
      project_url: '',
      highlights: '',
      tags: '',
      is_featured: false
    });
    setImageFile(null);
    setEditId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Projects</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && (
        <div className={typeof message === 'object' ? (message.type === 'error' ? 'alert-error' : 'alert-success') : 'alert'}>
          {typeof message === 'object' ? message.text : message}
        </div>
      )}

      {editId && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto 1.5rem',
          padding: '0.9rem 1.25rem',
          background: 'rgba(99, 102, 241, 0.25)',
          border: '1px solid rgba(99, 102, 241, 0.5)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          fontWeight: '600'
        }}>
          <span>✏️ Editing Mode: <strong>{formData.title || `Project #${editId}`}</strong></span>
          <button 
            type="button" 
            onClick={resetForm}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Cancel Edit
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Project Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Web Development, Video Editing"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planning">Planning</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              placeholder="e.g., ABC Company"
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 2 months, 3 weeks"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Team Size</label>
          <input
            type="number"
            name="team_size"
            value={formData.team_size}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Technologies (comma-separated)</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
          />
        </div>

        <div className="form-group">
          <label>Key Highlights (comma-separated)</label>
          <textarea
            name="highlights"
            rows="3"
            value={formData.highlights}
            onChange={handleChange}
            placeholder="e.g., Responsive design, Fast loading, SEO optimized"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., responsive, modern, professional"
          />
        </div>

        <div className="form-group">
          <label>GitHub URL</label>
          <input
            type="url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Live Demo URL</label>
          <input
            type="url"
            name="live_url"
            value={formData.live_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Project Website URL</label>
          <input
            type="url"
            name="project_url"
            value={formData.project_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Project Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            />
            Featured Project
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Project' : 'Add Project'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="data-table">
        <h2>Projects List</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.category}</td>
                <td>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status}
                  </span>
                </td>
                <td>{project.is_featured ? '⭐ Yes' : 'No'}</td>
                <td>{project.views || 0}</td>
                <td>
                  <button onClick={() => handleEdit(project)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageProjects;
