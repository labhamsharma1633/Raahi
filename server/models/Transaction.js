// Transaction / Earning Ledger Model
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['COMMUTE_REWARD', 'OFFSET_CREDIT', 'WITHDRAWAL'],
      default: 'COMMUTE_REWARD',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
