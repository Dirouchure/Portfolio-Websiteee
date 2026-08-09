import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './ManageCertificates.css';

function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    issue_date: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/certificates');
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
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
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editId) {
        await api.put(`/certificates/${editId}`, data);
        setMessage('Certificate updated successfully');
      } else {
        await api.post('/certificates', data);
        setMessage('Certificate added successfully');
      }
      fetchCertificates();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving certificate');
    }
  };

  const handleEdit = (cert) => {
    setFormData({
      title: cert.title,
      organization: cert.organization,
      issue_date: cert.issue_date ? cert.issue_date.split('T')[0] : ''
    });
    setEditId(cert.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await api.delete(`/certificates/${id}`);
        setMessage('Certificate deleted successfully');
        fetchCertificates();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting certificate');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      organization: '',
      issue_date: ''
    });
    setImageFile(null);
    setEditId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Certificates</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Certificate Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Organization</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Issue Date</label>
          <input
            type="date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Certificate Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Certificate' : 'Add Certificate'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="data-table">
        <h2>Certificates List</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Organization</th>
              <th>Issue Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.title}</td>
                <td>{cert.organization}</td>
                <td>{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : ''}</td>
                <td>
                  <button onClick={() => handleEdit(cert)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(cert.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCertificates;
