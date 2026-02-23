import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'alumni': return '/alumni/dashboard';
      case 'student': return '/student/dashboard';
      default: return '/login';
    }
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <Link to={getDashboardLink()} className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
