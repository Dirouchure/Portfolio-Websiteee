import React, { useState } from 'react';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../config/api';
import PageMeta from '../components/PageMeta';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const response = await api.post('/contact', formData);
      setStatus('success');
      setSuccessMsg(response.data?.message || 'Message sent successfully!');
      if (response.data?.autoReplySent) {
        setSuccessMsg('Message sent! Check your inbox for a confirmation email.');
      }
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => { setStatus(''); setSuccessMsg(''); }, 6000);
    } catch (error) {
      setStatus('error');
      setErrorMsg(error.response?.data?.message || 'Failed to send message. Please try again.');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <div className="contact">
      <PageMeta
        title="Contact Diro Uchure | Video Editor Portfolio"
        description="Get in touch with Diro Uchure for video editing projects, collaborations, and inquiries."
      />
      <div className="container">
        <h1 className="page-title">Contact Me</h1>
        <p className="contact-subtitle">Have a project in mind? I'd love to hear from you.</p>
        
        <div className="contact-container">
          {status === 'success' && (
            <div className="contact-banner success">
              <FaCheckCircle />
              <div>
                <strong>Message sent!</strong>
                <p>{successMsg || 'Thank you for reaching out. I\'ll get back to you soon.'}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="contact-banner error">
              <FaExclamationCircle />
              <div>
                <strong>Could not send message</strong>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary contact-submit" disabled={status === 'sending'}>
              <FaPaperPlane />
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
