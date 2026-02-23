const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');

// Create mentorship request (student only)
const createRequest = async (req, res) => {
  try {
    const { alumni_id, message } = req.body;

    // Verify alumni exists and is a mentor
    const alumni = await User.findById(alumni_id);
    if (!alumni || alumni.role !== 'alumni') {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    const alumniProfile = await AlumniProfile.findByUserId(alumni_id);
    if (!alumniProfile || !alumniProfile.is_mentor) {
      return res.status(400).json({ message: 'This alumni is not offering mentorship' });
    }

    const requestId = await MentorshipRequest.create({
      student_id: req.user.id,
      alumni_id,
      message
    });

    res.status(201).json({ 
      message: 'Mentorship request sent successfully',
      requestId 
    });
  } catch (error) {
    if (error.message === 'Mentorship request already exists') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
};

// Get requests for current student
const getMyRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.findByStudent(req.user.id);
    res.json(requests);
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

// Get requests for current alumni (mentor)
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.findByAlumni(req.user.id);
    res.json(requests);
  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

// Update request status (alumni only)
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected.' });
    }

    const request = await MentorshipRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.alumni_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    await MentorshipRequest.updateStatus(id, status, req.user.id);
    res.json({ message: `Request ${status} successfully` });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await MentorshipRequest.delete(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Request not found or not authorized' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ message: 'Error deleting request', error: error.message });
  }
};

// Get mentorship stats (admin only)
const getStats = async (req, res) => {
  try {
    const stats = await MentorshipRequest.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
  deleteRequest,
  getStats
};
