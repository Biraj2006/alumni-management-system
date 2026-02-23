const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user
    const userId = await User.create({ name, email, password, role });

    // If alumni, create empty profile
    if (role === 'alumni') {
      await AlumniProfile.create({ user_id: userId });
    }

    const user = await User.findById(userId);
    const token = generateToken(user);

    res.status(201).json({
      message: role === 'alumni' 
        ? 'Registration successful. Please wait for admin approval.' 
        : 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let profile = null;
    if (user.role === 'alumni') {
      profile = await AlumniProfile.findByUserId(user.id);
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved,
        created_at: user.created_at
      },
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user info
const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email is taken by another user
    if (email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await User.update(req.user.id, { name, email });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe
};
