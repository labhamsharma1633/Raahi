// Authentication & User Profile Controller
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate signed JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, college, city, defaultRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email address already exists',
      });
    }

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : '',
      college: college ? college.trim() : 'India Commute Community',
      city: city ? city.trim() : 'All India',
      defaultRole: defaultRole === 'traveller' ? 'traveller' : 'customer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password',
      });
    }

    // Fetch user and explicitly include hashed password for verification
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (JWT protected)
exports.getMe = async (req, res) => {
  res.json({
    status: 'success',
    data: { user: req.user },
  });
};

// @desc    Update profile or switch active role
// @route   PUT /api/auth/me
// @access  Private (JWT protected)
exports.updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'college', 'city', 'defaultRole'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      status: 'success',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
