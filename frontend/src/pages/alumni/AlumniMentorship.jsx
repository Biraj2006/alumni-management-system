import React, { useState, useEffect } from 'react';
import { alumniAPI, mentorshipAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AlumniMentorship = () => {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, profileRes] = await Promise.all([
        mentorshipAPI.getReceived(),
        alumniAPI.getMyProfile()
      ]);
      setRequests(requestsRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMentor = async () => {
    try {
      await alumniAPI.toggleMentor();
      setProfile(prev => ({ ...prev, is_mentor: !prev.is_mentor }));
    } catch (error) {
      console.error('Error toggling mentor status:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await mentorshipAPI.updateStatus(id, status);
      setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h1>Mentorship Management</h1>
      
      <div className="card mentor-status-card">
        <div className="mentor-status-info">
          <h3>Mentor Status</h3>
          <p>
            {profile?.is_mentor 
              ? 'You are currently offering mentorship to students.' 
              : 'You are not currently offering mentorship.'}
          </p>
        </div>
        <button 
          onClick={handleToggleMentor} 
          className={`btn ${profile?.is_mentor ? 'btn-outline' : 'btn-primary'}`}
        >
          {profile?.is_mentor ? 'Disable Mentorship' : 'Become a Mentor'}
        </button>
      </div>

      <div className="section-header">
        <h2>Mentorship Requests</h2>
        <div className="filter-tabs">
          <button 
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({requests.length})
          </button>
          <button 
            className={`tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button 
            className={`tab ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted ({requests.filter(r => r.status === 'accepted').length})
          </button>
          <button 
            className={`tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({requests.filter(r => r.status === 'rejected').length})
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <p>No mentorship requests found.</p>
          {!profile?.is_mentor && (
            <p>Enable mentorship to start receiving requests from students.</p>
          )}
        </div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map(request => (
            <div key={request.id} className="card request-card">
              <div className="request-header">
                <div className="student-info">
                  <div className="avatar">{request.student_name.charAt(0)}</div>
                  <div>
                    <h4>{request.student_name}</h4>
                    <p className="email">{request.student_email}</p>
                    {request.department && (
                      <p className="department">{request.department} • {request.batch}</p>
                    )}
                  </div>
                </div>
                <span className={`badge badge-${request.status}`}>
                  {request.status}
                </span>
              </div>
              
              {request.message && (
                <div className="request-message">
                  <p>"{request.message}"</p>
                </div>
              )}
              
              <div className="request-footer">
                <span className="date">
                  Requested on {new Date(request.created_at).toLocaleDateString()}
                </span>
                
                {request.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      onClick={() => handleUpdateStatus(request.id, 'accepted')}
                      className="btn btn-success btn-sm"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(request.id, 'rejected')}
                      className="btn btn-danger btn-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniMentorship;
