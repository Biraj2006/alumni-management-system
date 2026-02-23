require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Alumni Management System API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
  });
};

startServer();
