import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_audience: 'all'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', target_audience: 'all' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editing) {
        await announcementsAPI.update(editing, formData);
        setMessage({ type: 'success', text: 'Announcement updated successfully!' });
      } else {
        await announcementsAPI.create(formData);
        setMessage({ type: 'success', text: 'Announcement created successfully!' });
      }
      fetchAnnouncements();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save announcement'
      });
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      target_audience: announcement.target_audience
    });
    setEditing(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await announcementsAPI.delete(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      setMessage({ type: 'success', text: 'Announcement deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete announcement' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p className="page-subtitle">Create and manage announcements for alumni and students</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card form-card">
          <h3>{editing ? 'Edit Announcement' : 'Create Announcement'}</h3>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Announcement title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Write your announcement here..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_audience">Target Audience</label>
            <select
              id="target_audience"
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
            >
              <option value="all">Everyone</option>
              <option value="alumni">Alumni Only</option>
              <option value="students">Students Only</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editing ? 'Update' : 'Create'} Announcement
            </button>
          </div>
        </form>
      )}

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <div className="empty-state">
            <p>No announcements yet.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Create First Announcement
            </button>
          </div>
        ) : (
          announcements.map(announcement => (
            <div key={announcement.id} className="card announcement-admin-card">
              <div className="announcement-header">
                <h3>{announcement.title}</h3>
                <span className={`badge badge-${announcement.target_audience}`}>
                  {announcement.target_audience === 'all' ? 'Everyone' : announcement.target_audience}
                </span>
              </div>
              <p className="announcement-description">{announcement.description}</p>
              <div className="announcement-footer">
                <span className="date">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </span>
                <div className="announcement-actions">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
