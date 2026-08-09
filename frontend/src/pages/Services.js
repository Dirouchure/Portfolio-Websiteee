import React, { useState, useEffect } from 'react';
import { FaVideo, FaPalette, FaMagic, FaMusic, FaCheck, FaArrowRight } from 'react-icons/fa';
import api from '../config/api';
import './Services.css';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
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
      <div className="container">
        <div className="services-header">
          <h1 className="page-title">My Services</h1>
          <p className="page-subtitle">Professional video editing services tailored to your needs</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id} className={`service-card ${index === 0 ? 'highlighted' : ''}`}>
              <div className="service-icon">
                {getIcon(service.icon)}
              </div>
              <h3 className="service-name">{service.service_name}</h3>
              {service.description && (
                <p className="service-description">{service.description}</p>
              )}
              
              <div className="service-details">
                {service.price && (
                  <div className="detail-item">
                    <strong>Price:</strong> {service.price}
                  </div>
                )}
                {service.duration && (
                  <div className="detail-item">
                    <strong>Delivery:</strong> {service.duration}
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

              <button className="service-btn">
                Get Started <FaArrowRight />
              </button>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="no-data">
            <p>No services available at the moment.</p>
          </div>
        )}

        <div className="cta-section">
          <h2>Have a Custom Project in Mind?</h2>
          <p>Let's discuss your specific needs and create something amazing together.</p>
          <button className="cta-btn">Contact Me</button>
        </div>
      </div>
    </div>
  );
}

export default Services;
