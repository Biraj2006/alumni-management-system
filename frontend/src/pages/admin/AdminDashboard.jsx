import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, mentorshipAPI, jobsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CountUp from '../../components/animations/CountUp';
import AnimatedText from '../../components/animations/AnimatedText';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
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
      const [userStats, pending, mentorStats, jobStats] = await Promise.all([
        usersAPI.getStats(),
        usersAPI.getPending(),
        mentorshipAPI.getStats(),
        jobsAPI.getStats()
      ]);

      setStats({
        users: userStats.data,
        mentorship: mentorStats.data,
        jobs: jobStats.data
      });
      setPendingUsers(pending.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await usersAPI.approve(userId);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard" ref={containerRef}>
      <h1 className="dashboard-title">
        <AnimatedText text="Admin Dashboard" />
      </h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number"><CountUp end={stats?.users?.total || 0} /></p>
        </div>
        <div className="stat-card">
          <h3>Alumni</h3>
          <p className="stat-number"><CountUp end={stats?.users?.alumni || 0} /></p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <p className="stat-number"><CountUp end={stats?.users?.students || 0} /></p>
        </div>
        <div className="stat-card warning">
          <h3>Pending Approvals</h3>
          <p className="stat-number"><CountUp end={stats?.users?.pending || 0} /></p>
        </div>
        <div className="stat-card">
          <h3>Active Mentorships</h3>
          <p className="stat-number"><CountUp end={stats?.mentorship?.accepted || 0} /></p>
        </div>
        <div className="stat-card">
          <h3>Active Job Posts</h3>
          <p className="stat-number"><CountUp end={stats?.jobs?.active || 0} /></p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Pending Alumni Approvals</h2>
          <Link to="/admin/users" className="btn btn-outline">View All Users</Link>
        </div>
        
        {pendingUsers.length === 0 ? (
          <p className="empty-message">No pending approvals</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleApprove(user.id)}
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/announcements" className="btn btn-primary">
            Create Announcement
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            Manage Users
          </Link>
          <Link to="/admin/reports" className="btn btn-outline">
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
