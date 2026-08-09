import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './ManageSkills.css';

function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    skill_name: '',
    category: '',
    proficiency: 50
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
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
        await api.put(`/skills/${editId}`, formData);
        setMessage('Skill updated successfully');
      } else {
        await api.post('/skills', formData);
        setMessage('Skill added successfully');
      }
      fetchSkills();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving skill');
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      skill_name: skill.skill_name,
      category: skill.category,
      proficiency: skill.proficiency
    });
    setEditId(skill.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${id}`);
        setMessage('Skill deleted successfully');
        fetchSkills();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting skill');
      }
    }
  };

  const resetForm = () => {
    setFormData({ skill_name: '', category: '', proficiency: 50 });
    setEditId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Skills</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Skill Name</label>
          <input
            type="text"
            name="skill_name"
            value={formData.skill_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Programming Languages, Frameworks"
          />
        </div>

        <div className="form-group">
          <label>Proficiency: {formData.proficiency}%</label>
          <input
            type="range"
            name="proficiency"
            min="0"
            max="100"
            value={formData.proficiency}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Skill' : 'Add Skill'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="data-table">
        <h2>Skills List</h2>
        <table>
          <thead>
            <tr>
              <th>Skill Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.skill_name}</td>
                <td>{skill.category}</td>
                <td>{skill.proficiency}%</td>
                <td>
                  <button onClick={() => handleEdit(skill)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(skill.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageSkills;
