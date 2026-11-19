// Customer Requests Controller
const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Create a new errand request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
  try {
    const {
      type,
      title,
      storeOrPickup,
      pickupLocation,
      destination,
      destinationLocation,
      items,
      itemBudget,
      rewardFee,
      neededBy,
      notes,
    } = req.body;

    if (!title || !storeOrPickup || !pickupLocation || !destination || !destinationLocation || !rewardFee) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields including locations and reward fee',
      });
    }

    const request = await Request.create({
      customer: req.user._id,
      type: type || 'buy',
      title,
      storeOrPickup,
      pickupLocation,
      destination,
      destinationLocation,
      items: items || [],
      itemBudget: itemBudget || 0,
      rewardFee,
      neededBy: neededBy || 'Within 1 hour',
      notes: notes || '',
    });

    // Increment requested errands counter on user profile
    await User.findByIdAndUpdate(req.user._id, { $inc: { requestedErrands: 1 } });

    res.status(201).json({
      status: 'success',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active open requests (with optional city/type filters)
// @route   GET /api/requests
// @access  Public
exports.getOpenRequests = async (req, res, next) => {
  try {
    const { city, type } = req.query;
    const query = { status: 'OPEN' };

    if (city) {
      query['pickupLocation.city'] = new RegExp(city, 'i');
    }
    if (type) {
      query.type = type;
    }

    const requests = await Request.find(query)
      .populate('customer', 'name college city rating verified')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      status: 'success',
      count: requests.length,
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests created by logged in customer
// @route   GET /api/requests/my
// @access  Private
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ customer: req.user._id })
      .populate('assignedTraveller', 'name phone rating')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      count: requests.length,
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request details by ID
// @route   GET /api/requests/:id
// @access  Public
exports.getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('customer', 'name college phone rating verified')
      .populate('assignedTraveller', 'name college phone rating verified');

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    res.json({
      status: 'success',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an open request
// @route   PATCH /api/requests/:id/cancel
// @access  Private
exports.cancelRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    // Ownership check: only creator can cancel
    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this request',
      });
    }

    if (request.status !== 'OPEN') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot cancel request with status ${request.status}`,
      });
    }

    request.status = 'CANCELLED';
    request.cancelledAt = new Date();
    request.cancellationReason = req.body.reason || 'Cancelled by customer';
    await request.save();

    res.json({
      status: 'success',
      message: 'Request cancelled successfully',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};
