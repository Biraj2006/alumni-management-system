import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { alumniAPI, mentorshipAPI, jobsAPI, announcementsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CountUp from '../../components/animations/CountUp';
import Marquee from '../../components/animations/Marquee';
import AnimatedText from '../../components/animations/AnimatedText';
import MagneticButton from '../../components/animations/MagneticButton';
import { useRef } from 'react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useGSAP(() => {
    if (loading) return;

    // Staggered reveal for stat cards
    gsap.from('.stat-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.stats-grid',
        start: 'top 85%'
      },
      clearProps: 'transform' // Ensure transform is cleared after animation
    });

    // Staggered reveal for dashboard sections
    gsap.from('.dashboard-section', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.dashboard-grid',
        start: 'top 80%'
      },
      clearProps: 'transform'
    });
  }, { scope: containerRef, dependencies: [loading] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [mentorsRes, requestsRes, jobsRes, announcementsRes] = await Promise.all([
        alumniAPI.getMentors(),
        mentorshipAPI.getMyRequests(),
        jobsAPI.getAll(),
        announcementsAPI.getRecent(3)
      ]);

      setMentors(mentorsRes.data.slice(0, 4));
      setMyRequests(requestsRes.data);
      setRecentJobs(jobsRes.data.slice(0, 3));
      setAnnouncements(announcementsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard" ref={containerRef}>
      <h1 className="dashboard-title">
        <AnimatedText text={`Welcome, ${user.name}!`} />
      </h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Available Mentors</h3>
          <p className="stat-number">
            <CountUp end={mentors.length} />
          </p>
          <Link to="/student/search?mentor=true" className="stat-link">Find Mentors</Link>
        </div>
        <div className="stat-card">
          <h3>My Requests</h3>
          <p className="stat-number">
            <CountUp end={myRequests.length} />
          </p>
          <Link to="/student/mentorship" className="stat-link">View Status</Link>
        </div>
        <div className="stat-card">
          <h3>Accepted</h3>
          <p className="stat-number success">
            <CountUp end={myRequests.filter(r => r.status === 'accepted').length} />
          </p>
        </div>
        <div className="stat-card">
          <h3>Job Opportunities</h3>
          <p className="stat-number">
            <CountUp end={recentJobs.length} />
          </p>
          <Link to="/student/jobs" className="stat-link">Browse Jobs</Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Featured Mentors</h2>
            <Link to="/student/search?mentor=true" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>
          
          {mentors.length === 0 ? (
            <p className="empty-message">No mentors available</p>
          ) : (
            <div className="mentor-grid">
              {mentors.map(mentor => (
                <div key={mentor.user_id} className="mentor-card">
                  <div className="mentor-avatar">
                    {mentor.name.charAt(0).toUpperCase()}
                  </div>
                  <h4>{mentor.name}</h4>
                  <p className="mentor-title">{mentor.designation || 'Alumni'}</p>
                  <p className="mentor-company">{mentor.company || 'N/A'}</p>
                  <Link 
                    to={`/student/alumni/${mentor.user_id}`} 
                    className="btn btn-outline btn-sm"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Latest Job Opportunities</h2>
            <Link to="/student/jobs" className="btn btn-outline btn-sm">View All</Link>
          </div>
          
          {recentJobs.length === 0 ? (
            <p className="empty-message">No job postings available</p>
          ) : (
            <div className="job-list">
              {recentJobs.map(job => (
                <div key={job.id} className="job-card">
                  <h4>{job.title}</h4>
                  <p className="company">{job.company}</p>
                  <p className="location">{job.location || 'Remote'}</p>
                  <span className={`badge badge-${job.job_type}`}>
                    {job.job_type}
                  </span>
                  <Link to={`/student/jobs/${job.id}`} className="btn btn-link">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Announcements</h2>
          <Link to="/announcements" className="btn btn-outline btn-sm">View All</Link>
        </div>
        
        {announcements.length === 0 ? (
          <p className="empty-message">No announcements</p>
        ) : (
          <div className="announcement-list horizontal" style={{ margin: '0 -24px' }}>
            <Marquee speed={0.5}>
              <div style={{ display: 'flex', gap: '24px', padding: '0 24px' }}>
                {announcements.map(announcement => (
                  <div key={announcement.id} className="announcement-card" style={{ width: '350px', flexShrink: 0, margin: '10px 0' }}>
                    <h4>{announcement.title}</h4>
                    <p>{announcement.description.substring(0, 100)}...</p>
                    <span className="date">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Get Started</h2>
        <div className="action-buttons">
          <MagneticButton>
            <Link to="/student/search" className="btn btn-primary">
              Search Alumni
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link to="/student/jobs" className="btn btn-secondary">
              Browse Jobs
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link to="/student/mentorship" className="btn btn-outline">
              My Mentorship Requests
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
