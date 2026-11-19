// SmartPool Routes — Multi-Stop Pooling Endpoints
const express = require('express');
const router = express.Router();
const {
  getCandidates,
  optimizePool,
  confirmPool,
  getActivePool,
  getPoolById,
  advanceStop,
  cancelPool,
} = require('../controllers/smartPoolController');
const { protect } = require('../middleware/auth');

router.get('/candidates', protect, getCandidates);
router.post('/optimize', protect, optimizePool);
router.post('/confirm', protect, confirmPool);
router.get('/active', protect, getActivePool);
router.get('/:id', protect, getPoolById);
router.post('/:id/advance-stop', protect, advanceStop);
router.post('/:id/cancel', protect, cancelPool);

module.exports = router;
