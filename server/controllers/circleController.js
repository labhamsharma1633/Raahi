// Circle Controller — Foundation, Discovery, Memberships & Permissions
const Circle = require('../models/Circle');
const CircleMember = require('../models/CircleMember');
const mongoose = require('mongoose');

/**
 * POST /api/circles
 * Create a new Circle. The creator is automatically assigned as OWNER.
 */
exports.createCircle = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      approximateArea,
      city,
      state,
      visibility,
      membershipRules,
      coverGradient,
    } = req.body;

    if (!name || !description || !approximateArea || !city) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, description, approximate area and city are required',
      });
    }

    const circle = await Circle.create({
      name: name.trim(),
      description: description.trim(),
      type: type || 'NEIGHBOURHOOD',
      approximateArea: approximateArea.trim(),
      city: city.trim(),
      state: state ? state.trim() : '',
      visibility: visibility || 'PUBLIC_DISCOVERABLE',
      membershipRules: membershipRules || 'Be respectful, support nearby peers, and coordinate shopping responsibly.',
      coverGradient: coverGradient || 'teal',
      creator: req.user._id,
      memberCount: 1,
    });

    // Create OWNER membership
    const ownerMembership = await CircleMember.create({
      circleId: circle._id,
      userId: req.user._id,
      role: 'OWNER',
      status: 'ACTIVE',
      joinMethod: 'CREATOR',
    });

    res.status(201).json({
      status: 'success',
      message: 'Circle created successfully!',
      data: {
        circle,
        membership: ownerMembership,
      },
    });
  } catch (error) {
    console.error('createCircle error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/circles/discover
 * Discover public circles by city, type, or area search query.
 */
exports.getDiscoverableCircles = async (req, res) => {
  try {
    const { city, type, q } = req.query;

    const filter = {
      isActive: true,
      visibility: 'PUBLIC_DISCOVERABLE',
    };

    if (city && city.trim() !== '') {
      filter.city = new RegExp(city.trim(), 'i');
    }

    if (type && type !== 'ALL') {
      filter.type = type;
    }

    if (q && q.trim() !== '') {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { approximateArea: searchRegex },
        { description: searchRegex },
      ];
    }

    const circles = await Circle.find(filter)
      .select('-inviteCode') // Never leak invite codes publicly
      .sort({ memberCount: -1, createdAt: -1 })
      .limit(30)
      .lean();

    // Check current user's membership status for each circle
    let userMemberships = [];
    if (req.user) {
      const circleIds = circles.map((c) => c._id);
      userMemberships = await CircleMember.find({
        circleId: { $in: circleIds },
        userId: req.user._id,
      }).lean();
    }

    const membershipMap = {};
    userMemberships.forEach((m) => {
      membershipMap[m.circleId.toString()] = m.status;
    });

    const enriched = circles.map((c) => ({
      ...c,
      id: c._id.toString(),
      myStatus: membershipMap[c._id.toString()] || 'NOT_JOINED',
    }));

    res.json({
      status: 'success',
      count: enriched.length,
      data: { circles: enriched },
    });
  } catch (error) {
    console.error('getDiscoverableCircles error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/circles/my
 * Get all circles where the current user is an active member or has a pending request.
 */
exports.getMyCircles = async (req, res) => {
  try {
    const memberships = await CircleMember.find({
      userId: req.user._id,
      status: { $in: ['ACTIVE', 'PENDING_APPROVAL'] },
    })
      .populate('circleId')
      .sort({ updatedAt: -1 })
      .lean();

    const activeCircles = [];
    const pendingCircles = [];

    memberships.forEach((m) => {
      if (!m.circleId) return;
      const item = {
        circle: {
          ...m.circleId,
          id: m.circleId._id.toString(),
        },
        membership: {
          id: m._id.toString(),
          role: m.role,
          status: m.status,
          breakMode: m.breakMode,
          joinedAt: m.joinedAt,
        },
      };

      if (m.status === 'ACTIVE') {
        activeCircles.push(item);
      } else if (m.status === 'PENDING_APPROVAL') {
        pendingCircles.push(item);
      }
    });

    res.json({
      status: 'success',
      data: {
        activeCircles,
        pendingCircles,
      },
    });
  } catch (error) {
    console.error('getMyCircles error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/circles/:id
 * Get single Circle details. Returns full data if member, or public preview if not.
 */
exports.getCircleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid Circle ID' });
    }

    const circle = await Circle.findById(id).lean();
    if (!circle || !circle.isActive) {
      return res.status(404).json({ status: 'error', message: 'Circle not found or inactive' });
    }

    // Check membership
    const membership = await CircleMember.findOne({
      circleId: circle._id,
      userId: req.user._id,
    }).lean();

    const isMember = membership && membership.status === 'ACTIVE';
    const isAdmin = isMember && ['OWNER', 'ADMIN'].includes(membership.role);

    // Sanitize invite code for non-admins
    if (!isAdmin) {
      delete circle.inviteCode;
      delete circle.inviteExpiresAt;
    }

    res.json({
      status: 'success',
      data: {
        circle: {
          ...circle,
          id: circle._id.toString(),
        },
        membership: membership
          ? {
              id: membership._id.toString(),
              role: membership.role,
              status: membership.status,
              breakMode: membership.breakMode,
            }
          : null,
        isMember,
        isAdmin,
      },
    });
  } catch (error) {
    console.error('getCircleById error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circles/:id/request-join
 * Request to join a public Circle (requires admin approval).
 */
exports.requestJoinCircle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid Circle ID' });
    }

    const circle = await Circle.findById(id);
    if (!circle || !circle.isActive) {
      return res.status(404).json({ status: 'error', message: 'Circle not found' });
    }

    if (circle.visibility === 'PRIVATE_INVITE_ONLY') {
      return res.status(403).json({
        status: 'error',
        message: 'This is a private Circle. You must use an invitation code to join.',
      });
    }

    const existingMembership = await CircleMember.findOne({
      circleId: circle._id,
      userId: req.user._id,
    });

    if (existingMembership) {
      if (existingMembership.status === 'ACTIVE') {
        return res.status(400).json({ status: 'error', message: 'You are already a member of this Circle.' });
      }
      if (existingMembership.status === 'PENDING_APPROVAL') {
        return res.status(400).json({ status: 'error', message: 'Your join request is already pending admin review.' });
      }
      if (existingMembership.status === 'BLOCKED') {
        return res.status(403).json({ status: 'error', message: 'You cannot join this Circle.' });
      }
    }

    const membership = await CircleMember.create({
      circleId: circle._id,
      userId: req.user._id,
      role: 'MEMBER',
      status: 'PENDING_APPROVAL',
      joinMethod: 'LOCATION_DISCOVERY',
    });

    res.status(201).json({
      status: 'success',
      message: 'Join request submitted! Circle admins have been notified.',
      data: { membership },
    });
  } catch (error) {
    console.error('requestJoinCircle error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circles/join-invite
 * Join a Circle directly using an invitation code.
 */
exports.joinByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode || typeof inviteCode !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Please provide a valid invitation code' });
    }

    const cleanCode = inviteCode.trim().toUpperCase();
    const circle = await Circle.findOne({
      inviteCode: cleanCode,
      isActive: true,
    });

    if (!circle) {
      return res.status(404).json({ status: 'error', message: 'Invalid or inactive invitation code' });
    }

    if (circle.inviteExpiresAt && new Date(circle.inviteExpiresAt) < new Date()) {
      return res.status(400).json({ status: 'error', message: 'This invitation code has expired. Ask an admin for a fresh code.' });
    }

    // Check existing membership
    let membership = await CircleMember.findOne({
      circleId: circle._id,
      userId: req.user._id,
    });

    if (membership) {
      if (membership.status === 'ACTIVE') {
        return res.status(400).json({ status: 'error', message: `You are already a member of ${circle.name}.` });
      }
      if (membership.status === 'BLOCKED') {
        return res.status(403).json({ status: 'error', message: 'Access to this Circle has been restricted.' });
      }

      // Convert pending to active immediately via valid invite code
      membership.status = 'ACTIVE';
      membership.joinMethod = 'INVITE_CODE';
      membership.joinedAt = new Date();
      await membership.save();
    } else {
      membership = await CircleMember.create({
        circleId: circle._id,
        userId: req.user._id,
        role: 'MEMBER',
        status: 'ACTIVE',
        joinMethod: 'INVITE_CODE',
      });
    }

    // Update member count
    const activeCount = await CircleMember.countDocuments({ circleId: circle._id, status: 'ACTIVE' });
    circle.memberCount = activeCount;
    await circle.save();

    res.json({
      status: 'success',
      message: `Welcome to ${circle.name}! You are now an active member.`,
      data: {
        circle: { ...circle.toObject(), id: circle._id.toString() },
        membership,
      },
    });
  } catch (error) {
    console.error('joinByInviteCode error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circles/:id/invite/regenerate
 * Admin action: Generate a fresh invite code and extend expiry.
 */
exports.generateInviteCode = async (req, res) => {
  try {
    const { id } = req.params;
    const circle = await Circle.findById(id);

    if (!circle) {
      return res.status(404).json({ status: 'error', message: 'Circle not found' });
    }

    circle.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    circle.inviteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await circle.save();

    res.json({
      status: 'success',
      message: 'Fresh invitation code generated.',
      data: {
        inviteCode: circle.inviteCode,
        inviteExpiresAt: circle.inviteExpiresAt,
      },
    });
  } catch (error) {
    console.error('generateInviteCode error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/circles/:id/members
 * Member action: Get list of active members in the circle (safe sanitized fields).
 */
exports.getCircleMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await CircleMember.find({
      circleId: id,
      status: 'ACTIVE',
    })
      .populate('userId', 'name email college city rating completedDeliveries')
      .sort({ role: 1, joinedAt: 1 })
      .lean();

    const sanitized = members.map((m) => ({
      id: m._id.toString(),
      role: m.role,
      joinedAt: m.joinedAt,
      breakMode: m.breakMode,
      user: {
        id: m.userId?._id?.toString() || '',
        name: m.userId?.name || 'Community Member',
        college: m.userId?.college || '',
        city: m.userId?.city || '',
        rating: m.userId?.rating || 5.0,
      },
    }));

    res.json({
      status: 'success',
      count: sanitized.length,
      data: { members: sanitized },
    });
  } catch (error) {
    console.error('getCircleMembers error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/circles/:id/pending-requests
 * Admin action: Get membership requests awaiting approval.
 */
exports.getPendingRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const pending = await CircleMember.find({
      circleId: id,
      status: 'PENDING_APPROVAL',
    })
      .populate('userId', 'name email college city')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      status: 'success',
      count: pending.length,
      data: {
        requests: pending.map((p) => ({
          membershipId: p._id.toString(),
          user: p.userId,
          createdAt: p.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('getPendingRequests error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circles/:id/handle-request
 * Admin action: Approve or reject a pending membership request.
 */
exports.handleMembershipRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { membershipId, action } = req.body; // action: 'APPROVE' | 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ status: 'error', message: 'Action must be APPROVE or REJECT' });
    }

    const membership = await CircleMember.findOne({
      _id: membershipId,
      circleId: id,
      status: 'PENDING_APPROVAL',
    });

    if (!membership) {
      return res.status(404).json({ status: 'error', message: 'Pending membership request not found' });
    }

    if (action === 'APPROVE') {
      membership.status = 'ACTIVE';
      membership.approvedBy = req.user._id;
      membership.joinedAt = new Date();
      await membership.save();

      // Increment member count
      const activeCount = await CircleMember.countDocuments({ circleId: id, status: 'ACTIVE' });
      await Circle.findByIdAndUpdate(id, { memberCount: activeCount });

      return res.json({
        status: 'success',
        message: 'Member approved and granted access to the Circle.',
        data: { membership },
      });
    } else {
      membership.status = 'REJECTED';
      await membership.save();

      return res.json({
        status: 'success',
        message: 'Membership request declined.',
      });
    }
  } catch (error) {
    console.error('handleMembershipRequest error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * PUT /api/circles/:id/member-role
 * Owner/Admin action: Promote/demote a member to/from ADMIN.
 */
exports.updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberUserId, newRole } = req.body;

    if (!['ADMIN', 'MEMBER'].includes(newRole)) {
      return res.status(400).json({ status: 'error', message: 'Role can only be ADMIN or MEMBER' });
    }

    const target = await CircleMember.findOne({ circleId: id, userId: memberUserId });
    if (!target) {
      return res.status(404).json({ status: 'error', message: 'Member not found in this Circle' });
    }

    if (target.role === 'OWNER') {
      return res.status(403).json({ status: 'error', message: 'Cannot modify Owner role' });
    }

    target.role = newRole;
    await target.save();

    res.json({
      status: 'success',
      message: `Role updated to ${newRole}`,
      data: { membership: target },
    });
  } catch (error) {
    console.error('updateMemberRole error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * DELETE /api/circles/:id/member/:userId
 * Admin action or self-leave: Remove a member from the Circle.
 */
exports.removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const isSelf = req.user._id.toString() === userId;
    const isAdmin = ['OWNER', 'ADMIN'].includes(req.circleMembership?.role);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized to remove this member' });
    }

    const target = await CircleMember.findOne({ circleId: id, userId });
    if (!target) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }

    if (target.role === 'OWNER') {
      return res.status(400).json({
        status: 'error',
        message: 'The Circle Owner cannot leave without transferring ownership first.',
      });
    }

    await CircleMember.findByIdAndDelete(target._id);

    const activeCount = await CircleMember.countDocuments({ circleId: id, status: 'ACTIVE' });
    await Circle.findByIdAndUpdate(id, { memberCount: activeCount });

    res.json({
      status: 'success',
      message: isSelf ? 'You have left the Circle.' : 'Member removed from Circle.',
    });
  } catch (error) {
    console.error('removeMember error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * PUT /api/circles/:id/settings
 * Admin action: Update circle details and visibility.
 */
exports.updateCircleSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, approximateArea, visibility, membershipRules, coverGradient } = req.body;

    const circle = await Circle.findById(id);
    if (!circle) {
      return res.status(404).json({ status: 'error', message: 'Circle not found' });
    }

    if (name) circle.name = name.trim();
    if (description) circle.description = description.trim();
    if (approximateArea) circle.approximateArea = approximateArea.trim();
    if (visibility) circle.visibility = visibility;
    if (membershipRules) circle.membershipRules = membershipRules.trim();
    if (coverGradient) circle.coverGradient = coverGradient;

    await circle.save();

    res.json({
      status: 'success',
      message: 'Circle settings updated.',
      data: { circle },
    });
  } catch (error) {
    console.error('updateCircleSettings error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/circles/:id/break-mode
 * Member action: Toggle Break Mode (helping availability).
 */
exports.toggleBreakMode = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, durationHours, note } = req.body;

    const membership = await CircleMember.findOne({
      circleId: id,
      userId: req.user._id,
      status: 'ACTIVE',
    });

    if (!membership) {
      return res.status(403).json({ status: 'error', message: 'You must be an active member to toggle Break Mode.' });
    }

    let until = null;
    if (enabled) {
      const hours = Number(durationHours) || 2;
      until = new Date(Date.now() + hours * 60 * 60 * 1000);
    }

    membership.breakMode = {
      enabled: Boolean(enabled),
      until,
      note: note ? note.trim() : (enabled ? 'Available to pick up small errands nearby' : ''),
    };

    await membership.save();

    res.json({
      status: 'success',
      message: enabled
        ? `Break Mode enabled until ${until.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : 'Break Mode turned off',
      data: { breakMode: membership.breakMode },
    });
  } catch (error) {
    console.error('toggleBreakMode error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
