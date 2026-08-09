import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaVideo, FaPalette, FaMagic, FaMusic } from 'react-icons/fa';
import api from '../../config/api';
import './ManageServices.css';

function ManageServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    icon: 'video',
    price: '',
    duration: '',
    features: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
        alert('Service updated successfully!');
      } else {
        await api.post('/services', formData);
        alert('Service added successfully!');
      }
      resetForm();
      fetchServices();
    } catch (error) {
      alert('Error saving service: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (service) => {
    setFormData({
      service_name: service.service_name,
      description: service.description || '',
      icon: service.icon || 'video',
      price: service.price || '',
      duration: service.duration || '',
      features: service.features || '',
      is_active: service.is_active,
      display_order: service.display_order || 0
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        alert('Service deleted successfully!');
        fetchServices();
      } catch (error) {
        alert('Error deleting service: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      description: '',
      icon: 'video',
      price: '',
      duration: '',
      features: '',
      is_active: true,
      display_order: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getIcon = (iconName) => {
    const icons = {
      video: <FaVideo />,
      palette: <FaPalette />,
      magic: <FaMagic />,
      music: <FaMusic />
    };
    return icons[iconName] || <FaVideo />;
  };

  return (
    <div className="manage-services">
      <div className="page-header">
        <h1>Manage Services</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Service' : 'Add New Service'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Name *</label>
              <input
                type="text"
                value={formData.service_name}
                onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  <option value="video">Video</option>
                  <option value="palette">Palette</option>
                  <option value="magic">Magic</option>
                  <option value="music">Music</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., $299/video"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Delivery Time</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3-5 days"
                />
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Features (comma-separated)</label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows="3"
                placeholder="e.g., Color grading, Sound design, Motion graphics"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add'} Service
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="services-list">
        {services.map((service) => (
          <div key={service.id} className={`service-item ${!service.is_active ? 'inactive' : ''}`}>
            <div className="service-icon">
              {getIcon(service.icon)}
            </div>
            <div className="service-content">
              <div className="service-header">
                <h3>{service.service_name}</h3>
                <div className="badges">
                  {!service.is_active && <span className="badge-inactive">Inactive</span>}
                  <span className="badge-order">Order: {service.display_order}</span>
                </div>
              </div>
              {service.description && <p className="description">{service.description}</p>}
              <div className="service-details">
                {service.price && <span><strong>Price:</strong> {service.price}</span>}
                {service.duration && <span><strong>Delivery:</strong> {service.duration}</span>}
              </div>
              {service.features && (
                <div className="features">
                  <strong>Features:</strong> {service.features}
                </div>
              )}
            </div>
            <div className="service-actions">
              <button className="btn-edit" onClick={() => handleEdit(service)}>
                <FaEdit /> Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(service.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="no-data">No services found. Add your first service!</div>
        )}
      </div>
    </div>
  );
}

export default ManageServices;
