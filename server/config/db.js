// Database connection manager for MongoDB Atlas using Mongoose
const mongoose = require('mongoose');

let isConnected = false;
let isConnecting = false;
let lastDbError = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set. Database operations will be disabled.');
    lastDbError = new Error('MONGODB_URI environment variable is not defined on server');
    return false;
  }

  if (isConnecting) return false;
  isConnecting = true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });

    isConnected = true;
    lastDbError = null;
    console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err.message);
      isConnected = false;
      lastDbError = err;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected.');
      isConnected = false;
    });

    return true;
  } catch (error) {
    isConnected = false;
    lastDbError = error;
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  } finally {
    isConnecting = false;
  }
}

function getDatabaseStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const status = states[mongoose.connection.readyState] || 'unknown';

  // If disconnected and not connecting, trigger background reconnect attempt
  if (status === 'disconnected' && !isConnecting && process.env.MONGODB_URI) {
    connectDB().catch(() => {});
  }

  return {
    status,
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    error: lastDbError ? lastDbError.message : null,
  };
}

module.exports = { connectDB, getDatabaseStatus };
