import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './ManageEducation.css';

function ManageEducation() {
  const [education, setEducation] = useState([]);
  const [formData, setFormData] = useState({
    school_name: '',
    degree: '',
    department: '',
    start_year: '',
    end_year: '',
    description: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await api.get('/education');
      setEducation(response.data);
    } catch (error) {
      console.error('Error fetching education:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/education/${editId}`, formData);
        setMessage('Education updated successfully');
      } else {
        await api.post('/education', formData);
        setMessage('Education added successfully');
      }
      fetchEducation();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving education');
    }
  };

  const handleEdit = (edu) => {
    setFormData({
      school_name: edu.school_name,
      degree: edu.degree,
      department: edu.department,
      start_year: edu.start_year,
      end_year: edu.end_year,
      description: edu.description
    });
    setEditId(edu.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      try {
        await api.delete(`/education/${id}`);
        setMessage('Education deleted successfully');
        fetchEducation();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting education');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      school_name: '',
      degree: '',
      department: '',
      start_year: '',
      end_year: '',
      description: ''
    });
    setEditId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Education</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>School Name</label>
          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Degree</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department/Field</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Year</label>
            <input
              type="number"
              name="start_year"
              value={formData.start_year}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Year</label>
            <input
              type="number"
              name="end_year"
              value={formData.end_year}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Education' : 'Add Education'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="data-table">
        <h2>Education List</h2>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Degree</th>
              <th>Years</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {education.map((edu) => (
              <tr key={edu.id}>
                <td>{edu.school_name}</td>
                <td>{edu.degree}</td>
                <td>{edu.start_year} - {edu.end_year}</td>
                <td>
                  <button onClick={() => handleEdit(edu)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(edu.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageEducation;
