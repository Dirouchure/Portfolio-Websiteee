import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getUploadUrl } from '../../config/api';
import './ManageProfile.css';

const EMPTY_PROFILE = {
  full_name: '',
  title: '',
  bio: '',
  objective: '',
  phone: '',
  email: '',
  location: '',
  github_url: '',
  linkedin_url: '',
  twitter_url: '',
  profile_image: '',
  resume_file: '',
  updated_at: null,
};

const normalizeProfile = (data = {}) => ({
  ...EMPTY_PROFILE,
  ...Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value ?? ''])
  ),
});

function ManageProfile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const getErrorMessage = (error, fallback) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401 || status === 403) {
      return 'Session expired. Please log out and log in again.';
    }

    return serverMessage || fallback;
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(normalizeProfile(response.data));
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('Could not load profile data.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      full_name: profile.full_name,
      title: profile.title,
      bio: profile.bio,
      objective: profile.objective,
      phone: profile.phone,
      email: profile.email,
      location: profile.location,
      github_url: profile.github_url,
      linkedin_url: profile.linkedin_url,
      twitter_url: profile.twitter_url,
    };

    try {
      const response = await api.put('/profile', payload);
      if (response.data?.profile) {
        setProfile(normalizeProfile(response.data.profile));
      } else {
        await fetchProfile();
      }
      showMessage('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage(getErrorMessage(error, 'Error updating profile'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await api.post('/profile/upload-image', formData);
      await fetchProfile();
      showMessage('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage(getErrorMessage(error, 'Error uploading image'), 'error');
    } finally {
      e.target.value = '';
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/profile/upload-resume', formData);
      await fetchProfile();
      showMessage('Resume uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading resume:', error);
      showMessage(getErrorMessage(error, 'Error uploading resume'), 'error');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Profile</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && <div className={`alert ${messageType === 'error' ? 'alert-error' : 'alert-success'}`}>{message}</div>}

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

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>

      <div className="upload-section">
        <h2>Upload Profile Image</h2>
        {profile.profile_image && (
          <div className="current-upload-preview">
            <img
              src={`${getUploadUrl(profile.profile_image)}?v=${encodeURIComponent(profile.updated_at || profile.profile_image)}`}
              alt="Current profile"
              style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '1rem' }}
            />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        
        <h2>Upload Resume</h2>
        {profile.resume_file && (
          <p>
            Current resume:{' '}
            <a href={getUploadUrl(profile.resume_file)} target="_blank" rel="noopener noreferrer">
              View file
            </a>
          </p>
        )}
        <input type="file" accept=".pdf" onChange={handleResumeUpload} />
      </div>
    </div>
  );
}

export default ManageProfile;
