// Deliveries & Status Lifecycle Controller
const Request = require('../models/Request');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Accept an open delivery request as a traveller
// @route   POST /api/deliveries/:id/accept
// @access  Private
exports.acceptRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;

    // Concurrency safe: only update if status is still strictly OPEN
    const request = await Request.findOneAndUpdate(
      { _id: requestId, status: 'OPEN' },
      {
        status: 'ACCEPTED',
        assignedTraveller: req.user._id,
        acceptedAt: new Date(),
      },
      { new: true }
    )
      .populate('customer', 'name phone rating')
      .populate('assignedTraveller', 'name phone rating');

    if (!request) {
      return res.status(400).json({
        status: 'error',
        message: 'This request is no longer open or was already accepted by another traveller',
      });
    }

    res.json({
      status: 'success',
      message: `Delivery accepted! ₹${request.rewardFee} reward reserved.`,
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Advance delivery status (ACCEPTED -> PICKED_UP -> IN_TRANSIT -> DELIVERED)
// @route   POST /api/deliveries/:id/advance
// @access  Private
exports.advanceDelivery = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Delivery record not found',
      });
    }

    // Ensure only the assigned traveller can advance delivery
    if (
      !request.assignedTraveller ||
      request.assignedTraveller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the assigned traveller can update delivery progress',
      });
    }

    let nextStatus;

    if (request.status === 'ACCEPTED') {
      nextStatus = 'PICKED_UP';
      request.pickedUpAt = new Date();
    } else if (request.status === 'PICKED_UP') {
      nextStatus = 'IN_TRANSIT';
    } else if (request.status === 'IN_TRANSIT') {
      // Handover OTP validation required
      if (!otp || otp.trim() !== request.otp.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid delivery verification OTP. Please verify with customer at handover.',
        });
      }
      nextStatus = 'DELIVERED';
      request.deliveredAt = new Date();
    } else {
      return res.status(400).json({
        status: 'error',
        message: `Cannot advance delivery with current status: ${request.status}`,
      });
    }

    request.status = nextStatus;
    await request.save();

    // If delivered: credit reward to traveller profile & create transaction ledger entry
    if (nextStatus === 'DELIVERED') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { completedDeliveries: 1 },
      });

      await Transaction.create({
        user: req.user._id,
        request: request._id,
        amount: request.rewardFee,
        title: `Commute Reward: ${request.title}`,
        type: 'COMMUTE_REWARD',
      });
    }

    res.json({
      status: 'success',
      message: `Delivery status updated to ${nextStatus}`,
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active deliveries currently being carried by the logged-in traveller
// @route   GET /api/deliveries/active
// @access  Private
exports.getActiveDeliveries = async (req, res, next) => {
  try {
    const active = await Request.find({
      assignedTraveller: req.user._id,
      status: { $in: ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'] },
    })
      .populate('customer', 'name phone college rating')
      .sort({ acceptedAt: -1 });

    res.json({
      status: 'success',
      count: active.length,
      data: { deliveries: active },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get traveller's completed deliveries and earnings summary
// @route   GET /api/deliveries/earnings
// @access  Private
exports.getEarnings = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const totalEarned = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    res.json({
      status: 'success',
      data: {
        totalEarned,
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};
