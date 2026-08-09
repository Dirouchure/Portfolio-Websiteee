import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../../config/api';
import './ManageVideoReel.css';

function ManageVideoReel() {
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    video_type: 'youtube',
    category: '',
    duration: '',
    is_featured: false
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/video-reel');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/video-reel/${editingId}`, formData);
        alert('Video updated successfully!');
      } else {
        await api.post('/video-reel', formData);
        alert('Video added successfully!');
      }
      resetForm();
      fetchVideos();
    } catch (error) {
      alert('Error saving video: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      video_type: video.video_type,
      category: video.category || '',
      duration: video.duration || '',
      is_featured: video.is_featured
    });
    setEditingId(video.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`/video-reel/${id}`);
        alert('Video deleted successfully!');
        fetchVideos();
      } catch (error) {
        alert('Error deleting video: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      video_type: 'youtube',
      category: '',
      duration: '',
      is_featured: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getVideoEmbed = (video) => {
    if (video.video_type === 'youtube') {
      const videoId = video.video_url.includes('youtube.com') 
        ? new URL(video.video_url).searchParams.get('v')
        : video.video_url;
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (video.video_type === 'vimeo') {
      const videoId = video.video_url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return video.video_url;
  };

  return (
    <div className="manage-video-reel">
      <div className="page-header">
        <h1>Manage Video Reel</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? 'Cancel' : 'Add Video'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Video' : 'Add New Video'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <label>Video Type *</label>
                <select
                  value={formData.video_type}
                  onChange={(e) => setFormData({ ...formData, video_type: e.target.value })}
                  required
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Video URL * (YouTube ID or full URL)</label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="e.g., dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Wedding, Corporate, Music Video"
                />
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3:45"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                Featured Video
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add'} Video
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <iframe
                src={getVideoEmbed(video)}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {video.is_featured && <span className="featured-label">Featured</span>}
            </div>
            <div className="video-card-content">
              <h3>{video.title}</h3>
              <div className="video-meta">
                {video.category && <span>Category: {video.category}</span>}
                {video.duration && <span>Duration: {video.duration}</span>}
                <span>Views: {video.views}</span>
              </div>
              <div className="video-actions">
                <button className="btn-edit" onClick={() => handleEdit(video)}>
                  <FaEdit /> Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(video.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="no-data">No videos found. Add your first video!</div>
        )}
      </div>
    </div>
  );
}

export default ManageVideoReel;
