import React, { useState, useEffect } from 'react';
import { FaAward, FaCalendar, FaFilter, FaSearch } from 'react-icons/fa';
import api, { BASE_URL } from '../config/api';
import PageMeta from '../components/PageMeta';
import { defaultCertificates } from '../data/defaultData';
import './Certificates.css';

function Certificates() {
  const [certificates, setCertificates] = useState(() => defaultCertificates);
  const [filteredCertificates, setFilteredCertificates] = useState(() => defaultCertificates);
  const [organizations, setOrganizations] = useState(() => [
    ...new Set(defaultCertificates.map((c) => c.organization).filter(Boolean))
  ]);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    filterCertificates();
  }, [certificates, selectedOrg, searchTerm]);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/certificates');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setCertificates(response.data);
        setFilteredCertificates(response.data);
        const uniqueOrgs = [...new Set(response.data.map((c) => c.organization).filter(Boolean))];
        setOrganizations(uniqueOrgs);
      }
    } catch (error) {
      console.log('Using default certificates (backend offline or loading)');
    }
  };

  const filterCertificates = () => {
    let filtered = certificates;

    if (selectedOrg !== 'all') {
      filtered = filtered.filter(c => c.organization === selectedOrg);
    }

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.organization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCertificates(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="certificates">
      <PageMeta
        title="Certificates & Verified Credentials | Diro Uchure"
        description="Verified software engineering certifications, professional achievements, and technical credentials of Diro Uchure."
      />
      <div className="container">
        <h1 className="page-title">Certificates & Achievements</h1>
        
        {/* Stats */}
        <div className="cert-stats">
          <div className="stat-item">
            <FaAward className="stat-icon-cert" />
            <div>
              <div className="stat-value">{certificates.length}</div>
              <div className="stat-label-cert">Total Certificates</div>
            </div>
          </div>
          <div className="stat-item">
            <FaCalendar className="stat-icon-cert" />
            <div>
              <div className="stat-value">{organizations.length}</div>
              <div className="stat-label-cert">Organizations</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="cert-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button 
              className={selectedOrg === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedOrg('all')}
            >
              <FaFilter /> All ({certificates.length})
            </button>
            {organizations.map((org, index) => (
              <button
                key={index}
                className={selectedOrg === org ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setSelectedOrg(org)}
              >
                {org} ({certificates.filter(c => c.organization === org).length})
              </button>
            ))}
          </div>
        </div>
        
        <div className="certificates-grid">
          {filteredCertificates.map((cert) => (
            <div key={cert.id} className="certificate-card" onClick={() => setSelectedCert(cert)}>
              <div className="certificate-image">
                {cert.certificate_image ? (
                  <img 
                    src={`${BASE_URL}/uploads/${cert.certificate_image}`} 
                    alt={cert.title} 
                  />
                ) : (
                  <div className="certificate-placeholder-banner">
                    <FaAward className="cert-placeholder-icon" />
                    <span>Verified Credential</span>
                  </div>
                )}
              </div>
              <div className="certificate-content">
                <h3>{cert.title}</h3>
                <p className="certificate-org">{cert.organization}</p>
                <p className="certificate-date">{formatDate(cert.issue_date)}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="no-results">
            <p>No certificates found</p>
          </div>
        )}

        {/* Modal for viewing certificate */}
        {selectedCert && (
          <div className="cert-modal" onClick={() => setSelectedCert(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedCert(null)}>×</button>
              {selectedCert.certificate_image && (
                <img 
                  src={`${BASE_URL}/uploads/${selectedCert.certificate_image}`} 
                  alt={selectedCert.title}
                />
              )}
              <h3>{selectedCert.title}</h3>
              <p className="modal-org">{selectedCert.organization}</p>
              <p className="modal-date">{formatDate(selectedCert.issue_date)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Certificates;
