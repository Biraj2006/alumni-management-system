import React, { useState, useEffect } from 'react';
import { usersAPI, mentorshipAPI, jobsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStats, mentorshipStats, jobStats] = await Promise.all([
        usersAPI.getStats(),
        mentorshipAPI.getStats(),
        jobsAPI.getStats()
      ]);

      setStats({
        users: userStats.data,
        mentorship: mentorshipStats.data,
        jobs: jobStats.data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h1>Reports & Analytics</h1>
      <p className="page-subtitle">Overview of system statistics</p>

      <div className="reports-grid">
        <div className="report-section">
          <h2>User Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats?.users?.total || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Alumni</h3>
              <p className="stat-number">{stats?.users?.alumni || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Students</h3>
              <p className="stat-number">{stats?.users?.students || 0}</p>
            </div>
            <div className="stat-card warning">
              <h3>Pending Approvals</h3>
              <p className="stat-number">{stats?.users?.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>Mentorship Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Requests</h3>
              <p className="stat-number">{stats?.mentorship?.total || 0}</p>
            </div>
            <div className="stat-card warning">
              <h3>Pending</h3>
              <p className="stat-number">{stats?.mentorship?.pending || 0}</p>
            </div>
            <div className="stat-card success">
              <h3>Accepted</h3>
              <p className="stat-number">{stats?.mentorship?.accepted || 0}</p>
            </div>
            <div className="stat-card danger">
              <h3>Rejected</h3>
              <p className="stat-number">{stats?.mentorship?.rejected || 0}</p>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>Job Postings Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Jobs</h3>
              <p className="stat-number">{stats?.jobs?.total || 0}</p>
            </div>
            <div className="stat-card success">
              <h3>Active Jobs</h3>
              <p className="stat-number">{stats?.jobs?.active || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Inactive Jobs</h3>
              <p className="stat-number">{stats?.jobs?.inactive || 0}</p>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>Summary</h2>
          <div className="summary-cards">
            <div className="card summary-card">
              <h3>Platform Growth</h3>
              <p>The platform currently has {stats?.users?.total || 0} registered users.</p>
              <ul>
                <li>{stats?.users?.alumni || 0} alumni members have joined</li>
                <li>{stats?.users?.students || 0} students are actively using the platform</li>
                <li>{stats?.users?.pending || 0} alumni accounts are awaiting approval</li>
              </ul>
            </div>
            <div className="card summary-card">
              <h3>Engagement</h3>
              <p>Mentorship and job features engagement:</p>
              <ul>
                <li>{stats?.mentorship?.accepted || 0} successful mentorship connections</li>
                <li>{stats?.jobs?.active || 0} active job opportunities available</li>
                <li>{Math.round((stats?.mentorship?.accepted / (stats?.mentorship?.total || 1)) * 100) || 0}% mentorship acceptance rate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
