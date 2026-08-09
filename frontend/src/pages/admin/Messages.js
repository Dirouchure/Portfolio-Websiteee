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
    try {
      const response = await api.get('/contact');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/contact/${id}`);
        setNotification('Message deleted successfully');
        fetchMessages();
        setSelectedMessage(null);
        setTimeout(() => setNotification(''), 3000);
      } catch (error) {
        setNotification('Error deleting message');
      }
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
