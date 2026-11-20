// Circle Routes — Foundation, Discovery, Memberships & Permissions
const express = require('express');
const router = express.Router();
const {
  createCircle,
  getDiscoverableCircles,
  getMyCircles,
  getCircleById,
  requestJoinCircle,
  joinByInviteCode,
  generateInviteCode,
  getCircleMembers,
  getPendingRequests,
  handleMembershipRequest,
  updateMemberRole,
  removeMember,
  updateCircleSettings,
  toggleBreakMode,
} = require('../controllers/circleController');
const { protect } = require('../middleware/auth');
const {
  requireCircleMember,
  requireCircleAdmin,
  requireCircleOwner,
} = require('../middleware/circleAuth');

// Public / Authenticated Discovery
router.get('/discover', protect, getDiscoverableCircles);
router.get('/my', protect, getMyCircles);
router.post('/join-invite', protect, joinByInviteCode);
router.post('/', protect, createCircle);

// Circle-specific endpoints
router.get('/:id', protect, getCircleById);
router.post('/:id/request-join', protect, requestJoinCircle);
router.get('/:id/members', protect, requireCircleMember, getCircleMembers);
router.post('/:id/break-mode', protect, requireCircleMember, toggleBreakMode);

// Admin / Owner-specific endpoints
router.get('/:id/pending-requests', protect, requireCircleAdmin, getPendingRequests);
router.post('/:id/handle-request', protect, requireCircleAdmin, handleMembershipRequest);
router.post('/:id/invite/regenerate', protect, requireCircleAdmin, generateInviteCode);
router.put('/:id/settings', protect, requireCircleAdmin, updateCircleSettings);
router.put('/:id/member-role', protect, requireCircleAdmin, updateMemberRole);
router.delete('/:id/member/:userId', protect, removeMember);

module.exports = router;
