// Auth & Profile Routes
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateMe, 
  switchNetworkPreference, 
  enrollCampus 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/network-preference', protect, switchNetworkPreference);
router.post('/campus/enroll', protect, enrollCampus);

module.exports = router;
