import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isAlumni, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isAlumni) return '/alumni/dashboard';
    if (isStudent) return '/student/dashboard';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={getDashboardLink()}>Alumni Connect</Link>
      </div>
      
      {user && (
        <>
          <div className="nav-links">
            {isAdmin && (
              <>
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/announcements">Announcements</Link>
                <Link to="/admin/reports">Reports</Link>
              </>
            )}
            
            {isAlumni && (
              <>
                <Link to="/alumni/dashboard">Dashboard</Link>
                <Link to="/alumni/profile">Profile</Link>
                <Link to="/alumni/jobs">My Jobs</Link>
                <Link to="/alumni/mentorship">Mentorship</Link>
                <Link to="/announcements">Announcements</Link>
              </>
            )}
            
            {isStudent && (
              <>
                <Link to="/student/dashboard">Dashboard</Link>
                <Link to="/student/search">Find Alumni</Link>
                <Link to="/student/jobs">Job Board</Link>
                <Link to="/student/mentorship">My Requests</Link>
                <Link to="/announcements">Announcements</Link>
              </>
            )}
          </div>
          
          <div className="nav-user">
            <span className="user-info">
              {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
