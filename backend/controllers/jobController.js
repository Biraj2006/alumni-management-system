const JobPosting = require('../models/JobPosting');

// Get all active job postings
const getAllJobs = async (req, res) => {
  try {
    const { job_type, company, location } = req.query;
    const filters = {};
    
    if (job_type) filters.job_type = job_type;
    if (company) filters.company = company;
    if (location) filters.location = location;

    const jobs = await JobPosting.findAll(filters);
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Get single job posting
const getJobById = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

// Get jobs posted by current alumni
const getMyJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.findByAlumni(req.user.id);
    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Create job posting (alumni only)
const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      alumni_id: req.user.id
    };

    const jobId = await JobPosting.create(jobData);
    const job = await JobPosting.findById(jobId);

    res.status(201).json({
      message: 'Job posting created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
};

// Update job posting (alumni only - own jobs)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await JobPosting.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    if (job.alumni_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    await JobPosting.update(id, req.user.id, req.body);
    
    const updated = await JobPosting.findById(id);
    res.json({
      message: 'Job posting updated successfully',
      job: updated
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
};

// Delete job posting (alumni only - own jobs)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobPosting.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    if (job.alumni_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await JobPosting.delete(id, job.alumni_id);
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

// Toggle job active status
const toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobPosting.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    if (job.alumni_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    await JobPosting.toggleActive(id, req.user.id);
    res.json({ 
      message: `Job ${job.is_active ? 'deactivated' : 'activated'} successfully`,
      is_active: !job.is_active
    });
  } catch (error) {
    console.error('Toggle job error:', error);
    res.status(500).json({ message: 'Error toggling job status', error: error.message });
  }
};

// Search jobs
const searchJobs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const jobs = await JobPosting.search(q);
    res.json(jobs);
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({ message: 'Error searching jobs', error: error.message });
  }
};

// Get job stats (admin only)
const getStats = async (req, res) => {
  try {
    const stats = await JobPosting.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  searchJobs,
  getStats
};
