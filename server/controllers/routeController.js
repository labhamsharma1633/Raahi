// Routes & Matching Controller
const Route = require('../models/Route');
const Request = require('../models/Request');
const { findMatches, calculateRoadDistanceMeters } = require('../services/matchingService');

// @desc    Publish a commuter route
// @route   POST /api/routes
// @access  Private
exports.createRoute = async (req, res, next) => {
  try {
    const {
      origin,
      originLocation,
      destination,
      destinationLocation,
      travelDate,
      departureTime,
      travelMode,
      maxDetourMeters,
      maxDetourMinutes,
      availableCapacity,
    } = req.body;

    if (!origin || !originLocation || !destination || !destinationLocation || !departureTime) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide origin, destination and departure time',
      });
    }

    // Estimate road distance for base trip
    const distMeters = calculateRoadDistanceMeters(
      originLocation.latitude,
      originLocation.longitude,
      destinationLocation.latitude,
      destinationLocation.longitude
    );
    const distanceKm = distMeters ? Math.round((distMeters / 1000) * 10) / 10 : 0;

    // Determine network scope
    let scope = (req.body.networkScope || req.user.activeNetworkPreference || 'COMMUNITY').toUpperCase();
    let assignedCampusRef = req.body.campusRef || null;

    if (scope === 'CAMPUS') {
      if (!req.user.campusMembership?.enrolled) {
        return res.status(403).json({
          status: 'error',
          code: 'CAMPUS_MEMBERSHIP_REQUIRED',
          message: 'You must enroll in your campus before publishing campus-only routes',
        });
      }
      assignedCampusRef = assignedCampusRef || req.user.campusMembership?.campusId || null;
    } else {
      scope = 'COMMUNITY';
    }

    const route = await Route.create({
      traveller: req.user._id,
      origin,
      originLocation,
      destination,
      destinationLocation,
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      departureTime,
      travelMode: travelMode || 'Walking',
      distanceKm,
      maxDetourMeters: maxDetourMeters || 800,
      maxDetourMinutes: maxDetourMinutes || 15,
      availableCapacity: availableCapacity || 'Backpack (up to 3 kg)',
      networkScope: scope,
      campusRef: assignedCampusRef,
      active: true,
    });

    res.status(201).json({
      status: 'success',
      data: { route },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's published routes
// @route   GET /api/routes/my
// @access  Private
exports.getMyRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find({ traveller: req.user._id }).sort({ createdAt: -1 });

    res.json({
      status: 'success',
      count: routes.length,
      data: { routes },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Find matching requests along a published route
// @route   GET /api/routes/:id/matches
// @access  Private
exports.getRouteMatches = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found',
      });
    }

    // Fetch all active OPEN requests
    const openRequests = await Request.find({ status: 'OPEN' })
      .populate('customer', 'name college city rating verified')
      .lean();

    // Run matching engine
    const matches = findMatches(route, openRequests);

    res.json({
      status: 'success',
      count: matches.length,
      data: {
        route,
        matches,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate a route
// @route   PATCH /api/routes/:id/deactivate
// @access  Private
exports.deactivateRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found',
      });
    }

    if (route.traveller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this route',
      });
    }

    route.active = false;
    await route.save();

    res.json({
      status: 'success',
      message: 'Route deactivated',
      data: { route },
    });
  } catch (error) {
    next(error);
  }
};
