import React, { useState, useEffect } from 'react';
import { 
  FaArrowRight, FaCheckCircle, FaExclamationCircle, 
  FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaPhone, FaTelegram,
  FaPaperPlane
} from 'react-icons/fa';
import api from '../config/api';
import PageMeta from '../components/PageMeta';
import { defaultProfile } from '../data/defaultData';
import './Contact.css';

const DEFAULT_EMAIL = 'dirouchure@gmail.com';
const DEFAULT_PHONE = '+251940672637';
const DEFAULT_LINKEDIN = 'https://linkedin.com/in/dirouchure';
const DEFAULT_GITHUB = 'https://github.com/Dirouchure';
const DEFAULT_TELEGRAM = 'https://t.me/forall4037';
const DEFAULT_TWITTER = 'https://twitter.com/dirouchure';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_profile');
      return cached ? JSON.parse(cached) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data && Object.keys(response.data).length > 0) {
        const localCached = localStorage.getItem('portfolio_profile');
        if (response.data._is_default && localCached) {
          return;
        }

        const merged = { ...defaultProfile, ...response.data };
        setProfile(merged);
        localStorage.setItem('portfolio_profile', JSON.stringify(merged));
      }
    } catch (error) {
      console.log('Using default contact info');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const email = profile.email || defaultProfile.email || DEFAULT_EMAIL;
  const phone = profile.phone || defaultProfile.phone || DEFAULT_PHONE;
  const linkedinUrl = profile.linkedin_url || defaultProfile.linkedin_url || DEFAULT_LINKEDIN;
  const githubUrl = profile.github_url || defaultProfile.github_url || DEFAULT_GITHUB;
  const telegramUrl = profile.telegram_url || defaultProfile.telegram_url || DEFAULT_TELEGRAM;
  const twitterUrl = profile.twitter_url || defaultProfile.twitter_url || DEFAULT_TWITTER;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmail = email || DEFAULT_EMAIL;
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || 'Project Inquiry',
      message: formData.message.trim()
    };

    // Resilient local persistence so submitted messages are never lost in browser
    try {
      const localList = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
      const newLocalMsg = {
        id: Date.now(),
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        is_read: false,
        created_at: new Date().toISOString()
      };
      localList.unshift(newLocalMsg);
      localStorage.setItem('portfolio_contact_messages', JSON.stringify(localList.slice(0, 50)));
    } catch (e) {
      console.warn('Local storage message cache notice:', e.message);
    }

    let backendSaved = false;
    let emailDelivered = false;

    // 1. Primary Attempt: Direct Local / Hosted API
    try {
      const response = await api.post('/contact', payload);
      backendSaved = true;
      if (response.data?.emailSent) {
        emailDelivered = true;
      }
    } catch (localError) {
      console.warn('Direct server attempt unavailable, auto-routing through cloud relay...', localError.message);
    }

    // 2. Secondary Failover: Free Cloud Form Relay (FormSubmit)
    // Run if backend did not send email or backend server is not running
    if (!emailDelivered) {
      try {
        const cloudResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            _subject: `[Portfolio] ${payload.subject} (from ${payload.name})`,
            message: payload.message,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const cloudData = await cloudResponse.json().catch(() => ({}));

        if (cloudResponse.ok && (cloudData.success === true || cloudData.success === 'true' || cloudData.message?.toLowerCase().includes('success') || cloudData.message?.toLowerCase().includes('sent'))) {
          emailDelivered = true;
          setStatus('success');
          setSuccessMsg('Thank you! Your message has been delivered directly to Diro via email.');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => { 
            setStatus(''); 
            setSuccessMsg(''); 
          }, 8000);
          return;
        } else if (cloudData.message?.toLowerCase().includes('activate') || cloudData.message?.toLowerCase().includes('confirmation')) {
          setStatus('success');
          setSuccessMsg(`Message sent! Please check your inbox (${targetEmail}) and click "Activate Form" once to complete email forwarding.`);
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => { 
            setStatus(''); 
            setSuccessMsg(''); 
          }, 9000);
          return;
        }
      } catch (cloudError) {
        console.warn('Cloud relay unavailable:', cloudError.message);
      }
    }

    // 3. If backend recorded it, notify user
    if (backendSaved) {
      setStatus('success');
      setSuccessMsg('Thank you! Your message has been received and stored. Diro will review it shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => { 
        setStatus(''); 
        setSuccessMsg(''); 
      }, 7000);
      return;
    }

    // 4. Fallback: If both fail (e.g. offline device), provide one-click direct options
    setStatus('error');
    setErrorMsg('Could not deliver directly through automated channels. Please click any button below to send your message instantly:');
  };

  const targetRecipientEmail = email || DEFAULT_EMAIL;

  const mailtoFallback = `mailto:${targetRecipientEmail}?subject=${encodeURIComponent(formData.subject || 'Project Inquiry from ' + (formData.name || 'Portfolio Visitor'))}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

  const gmailWebFallback = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetRecipientEmail)}&su=${encodeURIComponent(formData.subject || 'Project Inquiry from ' + (formData.name || 'Portfolio Visitor'))}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

  const telegramFallback = `${telegramUrl}?text=${encodeURIComponent(
    `Hello Diro! My name is ${formData.name || 'Portfolio Visitor'}${formData.email ? ' (' + formData.email + ')' : ''}.\n\nSubject: ${formData.subject || 'Project Inquiry'}\n\nMessage:\n${formData.message}`
  )}`;

  const socialLinks = [
    { 
      label: 'Email', 
      href: `mailto:${email}`,
      icon: FaEnvelope,
      value: email
    },
    { 
      label: 'Phone', 
      href: `tel:${phone.replace(/\s+/g, '')}`,
      icon: FaPhone,
      value: phone
    },
    { 
      label: 'Telegram', 
      href: telegramUrl,
      icon: FaTelegram,
      value: '@forall4037'
    },
    { 
      label: 'LinkedIn', 
      href: linkedinUrl,
      icon: FaLinkedin,
      value: 'linkedin.com/in/dirouchure'
    },
    { 
      label: 'GitHub', 
      href: githubUrl,
      icon: FaGithub,
      value: 'github.com/Dirouchure'
    },
    { 
      label: 'Twitter / X', 
      href: twitterUrl,
      icon: FaTwitter,
      value: '@dirouchure'
    }
  ];

  return (
    <div className="contact-page">
      <PageMeta
        title={`Contact ${profile.full_name || 'Diro Uchure'} | Full Stack Web Developer`}
        description="Get in touch with Diro Uchure for web development projects, engineering opportunities, and technical consultations."
      />

      <div className="contact-layout">
        <div className="contact-intro">
          <h1 className="contact-title">Contact</h1>
          <p className="contact-lead">
            Whether it's to discuss an upcoming project, explore collaboration, or just say hi, I'd love to hear from you!
          </p>

          <nav className="contact-social-list" aria-label="Social profiles">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                  className="contact-social-item"
                >
                  <span className="contact-icon-wrapper">
                    <Icon className="contact-icon" aria-hidden="true" />
                  </span>
                  <span className="contact-link-content">
                    <span className="contact-link-label">{link.label}</span>
                    <span className="contact-link-value">{link.value}</span>
                  </span>
                  <FaArrowRight className="contact-arrow" aria-hidden="true" />
                </a>
              );
            })}
          </nav>
        </div>

        <div className="contact-form-wrap">
          {status === 'success' && (
            <div className="alert alert-success">
              <FaCheckCircle />
              <div>
                <strong>Message Sent!</strong>
                <p>{successMsg || "Thank you for reaching out. I'll get back to you shortly."}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="alert alert-error">
              <FaExclamationCircle />
              <div style={{ width: '100%' }}>
                <strong>Could not send via direct server</strong>
                <p>{errorMsg}</p>
                <div className="contact-fallback-actions" style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a 
                    href={gmailWebFallback} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    <FaEnvelope /> Open in Gmail Web
                  </a>
                  <a 
                    href={telegramFallback} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    <FaTelegram /> Send via Telegram
                  </a>
                  <a 
                    href={mailtoFallback} 
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    <FaPaperPlane /> Default Email App
                  </a>
                </div>
              </div>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Full Stack Web Project Inquiry"
              />
            </div>

            <div className="form-group form-group-message">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="7"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project, timeline, and requirements..."
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-send"
                disabled={status === 'sending'}
              >
                <span>{status === 'sending' ? 'Sending Message...' : 'Send Message'}</span>
                <span className="btn-send-icon" aria-hidden="true">
                  {status === 'sending' ? <span className="spinner"></span> : <FaPaperPlane />}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
