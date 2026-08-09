import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './ManageExperience.css';

function ManageExperience() {
  const [experience, setExperience] = useState([]);
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    responsibilities: '',
    technologies: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await api.get('/experience');
      setExperience(response.data);
    } catch (error) {
      console.error('Error fetching experience:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/experience/${editId}`, formData);
        setMessage('Experience updated successfully');
      } else {
        await api.post('/experience', formData);
        setMessage('Experience added successfully');
      }
      fetchExperience();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving experience');
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      company_name: exp.company_name,
      position: exp.position,
      start_date: exp.start_date ? exp.start_date.split('T')[0] : '',
      end_date: exp.end_date ? exp.end_date.split('T')[0] : '',
      is_current: exp.is_current,
      responsibilities: exp.responsibilities,
      technologies: exp.technologies
    });
    setEditId(exp.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await api.delete(`/experience/${id}`);
        setMessage('Experience deleted successfully');
        fetchExperience();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting experience');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      position: '',
      start_date: '',
      end_date: '',
      is_current: false,
      responsibilities: '',
      technologies: ''
    });
    setEditId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Experience</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
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
              disabled={formData.is_current}
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="is_current"
              checked={formData.is_current}
              onChange={handleChange}
            />
            Currently working here
          </label>
        </div>

        <div className="form-group">
          <label>Responsibilities</label>
          <textarea
            name="responsibilities"
            rows="4"
            value={formData.responsibilities}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Technologies</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Experience' : 'Add Experience'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="data-table">
        <h2>Experience List</h2>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experience.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.company_name}</td>
                <td>{exp.position}</td>
                <td>{exp.is_current ? 'Current' : `${exp.start_date} - ${exp.end_date}`}</td>
                <td>
                  <button onClick={() => handleEdit(exp)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageExperience;
