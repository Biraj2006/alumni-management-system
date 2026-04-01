const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const { authenticate, isStudent, isAlumni, isAdmin, isApproved } = require('../middleware/auth');
const { mentorshipValidation } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/', isStudent, mentorshipValidation, mentorshipController.createRequest);
router.get('/my-requests', isStudent, mentorshipController.getMyRequests);

// Alumni routes
router.get('/received', isAlumni, isApproved, mentorshipController.getReceivedRequests);
router.patch('/:id/status', isAlumni, isApproved, mentorshipController.updateRequestStatus);

// Shared routes
router.delete('/:id', mentorshipController.deleteRequest);

// Admin routes
router.get('/stats', isAdmin, mentorshipController.getStats);

module.exports = router;
