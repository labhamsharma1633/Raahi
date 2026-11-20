// CircleMember Model — User Membership, Roles, Status and Break Mode
const mongoose = require('mongoose');

const circleMemberSchema = new mongoose.Schema(
  {
    circleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Circle',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['OWNER', 'ADMIN', 'MEMBER'],
      default: 'MEMBER',
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING_APPROVAL', 'BLOCKED', 'REJECTED'],
      default: 'ACTIVE',
      index: true,
    },
    joinMethod: {
      type: String,
      enum: ['CREATOR', 'INVITE_CODE', 'LOCATION_DISCOVERY'],
      default: 'LOCATION_DISCOVERY',
    },
    breakMode: {
      enabled: { type: Boolean, default: false },
      until: { type: Date, default: null },
      note: { type: String, default: '' },
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
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

// Prevent duplicate membership records for the same user in a Circle
circleMemberSchema.index({ circleId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CircleMember', circleMemberSchema);
