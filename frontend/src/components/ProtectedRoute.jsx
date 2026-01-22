import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuthContext();

  // Not logged in at all -> redirect to user auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Route requires admin, but user is not admin -> redirect to home
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

