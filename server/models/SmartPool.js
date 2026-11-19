// SmartPool Model — Multi-Stop Commute Delivery Pooling
const mongoose = require('mongoose');

const poolStopSchema = new mongoose.Schema(
  {
    sequenceOrder: { type: Number, required: true },
    stopType: {
      type: String,
      enum: ['ORIGIN', 'PICKUP', 'DELIVERY', 'DESTINATION'],
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
    },
    customerName: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    locationName: { type: String, required: true },
    address: { type: String, default: '' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    itemSummary: { type: String, default: '' },
    rewardFee: { type: Number, default: 0 },
    otpCode: { type: String, default: null }, // Required for verifying delivery handover
    status: {
      type: String,
      enum: ['PENDING', 'ARRIVED', 'COMPLETED', 'SKIPPED'],
      default: 'PENDING',
    },
    completedAt: { type: Date, default: null },
  },
  { _id: true }
);

const smartPoolSchema = new mongoose.Schema(
  {
    traveller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
      index: true,
    },
    networkScope: {
      type: String,
      enum: ['CAMPUS', 'COMMUNITY', 'ALL'],
      default: 'COMMUNITY',
      index: true,
    },
    campusRef: {
      type: String,
      default: null,
      index: true,
    },
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
      },
    ],
    stops: [poolStopSchema],
    activeStopIndex: {
      type: Number,
      default: 0,
    },
    metrics: {
      directDistanceMeters: { type: Number, required: true },
      pooledDistanceMeters: { type: Number, required: true },
      detourDistanceMeters: { type: Number, required: true },
      directTimeMinutes: { type: Number, required: true },
      pooledTimeMinutes: { type: Number, required: true },
      detourTimeMinutes: { type: Number, required: true },
      totalCombinedReward: { type: Number, required: true },
      platformFee: { type: Number, default: 0 },
      netTravellerEarnings: { type: Number, required: true },
      matchScore: { type: Number, default: 85 },
      capacityUsed: { type: String, default: 'Standard' },
    },
    status: {
      type: String,
      enum: ['DRAFT', 'CONFIRMED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    cancellationReason: { type: String, default: null },
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

smartPoolSchema.index({ traveller: 1, status: 1 });
smartPoolSchema.index({ route: 1, status: 1 });

module.exports = mongoose.model('SmartPool', smartPoolSchema);
