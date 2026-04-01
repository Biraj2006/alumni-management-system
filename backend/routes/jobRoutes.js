const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, isAlumni, isAdmin, isApproved } = require('../middleware/auth');
const { jobValidation } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Public routes (for all authenticated users)
router.get('/search', jobController.searchJobs);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Alumni-only routes
router.get('/my/jobs', isAlumni, jobController.getMyJobs);
router.post('/', isAlumni, isApproved, jobValidation, jobController.createJob);
router.put('/:id', isAlumni, isApproved, jobController.updateJob);
router.patch('/:id/toggle', isAlumni, isApproved, jobController.toggleJobStatus);
router.delete('/:id', jobController.deleteJob); // Alumni can delete own, admin can delete any

// Admin routes
router.get('/admin/stats', isAdmin, jobController.getStats);

module.exports = router;
