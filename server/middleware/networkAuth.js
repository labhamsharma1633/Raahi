// Network-Aware Authorization Middleware
// Enforces that users can only access or publish to networks they are legitimately enrolled in

/**
 * Ensures user has an active membership in the required network scope ('CAMPUS' or 'COMMUNITY').
 * @param {('CAMPUS'|'COMMUNITY')} requiredScope
 */
exports.requireNetwork = (requiredScope) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    if (requiredScope === 'CAMPUS') {
      const campus = req.user.campusMembership;
      if (!campus || !campus.enrolled) {
        return res.status(403).json({
          status: 'error',
          code: 'CAMPUS_MEMBERSHIP_REQUIRED',
          message: 'You must join Raahi Campus to access campus-only errands and routes.',
        });
      }

      // Check campus eligibility status
      if (campus.eligibilityStatus !== 'verified' && campus.eligibilityStatus !== 'pending') {
        return res.status(403).json({
          status: 'error',
          code: 'CAMPUS_ELIGIBILITY_UNVERIFIED',
          message: 'Your campus eligibility has not been verified yet.',
        });
      }
    }

    if (requiredScope === 'COMMUNITY') {
      const community = req.user.communityMembership;
      if (community && community.enrolled === false) {
        return res.status(403).json({
          status: 'error',
          code: 'COMMUNITY_MEMBERSHIP_REQUIRED',
          message: 'Access to the India-wide community network is not enabled on your profile.',
        });
      }
    }

    next();
  };
};
