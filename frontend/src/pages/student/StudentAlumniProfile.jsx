import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { alumniAPI, mentorshipAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentAlumniProfile = () => {
  const { id } = useParams();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [existingRequest, setExistingRequest] = useState(null);

  useEffect(() => {
    fetchAlumniProfile();
    checkExistingRequest();
  }, [id]);

  const fetchAlumniProfile = async () => {
    try {
      const response = await alumniAPI.getByUserId(id);
      setAlumni(response.data);
    } catch (error) {
      console.error('Error fetching alumni profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingRequest = async () => {
    try {
      const response = await mentorshipAPI.getMyRequests();
      const existing = response.data.find(r => r.alumni_id === parseInt(id));
      setExistingRequest(existing);
    } catch (error) {
      console.error('Error checking existing requests:', error);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage({ type: '', text: '' });

    try {
      await mentorshipAPI.create({
        alumni_id: parseInt(id),
        message: requestMessage
      });
      setMessage({ type: 'success', text: 'Mentorship request sent successfully!' });
      setShowRequestForm(false);
      setRequestMessage('');
      checkExistingRequest();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send request'
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!alumni) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h2>Alumni Not Found</h2>
          <p>The alumni profile you're looking for doesn't exist.</p>
          <Link to="/student/search" className="btn btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/student/search" className="back-link">← Back to Search</Link>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="profile-layout">
        <div className="profile-main">
          <div className="card profile-header-card">
            <div className="profile-avatar large">
              {alumni.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-header-info">
              <h1>{alumni.name}</h1>
              {alumni.designation && <p className="designation">{alumni.designation}</p>}
              {alumni.company && <p className="company">at {alumni.company}</p>}
              {alumni.location && <p className="location">📍 {alumni.location}</p>}
              <div className="profile-badges">
                {alumni.is_mentor && <span className="badge badge-mentor">Available for Mentorship</span>}
                {alumni.batch && <span className="badge badge-batch">Batch of {alumni.batch}</span>}
              </div>
            </div>
          </div>

          {alumni.bio && (
            <div className="card">
              <h3>About</h3>
              <p className="bio-text">{alumni.bio}</p>
            </div>
          )}

          {alumni.skills && (
            <div className="card">
              <h3>Skills & Expertise</h3>
              <div className="skills-list">
                {alumni.skills.split(',').map((skill, i) => (
                  <span key={i} className="skill-tag">{skill.trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-sidebar">
          <div className="card">
            <h3>Contact & Connect</h3>
            
            {alumni.linkedin && (
              <a
                href={alumni.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-block"
              >
                View LinkedIn Profile
              </a>
            )}

            {alumni.is_mentor && (
              <>
                {existingRequest ? (
                  <div className="existing-request">
                    <p>
                      <strong>Request Status:</strong>{' '}
                      <span className={`badge badge-${existingRequest.status === 'accepted' ? 'success' : existingRequest.status === 'rejected' ? 'danger' : 'warning'}`}>
                        {existingRequest.status}
                      </span>
                    </p>
                    {existingRequest.status === 'accepted' && (
                      <p className="success-note">
                        🎉 You can now reach out directly to this mentor!
                      </p>
                    )}
                    <Link to="/student/mentorship" className="btn btn-outline btn-block">
                      View My Requests
                    </Link>
                  </div>
                ) : (
                  <>
                    {!showRequestForm ? (
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="btn btn-primary btn-block"
                      >
                        Request Mentorship
                      </button>
                    ) : (
                      <form onSubmit={handleSendRequest} className="request-form">
                        <div className="form-group">
                          <label htmlFor="message">Message (optional)</label>
                          <textarea
                            id="message"
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            rows="4"
                            placeholder="Introduce yourself and explain why you'd like mentorship..."
                          />
                        </div>
                        <div className="form-actions">
                          <button
                            type="button"
                            onClick={() => setShowRequestForm(false)}
                            className="btn btn-outline"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={sending}
                          >
                            {sending ? 'Sending...' : 'Send Request'}
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </>
            )}

            {!alumni.is_mentor && (
              <p className="note">This alumni is not currently offering mentorship.</p>
            )}
          </div>

          <div className="card">
            <h3>Professional Info</h3>
            <dl className="info-list">
              {alumni.batch && (
                <>
                  <dt>Graduation Year</dt>
                  <dd>{alumni.batch}</dd>
                </>
              )}
              {alumni.company && (
                <>
                  <dt>Company</dt>
                  <dd>{alumni.company}</dd>
                </>
              )}
              {alumni.designation && (
                <>
                  <dt>Position</dt>
                  <dd>{alumni.designation}</dd>
                </>
              )}
              {alumni.location && (
                <>
                  <dt>Location</dt>
                  <dd>{alumni.location}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAlumniProfile;
