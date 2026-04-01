import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { alumniAPI, mentorshipAPI, jobsAPI, announcementsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CountUp from '../../components/animations/CountUp';
import Marquee from '../../components/animations/Marquee';
import AnimatedText from '../../components/animations/AnimatedText';
import MagneticButton from '../../components/animations/MagneticButton';

const AlumniDashboard = () => {
  const { user, isApproved } = useAuth();
  const [profile, setProfile] = useState(null);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = React.useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useGSAP(() => {
    if (loading) return;

    // Staggered reveal for stat cards
    gsap.from('.stat-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'transform'
    });

    // Staggered reveal for dashboard sections
    gsap.from('.dashboard-section', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      clearProps: 'transform'
    });
  }, { scope: containerRef, dependencies: [loading] });

  const fetchDashboardData = async () => {
    try {
      const [profileRes, requestsRes, jobsRes, announcementsRes] = await Promise.all([
        alumniAPI.getMyProfile(),
        mentorshipAPI.getReceived(),
        jobsAPI.getMyJobs(),
        announcementsAPI.getRecent(3)
      ]);

      setProfile(profileRes.data);
      setMentorshipRequests(requestsRes.data);
      setMyJobs(jobsRes.data);
      setAnnouncements(announcementsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStatus = async (id, status) => {
    try {
      await mentorshipAPI.updateStatus(id, status);
      setMentorshipRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!isApproved) {
    return (
      <div className="dashboard">
        <div className="pending-notice">
          <h1>Welcome, {user.name}!</h1>
          <div className="alert alert-warning">
            <h3>Account Pending Approval</h3>
            <p>Your account is waiting for admin approval. Once approved, you'll have full access to all alumni features including:</p>
            <ul>
              <li>Complete your professional profile</li>
              <li>Post job opportunities</li>
              <li>Offer mentorship to students</li>
              <li>Connect with fellow alumni</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" ref={containerRef}>
      <h1 className="dashboard-title">
        <AnimatedText text={`Welcome back, ${user.name}!`} />
      </h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Profile Status</h3>
          <p className="stat-number">{profile?.company ? 'Complete' : 'Incomplete'}</p>
          <Link to="/alumni/profile" className="stat-link">Update Profile</Link>
        </div>
        <div className="stat-card">
          <h3>Mentorship</h3>
          <p className="stat-number">{profile?.is_mentor ? 'Active' : 'Inactive'}</p>
          <Link to="/alumni/mentorship" className="stat-link">Manage</Link>
        </div>
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-number">
             <CountUp end={mentorshipRequests.filter(r => r.status === 'pending').length} />
          </p>
        </div>
        <div className="stat-card">
          <h3>My Job Posts</h3>
          <p className="stat-number">
            <CountUp end={myJobs.length} />
          </p>
          <Link to="/alumni/jobs" className="stat-link">Manage Jobs</Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Mentorship Requests</h2>
            <Link to="/alumni/mentorship" className="btn btn-outline btn-sm">View All</Link>
          </div>
          
          {mentorshipRequests.filter(r => r.status === 'pending').length === 0 ? (
            <p className="empty-message">No pending mentorship requests</p>
          ) : (
            <div className="request-list">
              {mentorshipRequests
                .filter(r => r.status === 'pending')
                .slice(0, 3)
                .map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-info">
                      <h4>{request.student_name}</h4>
                      <p>{request.message || 'No message provided'}</p>
                    </div>
                    <div className="request-actions">
                      <button 
                        onClick={() => handleRequestStatus(request.id, 'accepted')}
                        className="btn btn-success btn-sm"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRequestStatus(request.id, 'rejected')}
                        className="btn btn-danger btn-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Announcements</h2>
            <Link to="/announcements" className="btn btn-outline btn-sm">View All</Link>
          </div>
          
          {announcements.length === 0 ? (
            <p className="empty-message">No announcements</p>
          ) : (
            <div className="announcement-list horizontal" style={{ margin: '0 -24px' }}>
              <Marquee speed={0.5}>
                <div style={{ display: 'flex', gap: '24px', padding: '0 24px' }}>
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="announcement-card" style={{ width: '350px', flexShrink: 0, margin: '10px 0' }}>
                      <h4>{announcement.title}</h4>
                      <p>{announcement.description.substring(0, 100)}...</p>
                      <span className="date">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/alumni/profile" className="btn btn-primary">
            Update Profile
          </Link>
          <Link to="/alumni/jobs" className="btn btn-secondary">
            Post a Job
          </Link>
          <Link to="/alumni/mentorship" className="btn btn-outline">
            {profile?.is_mentor ? 'Manage Mentorship' : 'Become a Mentor'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
