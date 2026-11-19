// SmartPool Controller — Manages pooling lifecycle, candidate search, atomic reservation, and multi-stop execution
const mongoose = require('mongoose');
const SmartPool = require('../models/SmartPool');
const Request = require('../models/Request');
const Route = require('../models/Route');
const {
  optimizeSmartPool,
  findSmartPoolCandidates,
} = require('../services/smartPoolOptimizer');

/**
 * GET /api/smart-pool/candidates
 * Fetches compatible single errands and synergistic multi-stop bundles for a commute route.
 */
exports.getCandidates = async (req, res) => {
  try {
    const { routeId } = req.query;
    let route;

    if (routeId && mongoose.Types.ObjectId.isValid(routeId)) {
      route = await Route.findById(routeId);
    } else {
      // Fallback: look for traveller's most recent active route
      route = await Route.findOne({
        traveller: req.user._id,
        active: true,
      }).sort({ createdAt: -1 });
    }

    if (!route) {
      return res.status(404).json({
        status: 'error',
        message: 'No active commute route found. Please publish your route first to find matching Smart Pools.',
      });
    }

    // Query open requests matching network
    const filter = {
      status: 'OPEN',
      // Traveller cannot deliver their own errand
      customer: { $ne: req.user._id },
    };

    if (route.networkScope === 'CAMPUS') {
      filter.networkScope = 'CAMPUS';
      if (route.campusRef) {
        filter.campusRef = route.campusRef;
      }
    }

    const openRequests = await Request.find(filter)
      .populate('customer', 'name email phone avatar')
      .lean();

    const candidates = findSmartPoolCandidates(route, openRequests, 3);

    res.json({
      status: 'success',
      data: {
        route,
        singleCandidates: candidates.singleCandidates,
        bundledPools: candidates.bundledPools,
      },
    });
  } catch (error) {
    console.error('getCandidates error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/smart-pool/optimize
 * Dynamically optimizes an arbitrary selection of 1 to 4 requests for a route.
 */
exports.optimizePool = async (req, res) => {
  try {
    const { routeId, requestIds } = req.body;

    if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ status: 'error', message: 'Valid routeId is required.' });
    }

    if (!Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({ status: 'error', message: 'At least one requestId must be provided.' });
    }

    if (requestIds.length > 4) {
      return res.status(400).json({ status: 'error', message: 'Smart Pool supports a maximum of 4 requests.' });
    }

    const validIds = requestIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length !== requestIds.length) {
      return res.status(400).json({ status: 'error', message: 'Invalid requestId detected.' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ status: 'error', message: 'Route not found.' });
    }

    const requests = await Request.find({ _id: { $in: validIds } })
      .populate('customer', 'name phone')
      .lean();

    if (requests.length !== validIds.length) {
      return res.status(404).json({ status: 'error', message: 'One or more requests could not be found.' });
    }

    const options = {
      travelMode: route.travelMode,
      maxDetourMeters: route.maxDetourMeters,
      maxDetourMinutes: route.maxDetourMinutes,
      availableCapacity: route.availableCapacity,
    };

    const optimizationResult = optimizeSmartPool(
      route.originLocation,
      route.destinationLocation,
      requests,
      options
    );

    res.json({
      status: 'success',
      data: {
        route,
        requests,
        ...optimizationResult,
      },
    });
  } catch (error) {
    console.error('optimizePool error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/smart-pool/confirm
 * Atomically locks selected requests, creates confirmed SmartPool document, and sets status to ACCEPTED.
 */
exports.confirmPool = async (req, res) => {
  try {
    const { routeId, requestIds } = req.body;

    if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ status: 'error', message: 'Valid routeId is required.' });
    }

    if (!Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({ status: 'error', message: 'At least one requestId is required.' });
    }

    const validIds = requestIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    if (validIds.length !== requestIds.length) {
      return res.status(400).json({ status: 'error', message: 'Invalid request IDs provided.' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ status: 'error', message: 'Commute route not found.' });
    }

    // Verify traveller owns this route
    if (route.traveller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'You can only create a Smart Pool for your own route.' });
    }

    // Step 1: Atomic bulk lock on OPEN requests
    const lockResult = await Request.updateMany(
      {
        _id: { $in: validIds },
        status: 'OPEN',
      },
      {
        $set: {
          status: 'ACCEPTED',
          assignedTraveller: req.user._id,
          acceptedAt: new Date(),
        },
      }
    );

    // Step 2: Strict atomicity verification
    if (lockResult.modifiedCount !== validIds.length) {
      // Revert any partially locked requests back to OPEN
      await Request.updateMany(
        {
          _id: { $in: validIds },
          assignedTraveller: req.user._id,
          status: 'ACCEPTED',
        },
        {
          $set: {
            status: 'OPEN',
            assignedTraveller: null,
            acceptedAt: null,
          },
        }
      );

      return res.status(409).json({
        status: 'error',
        message: 'Conflict: One or more selected requests were just accepted by another commuter. Please refresh candidate requests.',
      });
    }

    // Fetch the locked requests with customer details
    const lockedRequests = await Request.find({ _id: { $in: validIds } }).populate('customer', 'name phone');

    // Step 3: Run optimizer to generate final stops sequence
    const options = {
      travelMode: route.travelMode,
      maxDetourMeters: route.maxDetourMeters,
      maxDetourMinutes: route.maxDetourMinutes,
      availableCapacity: route.availableCapacity,
    };

    const optimization = optimizeSmartPool(
      route.originLocation,
      route.destinationLocation,
      lockedRequests,
      options
    );

    // Step 4: Persist confirmed SmartPool
    const pool = new SmartPool({
      traveller: req.user._id,
      route: route._id,
      networkScope: route.networkScope || 'COMMUNITY',
      campusRef: route.campusRef || null,
      requests: validIds,
      stops: optimization.stops,
      activeStopIndex: 1, // Start at first errand stop (stop 0 is Origin)
      metrics: {
        directDistanceMeters: optimization.metrics.directDistanceMeters,
        pooledDistanceMeters: optimization.metrics.pooledDistanceMeters,
        detourDistanceMeters: optimization.metrics.detourDistanceMeters,
        directTimeMinutes: optimization.metrics.directTimeMinutes,
        pooledTimeMinutes: optimization.metrics.pooledTimeMinutes,
        detourTimeMinutes: optimization.metrics.detourTimeMinutes,
        totalCombinedReward: optimization.metrics.totalCombinedReward,
        platformFee: optimization.metrics.platformFee,
        netTravellerEarnings: optimization.metrics.netTravellerEarnings,
        matchScore: optimization.metrics.matchScore,
        capacityUsed: route.availableCapacity || 'Standard',
      },
      status: 'CONFIRMED',
      startedAt: new Date(),
    });

    await pool.save();

    // Step 5: Associate pool ID with requests and route
    await Request.updateMany(
      { _id: { $in: validIds } },
      { $set: { smartPool: pool._id } }
    );

    route.activeSmartPool = pool._id;
    await route.save();

    res.status(201).json({
      status: 'success',
      message: 'Smart Pool confirmed and locked successfully!',
      data: pool,
    });
  } catch (error) {
    console.error('confirmPool error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/smart-pool/active
 * Gets the traveller's currently active Smart Pool.
 */
exports.getActivePool = async (req, res) => {
  try {
    const pool = await SmartPool.findOne({
      traveller: req.user._id,
      status: { $in: ['CONFIRMED', 'IN_TRANSIT'] },
    })
      .populate('route')
      .populate({
        path: 'requests',
        populate: { path: 'customer', select: 'name phone avatar' },
      })
      .sort({ createdAt: -1 });

    if (!pool) {
      return res.json({ status: 'success', data: null });
    }

    res.json({ status: 'success', data: pool });
  } catch (error) {
    console.error('getActivePool error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/smart-pool/:id
 * Gets complete details of a specific Smart Pool.
 */
exports.getPoolById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid pool ID.' });
    }

    const pool = await SmartPool.findById(id)
      .populate('traveller', 'name phone email avatar rating')
      .populate('route')
      .populate({
        path: 'requests',
        populate: { path: 'customer', select: 'name phone avatar' },
      });

    if (!pool) {
      return res.status(404).json({ status: 'error', message: 'Smart Pool not found.' });
    }

    res.json({ status: 'success', data: pool });
  } catch (error) {
    console.error('getPoolById error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/smart-pool/:id/advance-stop
 * Advances through the stop sequence. If stop is DELIVERY, validates handover OTP.
 */
exports.advanceStop = async (req, res) => {
  try {
    const { id } = req.params;
    const { otpCode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid pool ID.' });
    }

    const pool = await SmartPool.findById(id);
    if (!pool) {
      return res.status(404).json({ status: 'error', message: 'Smart Pool not found.' });
    }

    if (pool.traveller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized.' });
    }

    if (pool.status === 'COMPLETED' || pool.status === 'CANCELLED') {
      return res.status(400).json({ status: 'error', message: `Pool is already ${pool.status.toLowerCase()}.` });
    }

    const currentIndex = pool.activeStopIndex;
    const currentStop = pool.stops[currentIndex];

    if (!currentStop) {
      return res.status(400).json({ status: 'error', message: 'All stops have already been completed.' });
    }

    // If stop is a DELIVERY stop, verify OTP
    if (currentStop.stopType === 'DELIVERY') {
      const expectedOtp = currentStop.otpCode;
      if (expectedOtp && (!otpCode || otpCode.toString().trim() !== expectedOtp.toString().trim())) {
        return res.status(400).json({
          status: 'error',
          message: 'Incorrect 4-digit handover verification code. Ask customer for the code displayed on their screen.',
        });
      }
    }

    // Mark current stop completed
    currentStop.status = 'COMPLETED';
    currentStop.completedAt = new Date();

    // Update corresponding request state
    if (currentStop.requestId) {
      if (currentStop.stopType === 'PICKUP') {
        await Request.findByIdAndUpdate(currentStop.requestId, {
          status: 'PICKED_UP',
          pickedUpAt: new Date(),
        });
      } else if (currentStop.stopType === 'DELIVERY') {
        await Request.findByIdAndUpdate(currentStop.requestId, {
          status: 'DELIVERED',
          deliveredAt: new Date(),
        });
      }
    }

    // Set pool state to IN_TRANSIT if not already
    if (pool.status === 'CONFIRMED') {
      pool.status = 'IN_TRANSIT';
    }

    // Advance activeStopIndex
    const nextIndex = currentIndex + 1;
    if (nextIndex < pool.stops.length) {
      pool.activeStopIndex = nextIndex;
      // Mark next stop arrived / pending
    } else {
      // Completed all stops!
      pool.status = 'COMPLETED';
      pool.completedAt = new Date();
      // Clear route activeSmartPool
      await Route.findByIdAndUpdate(pool.route, { activeSmartPool: null });
    }

    await pool.save();

    res.json({
      status: 'success',
      message: currentStop.stopType === 'DELIVERY' ? 'Delivery verified and completed!' : 'Stop marked completed.',
      data: pool,
    });
  } catch (error) {
    console.error('advanceStop error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/smart-pool/:id/cancel
 * Cancels the pool and releases any incomplete requests back to OPEN.
 */
exports.cancelPool = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid pool ID.' });
    }

    const pool = await SmartPool.findById(id);
    if (!pool) {
      return res.status(404).json({ status: 'error', message: 'Smart Pool not found.' });
    }

    if (pool.traveller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized.' });
    }

    if (pool.status === 'COMPLETED' || pool.status === 'CANCELLED') {
      return res.status(400).json({ status: 'error', message: `Cannot cancel a pool that is already ${pool.status.toLowerCase()}.` });
    }

    // Find requests in this pool that haven't been delivered
    const requests = await Request.find({ _id: { $in: pool.requests } });
    for (const reqDoc of requests) {
      if (reqDoc.status === 'ACCEPTED') {
        // Safe to revert back to OPEN
        reqDoc.status = 'OPEN';
        reqDoc.assignedTraveller = null;
        reqDoc.smartPool = null;
        reqDoc.acceptedAt = null;
        await reqDoc.save();
      } else if (reqDoc.status === 'PICKED_UP' || reqDoc.status === 'IN_TRANSIT') {
        // Item already in traveller possession: mark CANCELLED with reason
        reqDoc.status = 'CANCELLED';
        reqDoc.cancellationReason = reason || 'Traveller cancelled pooled journey after pickup';
        reqDoc.cancelledAt = new Date();
        await reqDoc.save();
      }
    }

    pool.status = 'CANCELLED';
    pool.cancellationReason = reason || 'Cancelled by traveller';
    pool.cancelledAt = new Date();
    await pool.save();

    await Route.findByIdAndUpdate(pool.route, { activeSmartPool: null });

    res.json({
      status: 'success',
      message: 'Smart Pool has been cancelled and uncollected requests were reopened.',
      data: pool,
    });
  } catch (error) {
    console.error('cancelPool error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
