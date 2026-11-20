// JWT Authentication Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'raahi_secure_jwt_secret_fallback_key_2026_prod';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user document (excluding password) to the request object
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User no longer exists',
        });
      }

      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired authorization token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, no token provided',
    });
  }
};

module.exports = { protect };
