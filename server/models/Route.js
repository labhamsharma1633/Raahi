// Route Model — Planned Commute Journeys
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

const routeSchema = new mongoose.Schema(
  {
    traveller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    origin: {
      type: String,
      required: [true, 'Please provide journey starting point'],
      trim: true,
    },
    originLocation: {
      type: locationSchema,
      required: true,
    },
    destination: {
      type: String,
      required: [true, 'Please provide journey destination'],
      trim: true,
    },
    destinationLocation: {
      type: locationSchema,
      required: true,
    },
    travelDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    departureTime: {
      type: String,
      required: [true, 'Please specify estimated departure time'],
      trim: true,
    },
    travelMode: {
      type: String,
      enum: ['Walking', 'Bicycle', 'E-Rickshaw', 'Shared Auto', 'Metro / Train', 'Car / Bike'],
      default: 'Walking',
    },
    distanceKm: {
      type: Number,
      default: 0,
    },
    maxDetourMeters: {
      type: Number,
      default: 800,
      min: [100, 'Minimum detour tolerance is 100 meters'],
      max: [5000, 'Maximum detour tolerance is 5000 meters'],
    },
    maxDetourMinutes: {
      type: Number,
      default: 15,
      min: [5, 'Minimum detour time is 5 minutes'],
      max: [60, 'Maximum detour time is 60 minutes'],
    },
    availableCapacity: {
      type: String,
      default: 'Backpack (up to 3 kg)',
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
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

routeSchema.index({ active: 1, 'originLocation.city': 1 });

module.exports = mongoose.model('Route', routeSchema);
