import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './Messages.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    let serverMessages = [];
    try {
      const response = await api.get('/contact');
      if (Array.isArray(response.data)) {
        serverMessages = response.data;
      }
    } catch (error) {
      console.warn('Backend contact messages unreachable, checking local sync:', error);
    }

    try {
      const localStored = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
      const combined = [...serverMessages];
      for (const item of localStored) {
        if (!combined.some(m => (m.name === item.name && m.email === item.email && m.message === item.message) || m.id === item.id)) {
          combined.push(item);
        }
      }
      combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setMessages(combined);
    } catch (e) {
      setMessages(serverMessages);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
    } catch (error) {
      console.error('Error marking message as read on server:', error);
    }

    try {
      const localStored = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
      const updated = localStored.map(m => m.id === id ? { ...m, is_read: true } : m);
      localStorage.setItem('portfolio_contact_messages', JSON.stringify(updated));
    } catch (e) {}

    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(prev => ({ ...prev, is_read: true }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/contact/${id}`);
      } catch (error) {
        console.error('Error deleting message on server:', error);
      }

      try {
        const localStored = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        const filtered = localStored.filter(m => m.id !== id);
        localStorage.setItem('portfolio_contact_messages', JSON.stringify(filtered));
      } catch (e) {}

      setNotification('Message deleted successfully');
      setMessages(prev => prev.filter(m => m.id !== id));
      setSelectedMessage(null);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <Link to="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {notification && <div className="alert">{notification}</div>}

      <div className="messages-container">
        <div className="messages-list">
          <h2>Messages ({messages.length})</h2>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-item ${!message.is_read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'active' : ''}`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="message-header">
                <strong>{message.name}</strong>
                {!message.is_read && <span className="unread-badge">New</span>}
              </div>
              <div className="message-subject">{message.subject || 'No Subject'}</div>
              <div className="message-date">
                {new Date(message.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="no-messages">No messages yet</p>
          )}
        </div>

        <div className="message-detail">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <h2>{selectedMessage.subject || 'No Subject'}</h2>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
              <div className="detail-info">
                <p><strong>From:</strong> {selectedMessage.name}</p>
                <p><strong>Email:</strong> {selectedMessage.email}</p>
                <p><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
              <div className="detail-message">
                <h3>Message:</h3>
                <p>{selectedMessage.message}</p>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
