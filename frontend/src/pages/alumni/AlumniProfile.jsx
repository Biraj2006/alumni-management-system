import React, { useState, useEffect } from 'react';
import { alumniAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AlumniProfile = () => {
  const [profile, setProfile] = useState({
    batch: '',
    phone: '',
    company: '',
    designation: '',
    location: '',
    skills: '',
    linkedin: '',
    bio: '',
    is_mentor: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await alumniAPI.getMyProfile();
      if (response.data && Object.keys(response.data).length > 0) {
        setProfile({
          batch: response.data.batch || '',
          phone: response.data.phone || '',
          company: response.data.company || '',
          designation: response.data.designation || '',
          location: response.data.location || '',
          skills: response.data.skills || '',
          linkedin: response.data.linkedin || '',
          bio: response.data.bio || '',
          is_mentor: response.data.is_mentor || false
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await alumniAPI.updateMyProfile(profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h1>My Profile</h1>
      <p className="page-subtitle">Keep your professional information up to date</p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="batch">Graduation Batch</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={profile.batch}
              onChange={handleChange}
              placeholder="e.g., 2020"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={profile.company}
              onChange={handleChange}
              placeholder="Current company"
            />
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={profile.designation}
              onChange={handleChange}
              placeholder="Your job title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn Profile</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js, Project Management"
          />
          <small>Separate skills with commas</small>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell students about your experience and expertise..."
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_mentor"
              checked={profile.is_mentor}
              onChange={handleChange}
            />
            <span>I want to offer mentorship to students</span>
          </label>
          <small>Students will be able to send you mentorship requests</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlumniProfile;
