import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [], requireApproval = false }) => {
  const { user, loading, isApproved } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireApproval && user.role === 'alumni' && !isApproved) {
    return (
      <div className="pending-approval">
        <h2>Account Pending Approval</h2>
        <p>Your account is waiting for admin approval. You'll have full access once approved.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
