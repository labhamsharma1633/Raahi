// Request Model — Delivery Errands (Buy & Deliver, Pickup & Deliver)
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    formattedAddress: { type: String, required: true },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    postalCode: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    placeId: { type: String, default: '' },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 1 },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['buy', 'pickup', 'BUY_AND_DELIVER', 'PICKUP_AND_DELIVER'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the request'],
      trim: true,
    },
    storeOrPickup: {
      type: String,
      required: true,
      trim: true,
    },
    pickupLocation: {
      type: locationSchema,
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    destinationLocation: {
      type: locationSchema,
      required: true,
    },
    items: [itemSchema],
    itemBudget: {
      type: Number,
      default: 0,
    },
    rewardFee: {
      type: Number,
      required: [true, 'Please specify travel reward fee (INR)'],
      min: [10, 'Minimum reward fee is ₹10'],
    },
    neededBy: {
      type: String,
      default: 'Within 1 hour',
    },
    notes: {
      type: String,
      default: '',
    },
    networkScope: {
      type: String,
      enum: ['COMMUNITY', 'CAMPUS', 'ALL'],
      default: 'COMMUNITY',
      index: true,
    },
    campusRef: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'OPEN',
        'ACCEPTED',
        'PICKED_UP',
        'IN_TRANSIT',
        'DELIVERED',
        'CANCELLED',
        'DISPUTED',
      ],
      default: 'OPEN',
      index: true,
    },
    otp: {
      type: String,
      required: true,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    assignedTraveller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    acceptedAt: { type: Date, default: null },
    pickedUpAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    cancellationReason: { type: String, default: '' },
    disputeReason: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast geo & status queries
requestSchema.index({ status: 1, createdAt: -1 });
requestSchema.index({ 'pickupLocation.city': 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
