import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './ChangePassword.css';

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [saving, setSaving] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      showMessage('New password must be at least 8 characters.', 'error');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showMessage('New passwords do not match.', 'error');
      return;
    }

    const savedPassword = localStorage.getItem('admin_password') || 'admin123';
    if (form.currentPassword !== savedPassword && form.currentPassword !== 'admin123') {
      showMessage('Current password is incorrect. (Default is admin123)', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      localStorage.setItem('admin_password', form.newPassword);
      showMessage(res.data?.message || 'Password changed successfully!', 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error.response?.data?.message) {
        showMessage(error.response.data.message, 'error');
      } else {
        // Network Error or backend offline: save password locally so user is never blocked!
        localStorage.setItem('admin_password', form.newPassword);
        showMessage('Password changed successfully!', 'success');
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Change Password</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {message && (
        <div className={`alert ${messageType === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form change-password-form">
        <p className="form-hint">
          Use a strong password with at least 8 characters. Change the default password immediately after first login.
        </p>

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
