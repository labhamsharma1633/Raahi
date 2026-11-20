// CircleErrand Routes — Quick Peer Errands endpoints
const express = require('express');
const router = express.Router();
const {
  createErrand,
  getCircleErrands,
  getErrandById,
  acceptErrand,
  advanceErrandStatus,
  cancelErrand,
} = require('../controllers/circleErrandController');
const { protect } = require('../middleware/auth');
const { requireCircleMember } = require('../middleware/circleAuth');

router.post('/', protect, createErrand);
router.get('/circle/:circleId', protect, requireCircleMember, getCircleErrands);
router.get('/:id', protect, getErrandById);
router.post('/:id/accept', protect, acceptErrand);
router.post('/:id/advance', protect, advanceErrandStatus);
router.post('/:id/cancel', protect, cancelErrand);

module.exports = router;
