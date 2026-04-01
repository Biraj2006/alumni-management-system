const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['alumni', 'student']).withMessage('Role must be either alumni or student'),
  handleValidationErrors
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Alumni profile validation
const profileValidation = [
  body('batch').optional().trim(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('designation').optional().trim(),
  body('location').optional().trim(),
  body('skills').optional().trim(),
  body('linkedin').optional().trim().isURL().withMessage('Please provide a valid LinkedIn URL'),
  body('bio').optional().trim(),
  body('is_mentor').optional().isBoolean(),
  handleValidationErrors
];

// Announcement validation
const announcementValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('target_audience')
    .optional()
    .isIn(['all', 'alumni', 'students']).withMessage('Invalid target audience'),
  handleValidationErrors
];

// Job posting validation
const jobValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required'),
  body('location').optional().trim(),
  body('description').optional().trim(),
  body('requirements').optional().trim(),
  body('job_type')
    .optional()
    .isIn(['full-time', 'part-time', 'internship', 'contract']).withMessage('Invalid job type'),
  body('application_link').optional().trim(),
  handleValidationErrors
];

// Mentorship request validation
const mentorshipValidation = [
  body('alumni_id')
    .notEmpty().withMessage('Alumni ID is required')
    .isInt().withMessage('Alumni ID must be a number'),
  body('message').optional().trim(),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  profileValidation,
  announcementValidation,
  jobValidation,
  mentorshipValidation
};
