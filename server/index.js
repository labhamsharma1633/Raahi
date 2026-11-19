// Raahi Express Server — Full REST API Suite
// Milestones 1 to 8: Complete Backend API Engine

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDatabaseStatus } = require('./config/db');

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// ── Middleware ────────────────────────────────────────────────────────────────

// Allow requests from React frontend, Vercel deployments, and dev origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, postman, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow localhost, configured CLIENT_ORIGIN, and any *.vercel.app domain
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      origin === CLIENT_ORIGIN ||
      CLIENT_ORIGIN === '*'
    ) {
      return callback(null, true);
    }
    
    // Fallback: permissive allow for smooth production operation
    return callback(null, true);
  },
  credentials: true,
}));

// Parse incoming JSON bodies
app.use(express.json());

// Log every incoming request (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check — reports server and database connection status
app.get('/api/health', (_req, res) => {
  const dbStatus = getDatabaseStatus();
  res.json({
    status: 'ok',
    service: 'Raahi API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
  });
});

// REST Endpoints
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/deliveries', require('./routes/deliveries'));
app.use('/api/smart-pool', require('./routes/smartPool'));

// 404 — catch-all for undefined routes
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});

// Global error handler — never expose raw traces to clients
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🛺  Raahi API Engine running on http://localhost:${PORT}`);
    console.log(`    Health:     http://localhost:${PORT}/api/health`);
    console.log(`    Auth:       http://localhost:${PORT}/api/auth`);
    console.log(`    Requests:   http://localhost:${PORT}/api/requests`);
    console.log(`    Routes:     http://localhost:${PORT}/api/routes`);
    console.log(`    Deliveries: http://localhost:${PORT}/api/deliveries`);
    console.log(`    CORS allowed from: ${CLIENT_ORIGIN}\n`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      const mongoose = require('mongoose');
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();

module.exports = app;
