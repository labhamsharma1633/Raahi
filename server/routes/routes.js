// Routes Endpoints
const express = require('express');
const router = express.Router();
const {
  createRoute,
  getMyRoutes,
  getRouteMatches,
  deactivateRoute,
} = require('../controllers/routeController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createRoute);

router.get('/my', protect, getMyRoutes);
router.get('/:id/matches', protect, getRouteMatches);
router.patch('/:id/deactivate', protect, deactivateRoute);

module.exports = router;
