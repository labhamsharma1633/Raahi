// Authentication & User Profile Controller
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'raahi_secure_jwt_secret_fallback_key_2026_prod';

// Helper to generate signed JWT token
function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      college, 
      city, 
      state,
      defaultRole,
      network = 'community',
      institutionalEmail,
    } = req.body;

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

    // Determine initial network membership configurations
    const isCampus = network === 'campus';
    const campusMembership = {
      enrolled: isCampus,
      collegeName: isCampus && college ? college.trim() : '',
      campusId: isCampus && college ? college.toLowerCase().replace(/[^a-z0-9]/g, '-') : '',
      institutionalEmail: isCampus && institutionalEmail ? institutionalEmail.toLowerCase().trim() : '',
      eligibilityStatus: isCampus ? 'pending' : 'not_requested',
      verifiedAt: null,
    };

    const communityMembership = {
      enrolled: true, // Community is open to all users
      city: city ? city.trim() : '',
      state: state ? state.trim() : '',
      identityStatus: 'not_requested',
      verifiedAt: null,
    };

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : '',
      college: college ? college.trim() : 'India Commute Community',
      city: city ? city.trim() : 'All India',
      defaultRole: defaultRole === 'traveller' ? 'traveller' : 'customer',
      activeNetworkPreference: isCampus ? 'campus' : 'community',
      campusMembership,
      communityMembership,
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

// @desc    Switch active network preference between 'campus' and 'community'
// @route   PUT /api/auth/network-preference
// @access  Private (JWT protected)
exports.switchNetworkPreference = async (req, res, next) => {
  try {
    const { network } = req.body;

    if (!['campus', 'community'].includes(network)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid network selection. Must be "campus" or "community".',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (network === 'campus' && !user.campusMembership?.enrolled) {
      return res.status(403).json({
        status: 'error',
        code: 'CAMPUS_MEMBERSHIP_REQUIRED',
        message: 'You have not joined a campus network yet. Please enroll your campus first.',
      });
    }

    user.activeNetworkPreference = network;
    await user.save();

    res.json({
      status: 'success',
      message: `Active network switched to ${network}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll existing user in a campus network (One Account, Two Networks)
// @route   POST /api/auth/campus/enroll
// @access  Private (JWT protected)
exports.enrollCampus = async (req, res, next) => {
  try {
    const { collegeName, institutionalEmail } = req.body;

    if (!collegeName || collegeName.trim().length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid college or university name',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const slug = collegeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    user.campusMembership = {
      enrolled: true,
      collegeName: collegeName.trim(),
      campusId: slug,
      institutionalEmail: institutionalEmail ? institutionalEmail.toLowerCase().trim() : '',
      eligibilityStatus: 'pending',
      verifiedAt: null,
    };
    user.activeNetworkPreference = 'campus';
    user.college = collegeName.trim();

    await user.save();

    res.json({
      status: 'success',
      message: `Successfully joined ${collegeName.trim()} Campus Network (Pending Verification)`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
