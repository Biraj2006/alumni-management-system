const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { announcementValidation } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get announcements (all authenticated users)
router.get('/', announcementController.getAllAnnouncements);
router.get('/recent', announcementController.getRecentAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);

// Admin-only routes
router.post('/', isAdmin, announcementValidation, announcementController.createAnnouncement);
router.put('/:id', isAdmin, announcementValidation, announcementController.updateAnnouncement);
router.delete('/:id', isAdmin, announcementController.deleteAnnouncement);

module.exports = router;
