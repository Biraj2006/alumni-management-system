import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { alumniAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentSearch = () => {
  const [searchParams] = useSearchParams();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    batch: '',
    company: '',
    location: '',
    skills: '',
    mentorOnly: searchParams.get('mentor') === 'true'
  });

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await alumniAPI.getAll();
      setAlumni(response.data);
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredAlumni = alumni.filter(alum => {
    const matchesSearch = !filters.search || 
      alum.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (alum.skills && alum.skills.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesBatch = !filters.batch || alum.batch === filters.batch;
    const matchesCompany = !filters.company || 
      (alum.company && alum.company.toLowerCase().includes(filters.company.toLowerCase()));
    const matchesLocation = !filters.location || 
      (alum.location && alum.location.toLowerCase().includes(filters.location.toLowerCase()));
    const matchesSkills = !filters.skills || 
      (alum.skills && alum.skills.toLowerCase().includes(filters.skills.toLowerCase()));
    const matchesMentor = !filters.mentorOnly || alum.is_mentor;

    return matchesSearch && matchesBatch && matchesCompany && matchesLocation && matchesSkills && matchesMentor;
  });

  const uniqueBatches = [...new Set(alumni.map(a => a.batch).filter(Boolean))].sort().reverse();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h1>Find Alumni</h1>
      <p className="page-subtitle">Search and connect with alumni for mentorship and career guidance</p>

      <div className="search-filters card">
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="search">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or skills..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="batch">Batch</label>
            <select
              id="batch"
              name="batch"
              value={filters.batch}
              onChange={handleFilterChange}
            >
              <option value="">All Batches</option>
              {uniqueBatches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              placeholder="Filter by company..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Filter by location..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              placeholder="Filter by skills..."
            />
          </div>

          <div className="form-group checkbox-inline">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="mentorOnly"
                checked={filters.mentorOnly}
                onChange={handleFilterChange}
              />
              <span>Mentors Only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="results-info">
        <p>Showing {filteredAlumni.length} of {alumni.length} alumni</p>
      </div>

      {filteredAlumni.length === 0 ? (
        <div className="empty-state">
          <p>No alumni found matching your criteria.</p>
          <button onClick={() => setFilters({ search: '', batch: '', company: '', location: '', skills: '', mentorOnly: false })} className="btn btn-outline">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="alumni-grid">
          {filteredAlumni.map(alum => (
            <div key={alum.user_id} className="card alumni-card">
              <div className="alumni-header">
                <div className="alumni-avatar">
                  {alum.name.charAt(0).toUpperCase()}
                </div>
                <div className="alumni-badges">
                  {alum.is_mentor && <span className="badge badge-mentor">Mentor</span>}
                  {alum.batch && <span className="badge badge-batch">{alum.batch}</span>}
                </div>
              </div>
              
              <h3>{alum.name}</h3>
              {alum.designation && <p className="designation">{alum.designation}</p>}
              {alum.company && <p className="company">{alum.company}</p>}
              {alum.location && <p className="location">📍 {alum.location}</p>}
              
              {alum.skills && (
                <div className="skills-preview">
                  {alum.skills.split(',').slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill.trim()}</span>
                  ))}
                  {alum.skills.split(',').length > 3 && (
                    <span className="skill-tag more">+{alum.skills.split(',').length - 3}</span>
                  )}
                </div>
              )}
              
              <Link to={`/student/alumni/${alum.user_id}`} className="btn btn-primary btn-block">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
