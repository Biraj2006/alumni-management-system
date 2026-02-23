const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { authenticate, isAlumni, isApproved } = require('../middleware/auth');
const { profileValidation } = require('../middleware/validation');

// Public routes (for searching)
router.get('/search', authenticate, alumniController.searchAlumni);
router.get('/mentors', authenticate, alumniController.getMentors);
router.get('/', authenticate, alumniController.getAllAlumni);
router.get('/user/:userId', authenticate, alumniController.getAlumniByUserId);

// Alumni-only routes
router.get('/profile/me', authenticate, isAlumni, alumniController.getMyProfile);
router.put('/profile/me', authenticate, isAlumni, isApproved, profileValidation, alumniController.updateMyProfile);
router.patch('/mentor/toggle', authenticate, isAlumni, isApproved, alumniController.toggleMentorStatus);

module.exports = router;
