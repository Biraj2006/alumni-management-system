import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AlumniJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    job_type: 'full-time',
    application_link: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getMyJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      requirements: '',
      job_type: 'full-time',
      application_link: ''
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editing) {
        await jobsAPI.update(editing, formData);
        setMessage({ type: 'success', text: 'Job updated successfully!' });
      } else {
        await jobsAPI.create(formData);
        setMessage({ type: 'success', text: 'Job posted successfully!' });
      }
      fetchJobs();
      resetForm();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save job' 
      });
    }
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location || '',
      description: job.description || '',
      requirements: job.requirements || '',
      job_type: job.job_type,
      application_link: job.application_link || ''
    });
    setEditing(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await jobsAPI.delete(id);
      setJobs(jobs.filter(j => j.id !== id));
      setMessage({ type: 'success', text: 'Job deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete job' });
    }
  };

  const handleToggle = async (id) => {
    try {
      await jobsAPI.toggle(id);
      setJobs(jobs.map(j => j.id === id ? { ...j, is_active: !j.is_active } : j));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle job status' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Job Postings</h1>
          <p className="page-subtitle">Share job opportunities with students</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card form-card">
          <h3>{editing ? 'Edit Job' : 'Post New Job'}</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="Company name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country or Remote"
              />
            </div>

            <div className="form-group">
              <label htmlFor="job_type">Job Type</label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the role and responsibilities..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="3"
              placeholder="Required skills and qualifications..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="application_link">Application Link</label>
            <input
              type="url"
              id="application_link"
              name="application_link"
              value={formData.application_link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editing ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      )}

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>You haven't posted any jobs yet.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Post Your First Job
            </button>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className={`card job-card ${!job.is_active ? 'inactive' : ''}`}>
              <div className="job-header">
                <div>
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                </div>
                <div className="job-badges">
                  <span className={`badge badge-${job.job_type}`}>{job.job_type}</span>
                  <span className={`badge ${job.is_active ? 'badge-success' : 'badge-inactive'}`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              {job.location && <p className="location">📍 {job.location}</p>}
              {job.description && <p className="description">{job.description}</p>}
              
              <div className="job-actions">
                <button onClick={() => handleToggle(job.id)} className="btn btn-outline btn-sm">
                  {job.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleEdit(job)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(job.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlumniJobs;
