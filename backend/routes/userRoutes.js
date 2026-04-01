const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get statistics
router.get('/stats', userController.getStats);

// Get pending approvals
router.get('/pending', userController.getPendingApprovals);

// Get all users (with optional role filter)
router.get('/', userController.getAllUsers);

// Get single user
router.get('/:id', userController.getUserById);

// Approve user
router.patch('/:id/approve', userController.approveUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
