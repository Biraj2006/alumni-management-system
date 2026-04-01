import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const { user, logout, isAdmin, isAlumni, isStudent } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useGSAP(() => {
    // Shrink navbar and add glass effect on scroll
    gsap.to(navRef.current, {
      height: 54,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      scrollTrigger: {
        start: 'top -50',
        toggleActions: 'play none none reverse'
      }
    });
  }, { scope: navRef });

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
    <nav className="navbar" ref={navRef}>
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
