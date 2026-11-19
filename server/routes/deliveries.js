// Delivery Routes
const express = require('express');
const router = express.Router();
const {
  acceptRequest,
  advanceDelivery,
  getActiveDeliveries,
  getEarnings,
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');

router.get('/active', protect, getActiveDeliveries);
router.get('/earnings', protect, getEarnings);
router.post('/:id/accept', protect, acceptRequest);
router.post('/:id/advance', protect, advanceDelivery);

module.exports = router;
