import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getAll();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h1>Announcements</h1>
      <p className="page-subtitle">Stay updated with the latest news from the college</p>

      {announcements.length === 0 ? (
        <div className="empty-state">
          <p>No announcements at this time.</p>
        </div>
      ) : (
        <div className="announcements-grid">
          {announcements.map(announcement => (
            <div key={announcement.id} className="card announcement-card-full">
              <div className="announcement-header">
                <h3>{announcement.title}</h3>
                <span className={`badge badge-${announcement.target_audience}`}>
                  {announcement.target_audience === 'all' ? 'Everyone' : announcement.target_audience}
                </span>
              </div>
              <p className="announcement-description">{announcement.description}</p>
              <div className="announcement-footer">
                <span className="date">
                  Posted on {new Date(announcement.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="author">By {announcement.author_name || 'Admin'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
