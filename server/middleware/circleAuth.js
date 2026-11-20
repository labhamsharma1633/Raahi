// Circle Authorization Middleware
const Circle = require('../models/Circle');
const CircleMember = require('../models/CircleMember');
const mongoose = require('mongoose');

/**
 * Ensures req.user is an ACTIVE member of the target Circle.
 * Attaches req.circle and req.circleMembership to request.
 */
const requireCircleMember = async (req, res, next) => {
  try {
    const circleId = req.params.circleId || req.params.id || req.body.circleId;

    if (!circleId || !mongoose.Types.ObjectId.isValid(circleId)) {
      return res.status(400).json({ status: 'error', message: 'Valid Circle ID is required' });
    }

    const circle = await Circle.findById(circleId);
    if (!circle || !circle.isActive) {
      return res.status(404).json({ status: 'error', message: 'Circle not found or inactive' });
    }

    const membership = await CircleMember.findOne({
      circleId: circle._id,
      userId: req.user._id,
      status: 'ACTIVE',
    });

    if (!membership) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: You must be an approved member of this Circle to view or participate.',
      });
    }

    req.circle = circle;
    req.circleMembership = membership;
    next();
  } catch (error) {
    console.error('requireCircleMember error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Ensures req.user is an OWNER or ADMIN of the target Circle.
 */
const requireCircleAdmin = async (req, res, next) => {
  try {
    const circleId = req.params.circleId || req.params.id || req.body.circleId;

    if (!circleId || !mongoose.Types.ObjectId.isValid(circleId)) {
      return res.status(400).json({ status: 'error', message: 'Valid Circle ID is required' });
    }

    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({ status: 'error', message: 'Circle not found' });
    }

    const membership = await CircleMember.findOne({
      circleId: circle._id,
      userId: req.user._id,
      status: 'ACTIVE',
      role: { $in: ['OWNER', 'ADMIN'] },
    });

    if (!membership) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: Circle Admin or Owner permission required.',
      });
    }

    req.circle = circle;
    req.circleMembership = membership;
    next();
  } catch (error) {
    console.error('requireCircleAdmin error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Ensures req.user is the OWNER of the target Circle.
 */
const requireCircleOwner = async (req, res, next) => {
  try {
    const circleId = req.params.circleId || req.params.id || req.body.circleId;

    if (!circleId || !mongoose.Types.ObjectId.isValid(circleId)) {
      return res.status(400).json({ status: 'error', message: 'Valid Circle ID is required' });
    }

    const membership = await CircleMember.findOne({
      circleId,
      userId: req.user._id,
      status: 'ACTIVE',
      role: 'OWNER',
    });

    if (!membership) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: Only the Circle Owner can perform this action.',
      });
    }

    req.circleMembership = membership;
    next();
  } catch (error) {
    console.error('requireCircleOwner error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  requireCircleMember,
  requireCircleAdmin,
  requireCircleOwner,
};
