import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './ManageProfile.css';

function ManageProfile() {
  const [profile, setProfile] = useState({
    full_name: '',
    title: '',
    bio: '',
    objective: '',
    phone: '',
    email: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', profile);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      await api.post('/profile/upload-image', formData);
      setMessage('Image uploaded successfully');
      fetchProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading image');
    }
  };

  const handleResumeUpload = async (e) => {
    const formData = new FormData();
    formData.append('resume', e.target.files[0]);

    try {
      await api.post('/profile/upload-resume', formData);
      setMessage('Resume uploaded successfully');
      fetchProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading resume');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Profile</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Professional Title</label>
          <input
            type="text"
            name="title"
            value={profile.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            rows="4"
            value={profile.bio}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Career Objective</label>
          <textarea
            name="objective"
            rows="4"
            value={profile.objective}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>GitHub URL</label>
          <input
            type="url"
            name="github_url"
            value={profile.github_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            name="linkedin_url"
            value={profile.linkedin_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Twitter URL</label>
          <input
            type="url"
            name="twitter_url"
            value={profile.twitter_url}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>

      <div className="upload-section">
        <h2>Upload Profile Image</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        
        <h2>Upload Resume</h2>
        <input type="file" accept=".pdf" onChange={handleResumeUpload} />
      </div>
    </div>
  );
}

export default ManageProfile;
