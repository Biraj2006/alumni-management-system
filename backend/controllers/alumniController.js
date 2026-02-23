const AlumniProfile = require('../models/AlumniProfile');

// Get all alumni profiles with optional filters
const getAllAlumni = async (req, res) => {
  try {
    const { batch, company, location, skills, is_mentor } = req.query;
    const filters = {};
    
    if (batch) filters.batch = batch;
    if (company) filters.company = company;
    if (location) filters.location = location;
    if (skills) filters.skills = skills;
    if (is_mentor === 'true') filters.is_mentor = true;

    const alumni = await AlumniProfile.findAll(filters);
    res.json(alumni);
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ message: 'Error fetching alumni', error: error.message });
  }
};

// Get alumni profile by user ID
const getAlumniByUserId = async (req, res) => {
  try {
    const profile = await AlumniProfile.findByUserId(req.params.userId);
    if (!profile) {
      return res.status(404).json({ message: 'Alumni profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get alumni profile error:', error);
    res.status(500).json({ message: 'Error fetching alumni profile', error: error.message });
  }
};

// Get current alumni's profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await AlumniProfile.findByUserId(req.user.id);
    res.json(profile || {});
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update current alumni's profile
const updateMyProfile = async (req, res) => {
  try {
    const profileData = req.body;
    await AlumniProfile.upsert(req.user.id, profileData);
    
    const updatedProfile = await AlumniProfile.findByUserId(req.user.id);
    res.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Toggle mentor status
const toggleMentorStatus = async (req, res) => {
  try {
    const profile = await AlumniProfile.findByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await AlumniProfile.update(req.user.id, {
      ...profile,
      is_mentor: !profile.is_mentor
    });

    res.json({ 
      message: `Mentorship ${profile.is_mentor ? 'disabled' : 'enabled'} successfully`,
      is_mentor: !profile.is_mentor
    });
  } catch (error) {
    console.error('Toggle mentor error:', error);
    res.status(500).json({ message: 'Error toggling mentor status', error: error.message });
  }
};

// Get all mentors
const getMentors = async (req, res) => {
  try {
    const mentors = await AlumniProfile.getMentors();
    res.json(mentors);
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
};

// Search alumni
const searchAlumni = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const results = await AlumniProfile.search(q);
    res.json(results);
  } catch (error) {
    console.error('Search alumni error:', error);
    res.status(500).json({ message: 'Error searching alumni', error: error.message });
  }
};

module.exports = {
  getAllAlumni,
  getAlumniByUserId,
  getMyProfile,
  updateMyProfile,
  toggleMentorStatus,
  getMentors,
  searchAlumni
};
