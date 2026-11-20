// Circle Model — Trusted Community Groups (Hostel/PG, Office, Society, College, etc.)
const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the Circle'],
      trim: true,
      maxlength: [80, 'Circle name cannot exceed 80 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a brief description of this Circle'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: [
        'HOSTEL_PG',
        'OFFICE',
        'SOCIETY_APARTMENT',
        'COLLEGE',
        'NEIGHBOURHOOD',
        'CUSTOM',
      ],
      required: [true, 'Please select a Circle type'],
      default: 'NEIGHBOURHOOD',
    },
    coverGradient: {
      type: String,
      default: 'teal', // teal | amber | indigo | emerald | rose | violet
    },
    approximateArea: {
      type: String,
      required: [true, 'Please provide an approximate locality/area (e.g., Sector 14, Whitefield)'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide the city'],
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visibility: {
      type: String,
      enum: ['PUBLIC_DISCOVERABLE', 'PRIVATE_INVITE_ONLY'],
      default: 'PUBLIC_DISCOVERABLE',
      index: true,
    },
    membershipRules: {
      type: String,
      default: 'Be respectful, support nearby peers with errands, and coordinate shopping responsibly.',
      trim: true,
    },
    inviteCode: {
      type: String,
      default: () => Math.random().toString(36).substring(2, 8).toUpperCase(),
      index: true,
    },
    inviteExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
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

circleSchema.index({ city: 1, type: 1, visibility: 1 });
circleSchema.index({ approximateArea: 'text', name: 'text' });

module.exports = mongoose.model('Circle', circleSchema);
