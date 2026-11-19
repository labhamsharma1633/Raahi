// User Model — Supports both Customer and Traveller roles on a single account
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Never return password in queries by default
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    college: {
      type: String,
      trim: true,
      default: 'India Commute Community',
    },
    city: {
      type: String,
      trim: true,
      default: 'All India',
    },
    // User can seamlessly switch between roles on the same profile
    defaultRole: {
      type: String,
      enum: ['customer', 'traveller'],
      default: 'customer',
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating cannot be below 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    verified: {
      type: Boolean,
      default: true,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
    requestedErrands: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if it has been modified (async function in Mongoose 8+ doesn't take next)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Transform output to strip sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
