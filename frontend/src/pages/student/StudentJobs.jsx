import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentJobs = () => {
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    job_type: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (id && jobs.length > 0) {
      const job = jobs.find(j => j.id === parseInt(id));
      setSelectedJob(job);
    }
  }, [id, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
      if (!id && response.data.length > 0) {
        setSelectedJob(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filters.search ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = !filters.job_type || job.job_type === filters.job_type;
    const matchesLocation = !filters.location ||
      (job.location && job.location.toLowerCase().includes(filters.location.toLowerCase()));

    return matchesSearch && matchesType && matchesLocation;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h1>Job Opportunities</h1>
      <p className="page-subtitle">Explore job opportunities posted by alumni</p>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            name="search"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <select
          name="job_type"
          value={filters.job_type}
          onChange={handleFilterChange}
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location..."
          value={filters.location}
          onChange={handleFilterChange}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <p>No job opportunities found.</p>
        </div>
      ) : (
        <div className="jobs-layout">
          <div className="jobs-list-panel">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className={`job-list-item ${selectedJob?.id === job.id ? 'active' : ''}`}
                onClick={() => setSelectedJob(job)}
              >
                <h4>{job.title}</h4>
                <p className="company">{job.company}</p>
                <div className="job-meta">
                  <span className="location">{job.location || 'Remote'}</span>
                  <span className={`badge badge-${job.job_type}`}>{job.job_type}</span>
                </div>
                <span className="date">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

          <div className="job-detail-panel">
            {selectedJob ? (
              <div className="job-detail">
                <div className="job-detail-header">
                  <div>
                    <h2>{selectedJob.title}</h2>
                    <p className="company">{selectedJob.company}</p>
                    <p className="location">{selectedJob.location || 'Remote'}</p>
                  </div>
                  <span className={`badge badge-${selectedJob.job_type} badge-lg`}>
                    {selectedJob.job_type}
                  </span>
                </div>

                <div className="job-detail-meta">
                  <span>Posted by {selectedJob.alumni_name}</span>
                  <span>{new Date(selectedJob.created_at).toLocaleDateString()}</span>
                </div>

                {selectedJob.description && (
                  <div className="job-section">
                    <h3>Description</h3>
                    <p>{selectedJob.description}</p>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div className="job-section">
                    <h3>Requirements</h3>
                    <p>{selectedJob.requirements}</p>
                  </div>
                )}

                <div className="job-actions">
                  {selectedJob.application_link ? (
                    <a
                      href={selectedJob.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Apply Now
                    </a>
                  ) : (
                    <Link
                      to={`/student/alumni/${selectedJob.alumni_id}`}
                      className="btn btn-primary"
                    >
                      Contact Alumni
                    </Link>
                  )}
                  <Link
                    to={`/student/alumni/${selectedJob.alumni_id}`}
                    className="btn btn-outline"
                  >
                    View Alumni Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="empty-detail">
                <p>Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentJobs;
