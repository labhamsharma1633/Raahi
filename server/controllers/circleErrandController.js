// CircleErrand Controller — Quick Local Peer Errands lifecycle & atomic assignment
const CircleErrand = require('../models/CircleErrand');
const CircleMember = require('../models/CircleMember');
const mongoose = require('mongoose');

const PROHIBITED_KEYWORDS = [
  'alcohol',
  'beer',
  'wine',
  'whiskey',
  'vodka',
  'liquor',
  'cigarette',
  'tobacco',
  'gutkha',
  'vape',
  'e-cig',
  'hookah',
  'drug',
  'narcotic',
  'weed',
  'cannabis',
  'weapon',
  'knife',
  'gun',
  'firearm',
  'explosive',
];

function containsProhibitedItems(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return PROHIBITED_KEYWORDS.some((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(lower);
  });
}

/**
 * POST /api/circle-errands
 * Post a new Quick Errand in the Circle.
 */
exports.createErrand = async (req, res) => {
  try {
    const {
      circleId,
      title,
      description,
      category,
      quantity,
      itemBudget,
      rewardFee,
      pickupLocationName,
      pickupAddress,
      handoverLocationName,
      handoverAddress,
      deadline,
      additionalInstructions,
    } = req.body;

    if (!circleId || !title || !itemBudget || !pickupLocationName || !handoverLocationName) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, budget, pickup spot and handover location are required',
      });
    }

    // Safety & prohibited item validation
    const fullText = `${title} ${description || ''} ${additionalInstructions || ''}`;
    if (containsProhibitedItems(fullText)) {
      return res.status(400).json({
        status: 'error',
        message: 'Security Policy: Requests for alcohol, tobacco, regulated substances, or dangerous items are strictly prohibited on Raahi Circles.',
      });
    }

    const normalizedCategory = (category || 'FOOD_BEVERAGE').toUpperCase();
    const validCategories = ['FOOD_BEVERAGE', 'GROCERY', 'PHARMACY', 'STATIONERY', 'PARCEL_PICKUP', 'OTHER'];
    const safeCategory = validCategories.includes(normalizedCategory) ? normalizedCategory : 'OTHER';

    const errand = await CircleErrand.create({
      circleId,
      requester: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: safeCategory,
      quantity: Number(quantity) || 1,
      itemBudget: Number(itemBudget),
      rewardFee: Number(rewardFee) || 0,
      pickupLocationName: pickupLocationName.trim(),
      pickupAddress: pickupAddress ? pickupAddress.trim() : '',
      handoverLocationName: handoverLocationName.trim(),
      handoverAddress: handoverAddress ? handoverAddress.trim() : '',
      deadline: deadline ? deadline.trim() : 'Within 1 hour',
      additionalInstructions: additionalInstructions ? additionalInstructions.trim() : '',
      status: 'OPEN',
    });

    res.status(201).json({
      status: 'success',
      message: 'Quick Errand posted to your Circle!',
      data: {
        errand: {
          ...errand.toObject(),
          id: errand._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('createErrand error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/circle-errands/circle/:circleId
 * Get errands for a specific Circle.
 */
exports.getCircleErrands = async (req, res) => {
  try {
    const { circleId } = req.params;
    const { filter = 'OPEN' } = req.query; // 'OPEN' | 'ACTIVE' | 'MINE' | 'HELPING' | 'COMPLETED' | 'ALL'

    const query = { circleId };

    if (filter === 'OPEN') {
      query.status = 'OPEN';
    } else if (filter === 'ACTIVE') {
      query.status = { $in: ['ACCEPTED', 'IN_PROGRESS', 'PURCHASED', 'HANDED_OVER'] };
    } else if (filter === 'MINE') {
      query.requester = req.user._id;
    } else if (filter === 'HELPING') {
      query.helper = req.user._id;
    } else if (filter === 'COMPLETED') {
      query.status = 'COMPLETED';
    }

    const errands = await CircleErrand.find(query)
      .populate('requester', 'name college city rating')
      .populate('helper', 'name college city rating')
      .sort({ createdAt: -1 })
      .lean();

    // Mask OTP code unless current user is the requester
    const sanitized = errands.map((e) => {
      const isMyRequest = e.requester?._id?.toString() === req.user._id.toString();
      const obj = {
        ...e,
        id: e._id.toString(),
        isRequester: isMyRequest,
        isHelper: e.helper?._id?.toString() === req.user._id.toString(),
      };
      if (!isMyRequest) {
        delete obj.handoverOtp;
      }
      return obj;
    });

    res.json({
      status: 'success',
      count: sanitized.length,
      data: { errands: sanitized },
    });
  } catch (error) {
    console.error('getCircleErrands error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/circle-errands/:id
 * Get single errand details.
 */
exports.getErrandById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid errand ID' });
    }

    const errand = await CircleErrand.findById(id)
      .populate('requester', 'name phone college city rating')
      .populate('helper', 'name phone college city rating')
      .lean();

    if (!errand) {
      return res.status(404).json({ status: 'error', message: 'Errand not found' });
    }

    // Security check: Must be member of the Circle
    const membership = await CircleMember.findOne({
      circleId: errand.circleId,
      userId: req.user._id,
      status: 'ACTIVE',
    });

    if (!membership) {
      return res.status(403).json({ status: 'error', message: 'Access denied: You are not a member of this Circle' });
    }

    const isRequester = errand.requester?._id?.toString() === req.user._id.toString();
    const isHelper = errand.helper?._id?.toString() === req.user._id.toString();

    // Sanitize OTP: only visible to the requester
    const result = {
      ...errand,
      id: errand._id.toString(),
      isRequester,
      isHelper,
    };

    if (!isRequester) {
      delete result.handoverOtp;
    }

    // Only expose phone if assigned and active
    const canSeeContact = isRequester || isHelper;
    if (!canSeeContact) {
      if (result.requester) delete result.requester.phone;
      if (result.helper) delete result.helper.phone;
    }

    res.json({
      status: 'success',
      data: { errand: result },
    });
  } catch (error) {
    console.error('getErrandById error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circle-errands/:id/accept
 * Atomic acceptance: Only one member can accept; cannot accept own errand.
 */
exports.acceptErrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid errand ID' });
    }

    // Step 1: Pre-check errand exists and user is not requester
    const errand = await CircleErrand.findById(id);
    if (!errand) {
      return res.status(404).json({ status: 'error', message: 'Errand not found' });
    }

    if (errand.requester.toString() === req.user._id.toString()) {
      return res.status(400).json({ status: 'error', message: 'You cannot accept your own errand request' });
    }

    // Step 2: Atomic conditional update
    const updated = await CircleErrand.findOneAndUpdate(
      {
        _id: id,
        status: 'OPEN',
      },
      {
        $set: {
          status: 'ACCEPTED',
          helper: req.user._id,
          acceptedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate('requester', 'name college city')
      .populate('helper', 'name college city');

    if (!updated) {
      return res.status(409).json({
        status: 'error',
        message: 'Conflict: This errand was just accepted by another Circle member.',
      });
    }

    res.json({
      status: 'success',
      message: 'You have accepted this errand! Coordinate pickup and handover.',
      data: {
        errand: {
          ...updated.toObject(),
          id: updated._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('acceptErrand error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circle-errands/:id/advance
 * Advances lifecycle: ACCEPTED -> IN_PROGRESS -> PURCHASED -> HANDED_OVER -> COMPLETED
 */
exports.advanceErrandStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { nextStatus, otpCode, receiptProof } = req.body;

    const errand = await CircleErrand.findById(id);
    if (!errand) {
      return res.status(404).json({ status: 'error', message: 'Errand not found' });
    }

    const isHelper = errand.helper && errand.helper.toString() === req.user._id.toString();
    const isRequester = errand.requester.toString() === req.user._id.toString();

    if (!isHelper && !isRequester) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized to advance this errand' });
    }

    const currentStatus = errand.status;

    // Define valid transitions
    const validTransitions = {
      ACCEPTED: 'IN_PROGRESS',
      IN_PROGRESS: 'PURCHASED',
      PURCHASED: 'HANDED_OVER',
      HANDED_OVER: 'COMPLETED',
    };

    const expectedNext = validTransitions[currentStatus];

    if (!expectedNext) {
      return res.status(400).json({
        status: 'error',
        message: `Errand is in ${currentStatus} state and cannot be advanced further.`,
      });
    }

    if (nextStatus && nextStatus !== expectedNext) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid state transition: cannot jump from ${currentStatus} to ${nextStatus}.`,
      });
    }

    // Step verification
    if (expectedNext === 'IN_PROGRESS') {
      if (!isHelper) return res.status(403).json({ status: 'error', message: 'Only the helper can mark errand in progress' });
      errand.status = 'IN_PROGRESS';
    } else if (expectedNext === 'PURCHASED') {
      if (!isHelper) return res.status(403).json({ status: 'error', message: 'Only the helper can mark items as purchased' });
      errand.status = 'PURCHASED';
      errand.purchasedAt = new Date();
      if (receiptProof) errand.receiptProof = receiptProof.trim();
    } else if (expectedNext === 'HANDED_OVER') {
      if (!isHelper) return res.status(403).json({ status: 'error', message: 'Only the helper can declare handover ready' });
      errand.status = 'HANDED_OVER';
      errand.handedOverAt = new Date();
    } else if (expectedNext === 'COMPLETED') {
      // Handover OTP verification
      if (!otpCode || otpCode.toString().trim() !== errand.handoverOtp.trim()) {
        errand.otpAttempts += 1;
        await errand.save();

        if (errand.otpAttempts >= 5) {
          return res.status(429).json({
            status: 'error',
            message: 'Too many incorrect OTP attempts. Please contact the requester directly.',
          });
        }

        return res.status(400).json({
          status: 'error',
          message: `Incorrect 4-digit handover verification code. Ask the requester for the code displayed on their screen. (Attempt ${errand.otpAttempts}/5)`,
        });
      }

      errand.status = 'COMPLETED';
      errand.completedAt = new Date();
    }

    await errand.save();

    res.json({
      status: 'success',
      message: `Errand updated to ${errand.status}!`,
      data: {
        errand: {
          ...errand.toObject(),
          id: errand._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('advanceErrandStatus error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circle-errands/:id/cancel
 * Cancel errand: Requester can cancel before purchase; Helper can release if accepted.
 */
exports.cancelErrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const errand = await CircleErrand.findById(id);
    if (!errand) {
      return res.status(404).json({ status: 'error', message: 'Errand not found' });
    }

    const isRequester = errand.requester.toString() === req.user._id.toString();
    const isHelper = errand.helper && errand.helper.toString() === req.user._id.toString();

    if (!isRequester && !isHelper) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized to cancel this errand' });
    }

    if (['PURCHASED', 'HANDED_OVER', 'COMPLETED'].includes(errand.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel an errand after items have already been purchased. Use dispute if there is an issue.',
      });
    }

    if (isHelper && errand.status === 'ACCEPTED') {
      // Helper releasing task: reopen for other circle members
      errand.status = 'OPEN';
      errand.helper = null;
      errand.acceptedAt = null;
      await errand.save();

      return res.json({
        status: 'success',
        message: 'You have released this task. It is now open again for other Circle members.',
        data: { errand },
      });
    }

    errand.status = 'CANCELLED';
    errand.cancelledAt = new Date();
    errand.cancellationReason = reason ? reason.trim() : 'Cancelled by user';
    await errand.save();

    res.json({
      status: 'success',
      message: 'Errand has been cancelled.',
      data: { errand },
    });
  } catch (error) {
    console.error('cancelErrand error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
