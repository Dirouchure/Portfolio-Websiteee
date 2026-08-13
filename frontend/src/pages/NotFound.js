import React from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <PageMeta
        title="404 - Page Not Found | Diro Uchure"
        description="The page you are looking for does not exist."
      />
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
