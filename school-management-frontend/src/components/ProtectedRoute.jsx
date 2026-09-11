import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm d-inline-block p-4">
          <i className="bi bi-shield-lock-fill fs-1 text-danger d-block mb-3"></i>
          <h4 className="fw-bold">Access Restricted</h4>
          <p className="mb-0 text-muted">
            You do not have administrative permission to view this module.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
