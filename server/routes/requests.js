// Request Routes
const express = require('express');
const router = express.Router();
const {
  createRequest,
  getOpenRequests,
  getMyRequests,
  getRequestById,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createRequest)
  .get(getOpenRequests);

router.get('/my', protect, getMyRequests);
router.get('/:id', getRequestById);
router.patch('/:id/cancel', protect, cancelRequest);

module.exports = router;
