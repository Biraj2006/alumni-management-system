const Announcement = require('../models/Announcement');

// Get all announcements (filtered by role)
const getAllAnnouncements = async (req, res) => {
  try {
    let targetAudience = null;
    
    // Filter based on user role
    if (req.user.role === 'alumni') {
      targetAudience = 'alumni';
    } else if (req.user.role === 'student') {
      targetAudience = 'students';
    }
    // Admin sees all

    const announcements = await Announcement.findAll(targetAudience);
    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// Get single announcement
const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Error fetching announcement', error: error.message });
  }
};

// Create announcement (admin only)
const createAnnouncement = async (req, res) => {
  try {
    const { title, description, target_audience } = req.body;
    
    const announcementId = await Announcement.create({
      title,
      description,
      target_audience,
      created_by: req.user.id
    });

    const announcement = await Announcement.findById(announcementId);
    
    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

// Update announcement (admin only)
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, target_audience } = req.body;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.update(id, { title, description, target_audience });
    
    const updated = await Announcement.findById(id);
    res.json({
      message: 'Announcement updated successfully',
      announcement: updated
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
};

// Delete announcement (admin only)
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.delete(id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};

// Get recent announcements
const getRecentAnnouncements = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const announcements = await Announcement.getRecent(limit);
    res.json(announcements);
  } catch (error) {
    console.error('Get recent announcements error:', error);
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getRecentAnnouncements
};
