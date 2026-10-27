import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCode, FaPalette, FaServer, FaDatabase, FaRocket, FaShieldAlt, 
  FaCheck, FaArrowRight, FaQuestionCircle, FaChevronDown, FaChevronUp,
  FaClock, FaTag, FaLaptopCode
} from 'react-icons/fa';
import api from '../config/api';
import PageMeta from '../components/PageMeta';
import { defaultServices, defaultFAQs } from '../data/defaultData';
import './Services.css';

function Services() {
  const [services, setServices] = useState(() => defaultServices);
  const [faqs, setFaqs] = useState(() => defaultFAQs);
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setServices(response.data);
      }
    } catch (error) {
      console.log('Using default services (backend offline or loading)');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const key = (iconName || '').toLowerCase().trim();
    switch (key) {
      case 'code':
      case 'magic':
        return <FaCode />;
      case 'palette':
        return <FaPalette />;
      case 'server':
        return <FaServer />;
      case 'database':
        return <FaDatabase />;
      case 'rocket':
        return <FaRocket />;
      case 'shield':
        return <FaShieldAlt />;
      default:
        return <FaLaptopCode />;
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  if (loading) {
    return (
      <div className="services">
        <div className="container">
          <div className="loading">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="services">
      <PageMeta
        title="Engineering Services & Solutions | Diro Uchure"
        description="Professional full-stack web development, modern frontend engineering, secure REST APIs, and database architecture solutions."
      />

      <div className="container">
        <div className="services-header">
          <span className="services-badge">End-to-End Solutions</span>
          <h1 className="page-title">Engineering Services</h1>
          <p className="page-subtitle">
            Scalable, high-performance web development and software engineering solutions tailored to your business goals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id || index} className={`service-card ${index === 0 ? 'highlighted' : ''}`}>
              <div className="service-icon-box">
                {getIcon(service.icon)}
              </div>

              <h3 className="service-name">{service.service_name}</h3>
              
              {service.description && (
                <p className="service-description">{service.description}</p>
              )}
              
              <div className="service-meta-bar">
                {service.duration && (
                  <div className="meta-pill">
                    <FaClock /> <span>{service.duration}</span>
                  </div>
                )}
                {service.price && (
                  <div className="meta-pill price">
                    <FaTag /> <span>{service.price}</span>
                  </div>
                )}
              </div>

              {service.features && (
                <div className="service-features">
                  <h4>What's Included:</h4>
                  <ul>
                    {service.features.split(',').map((feature, idx) => (
                      <li key={idx}>
                        <FaCheck className="check-icon" />
                        <span>{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to="/contact" className="service-btn">
                <span>Start Project</span> <FaArrowRight />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="services-faq-section">
          <div className="faq-header">
            <FaQuestionCircle className="faq-header-icon" />
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about working together</p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  {activeFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="cta-section">
          <h2>Have a Custom Project or Enterprise Need?</h2>
          <p>Let's discuss your specific technical requirements, milestones, and deliverables.</p>
          <Link to="/contact" className="cta-btn">
            Schedule a Technical Consultation &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Services;
