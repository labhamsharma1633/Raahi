// CircleErrand Model — Quick Local Peer Errands inside a trusted Circle
const mongoose = require('mongoose');

const circleErrandSchema = new mongoose.Schema(
  {
    circleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Circle',
      required: true,
      index: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an item or errand title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: [
        'FOOD_BEVERAGE',
        'GROCERY',
        'PHARMACY',
        'STATIONERY',
        'PARCEL_PICKUP',
        'OTHER',
      ],
      default: 'FOOD_BEVERAGE',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
      max: [50, 'Quantity cannot exceed 50'],
    },
    itemBudget: {
      type: Number,
      required: [true, 'Please specify an estimated item budget (INR)'],
      min: [5, 'Minimum budget is ₹5'],
    },
    rewardFee: {
      type: Number,
      default: 0,
      min: [0, 'Reward fee cannot be negative'],
    },
    pickupLocationName: {
      type: String,
      required: [true, 'Please specify where to purchase or pick up the item'],
      trim: true,
    },
    pickupAddress: {
      type: String,
      default: '',
      trim: true,
    },
    handoverLocationName: {
      type: String,
      required: [true, 'Please specify your handover/drop-off spot (e.g. Hostel 4 Wing B, Floor 2)'],
      trim: true,
    },
    handoverAddress: {
      type: String,
      default: '',
      trim: true,
    },
    deadline: {
      type: String,
      default: 'Within 1 hour',
      trim: true,
    },
    additionalInstructions: {
      type: String,
      default: '',
      trim: true,
    },
    receiptProof: {
      type: String, // Optional receipt image / note URL
      default: null,
    },
    status: {
      type: String,
      enum: [
        'OPEN',
        'ACCEPTED',
        'IN_PROGRESS',
        'PURCHASED',
        'HANDED_OVER',
        'COMPLETED',
        'CANCELLED',
        'EXPIRED',
        'DISPUTED',
      ],
      default: 'OPEN',
      index: true,
    },
    // Secure 4-digit handover OTP
    handoverOtp: {
      type: String,
      required: true,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    acceptedAt: { type: Date, default: null },
    purchasedAt: { type: Date, default: null },
    handedOverAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    cancellationReason: { type: String, default: null },
    disputeReason: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : '';
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

circleErrandSchema.index({ circleId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('CircleErrand', circleErrandSchema);
