import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid, clearAuth } from '../utils/auth';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token || !isTokenValid(token)) {
    clearAuth();
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
