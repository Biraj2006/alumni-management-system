import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mentorshipAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentMentorship = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await mentorshipAPI.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this request?')) return;

    try {
      await mentorshipAPI.delete(id);
      setRequests(requests.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      default: return 'warning';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Mentorship Requests</h1>
          <p className="page-subtitle">Track your mentorship requests and connections</p>
        </div>
        <Link to="/student/search?mentor=true" className="btn btn-primary">
          Find Mentors
        </Link>
      </div>

      <div className="stats-grid small">
        <div className="stat-card">
          <h3>Total Requests</h3>
          <p className="stat-number">{requests.length}</p>
        </div>
        <div className="stat-card warning">
          <h3>Pending</h3>
          <p className="stat-number">{requests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="stat-card success">
          <h3>Accepted</h3>
          <p className="stat-number">{requests.filter(r => r.status === 'accepted').length}</p>
        </div>
        <div className="stat-card danger">
          <h3>Rejected</h3>
          <p className="stat-number">{requests.filter(r => r.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="section-header">
        <h2>Request History</h2>
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`tab ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button
            className={`tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          {requests.length === 0 ? (
            <>
              <p>You haven't sent any mentorship requests yet.</p>
              <Link to="/student/search?mentor=true" className="btn btn-primary">
                Find Mentors
              </Link>
            </>
          ) : (
            <p>No requests matching the selected filter.</p>
          )}
        </div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map(request => (
            <div key={request.id} className="card request-card student">
              <div className="request-header">
                <div className="mentor-info">
                  <div className="avatar">{request.alumni_name?.charAt(0) || 'A'}</div>
                  <div>
                    <h4>{request.alumni_name}</h4>
                    {request.designation && <p className="title">{request.designation}</p>}
                    {request.company && <p className="company">at {request.company}</p>}
                  </div>
                </div>
                <span className={`badge badge-${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              {request.message && (
                <div className="request-message">
                  <strong>Your message:</strong>
                  <p>"{request.message}"</p>
                </div>
              )}

              <div className="request-footer">
                <span className="date">
                  Sent on {new Date(request.created_at).toLocaleDateString()}
                </span>
                <div className="request-actions">
                  <Link to={`/student/alumni/${request.alumni_id}`} className="btn btn-outline btn-sm">
                    View Profile
                  </Link>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {request.status === 'accepted' && (
                <div className="accepted-notice">
                  <p>🎉 Your request was accepted! You can now connect with this mentor.</p>
                  {request.alumni_email && (
                    <a href={`mailto:${request.alumni_email}`} className="btn btn-primary btn-sm">
                      Send Email
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMentorship;
