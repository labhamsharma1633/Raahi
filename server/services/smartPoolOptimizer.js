// SmartPool Optimizer Service
// Multi-stop route optimization with precedence constraints (Pickup strictly before Dropoff),
// Indian road network tortuosity factor (1.35x), capacity limits, and deterministic branch evaluation.

const { calculateRoadDistanceMeters } = require('./matchingService');

/**
 * Returns average travel speed in meters per second by transport mode.
 */
function getTravelSpeedMps(travelMode) {
  switch (travelMode) {
    case 'Bicycle':
      return 14 * (1000 / 3600); // ~3.89 m/s
    case 'E-Rickshaw':
      return 18 * (1000 / 3600); // ~5.00 m/s
    case 'Shared Auto':
      return 25 * (1000 / 3600); // ~6.94 m/s
    case 'Metro / Train':
      return 35 * (1000 / 3600); // ~9.72 m/s
    case 'Car / Bike':
      return 30 * (1000 / 3600); // ~8.33 m/s
    case 'Walking':
    default:
      return 4.5 * (1000 / 3600); // ~1.25 m/s
  }
}

/**
 * Max parcels allowed based on traveller capacity specification.
 */
function getMaxConcurrentParcels(capacityString) {
  const cap = (capacityString || '').toLowerCase();
  if (cap.includes('car') || cap.includes('trunk')) return 6;
  if (cap.includes('bike') || cap.includes('rack')) return 4;
  if (cap.includes('backpack')) return 3;
  if (cap.includes('pocket') || cap.includes('hand')) return 1;
  return 2; // Default bag
}

/**
 * Generates all valid permutations of intermediate stops where Pickup(i) strictly precedes Delivery(i).
 * For K requests (2K stops), there are exactly (2K)! / (2^K) valid permutations.
 * K=1: 1 permutation
 * K=2: 6 permutations
 * K=3: 90 permutations
 * K=4: 2,520 permutations
 */
function generatePrecedencePermutations(requests) {
  const stops = [];
  requests.forEach((req, idx) => {
    stops.push({
      reqIndex: idx,
      stopType: 'PICKUP',
      request: req,
      location: req.pickupLocation,
      locationName: req.storeOrPickup || req.pickupLocation?.name || 'Pickup Point',
      address: req.pickupLocation?.formattedAddress || '',
      itemSummary: req.title || req.items?.map((i) => i.name).join(', ') || 'Package',
      rewardFee: req.rewardFee || 0,
    });
    stops.push({
      reqIndex: idx,
      stopType: 'DELIVERY',
      request: req,
      location: req.destinationLocation,
      locationName: req.destination || req.destinationLocation?.name || 'Delivery Point',
      address: req.destinationLocation?.formattedAddress || '',
      itemSummary: req.title || 'Delivery Package',
      rewardFee: req.rewardFee || 0,
      otpCode: req.otp,
    });
  });

  const results = [];
  const pickedUp = new Set();
  const used = new Array(stops.length).fill(false);

  function backtrack(current) {
    if (current.length === stops.length) {
      results.push([...current]);
      return;
    }

    for (let i = 0; i < stops.length; i++) {
      if (used[i]) continue;
      const candidate = stops[i];

      // Precedence Constraint: Delivery is only allowed if corresponding Pickup is already added
      if (candidate.stopType === 'DELIVERY' && !pickedUp.has(candidate.reqIndex)) {
        continue;
      }

      used[i] = true;
      if (candidate.stopType === 'PICKUP') pickedUp.add(candidate.reqIndex);
      current.push(candidate);

      backtrack(current);

      current.pop();
      if (candidate.stopType === 'PICKUP') pickedUp.delete(candidate.reqIndex);
      used[i] = false;
    }
  }

  backtrack([]);
  return results;
}

/**
 * Optimizes an arbitrary set of 1 to 4 requests along a commute journey.
 */
function optimizeSmartPool(origin, destination, requests, options = {}) {
  if (!origin || !destination || !requests || requests.length === 0) {
    throw new Error('Origin, destination and at least one request are required.');
  }

  if (requests.length > 4) {
    throw new Error('Smart Pool currently supports a maximum of 4 concurrent delivery requests.');
  }

  const travelMode = options.travelMode || 'Walking';
  const speedMps = getTravelSpeedMps(travelMode);
  const maxDetourMeters = Number(options.maxDetourMeters) || 1500;
  const maxDetourMinutes = Number(options.maxDetourMinutes) || 25;
  const maxCapacity = getMaxConcurrentParcels(options.availableCapacity);

  const oLat = origin.latitude;
  const oLng = origin.longitude;
  const dLat = destination.latitude;
  const dLng = destination.longitude;

  if (oLat == null || oLng == null || dLat == null || dLng == null) {
    throw new Error('Valid geographical coordinates for Origin and Destination are required.');
  }

  const directDistanceMeters =
    calculateRoadDistanceMeters(oLat, oLng, dLat, dLng) || 2000;
  const directTimeMinutes = Math.max(1, Math.round(directDistanceMeters / speedMps / 60));

  // Generate all valid topological orderings
  const candidatePermutations = generatePrecedencePermutations(requests);

  let bestPermutation = null;
  let bestPooledDistance = Infinity;

  for (const perm of candidatePermutations) {
    // Check capacity constraint along the sequence
    let currentCarrying = 0;
    let capacityViolated = false;

    for (const stop of perm) {
      if (stop.stopType === 'PICKUP') currentCarrying++;
      else if (stop.stopType === 'DELIVERY') currentCarrying--;

      if (currentCarrying > maxCapacity) {
        capacityViolated = true;
        break;
      }
    }

    if (capacityViolated) continue;

    // Calculate total sequence distance: Origin -> S1 -> S2 ... -> Sk -> Destination
    let totalDist = 0;
    let prevLat = oLat;
    let prevLng = oLng;
    let validCoords = true;

    for (const stop of perm) {
      const sLat = stop.location?.latitude;
      const sLng = stop.location?.longitude;
      if (sLat == null || sLng == null) {
        validCoords = false;
        break;
      }
      const legDist = calculateRoadDistanceMeters(prevLat, prevLng, sLat, sLng);
      if (legDist == null) {
        validCoords = false;
        break;
      }
      totalDist += legDist;
      prevLat = sLat;
      prevLng = sLng;
    }

    if (!validCoords) continue;

    // Last leg to destination
    const finalLeg = calculateRoadDistanceMeters(prevLat, prevLng, dLat, dLng);
    if (finalLeg == null) continue;
    totalDist += finalLeg;

    if (totalDist < bestPooledDistance) {
      bestPooledDistance = totalDist;
      bestPermutation = perm;
    }
  }

  // If no capacity-satisfying permutation was found, fallback to the lowest distance permutation
  if (!bestPermutation && candidatePermutations.length > 0) {
    for (const perm of candidatePermutations) {
      let totalDist = 0;
      let prevLat = oLat;
      let prevLng = oLng;
      let validCoords = true;

      for (const stop of perm) {
        const sLat = stop.location?.latitude;
        const sLng = stop.location?.longitude;
        if (sLat == null || sLng == null) {
          validCoords = false;
          break;
        }
        const legDist = calculateRoadDistanceMeters(prevLat, prevLng, sLat, sLng);
        if (legDist == null) {
          validCoords = false;
          break;
        }
        totalDist += legDist;
        prevLat = sLat;
        prevLng = sLng;
      }

      if (!validCoords) continue;
      const finalLeg = calculateRoadDistanceMeters(prevLat, prevLng, dLat, dLng);
      if (finalLeg == null) continue;
      totalDist += finalLeg;

      if (totalDist < bestPooledDistance) {
        bestPooledDistance = totalDist;
        bestPermutation = perm;
      }
    }
  }

  if (!bestPermutation) {
    throw new Error('Unable to compute feasible route: missing valid coordinate data.');
  }

  const detourDistanceMeters = Math.max(0, bestPooledDistance - directDistanceMeters);
  const extraTravelMinutes = Math.round(detourDistanceMeters / speedMps / 60);
  const handoverBufferMinutes = bestPermutation.length * 3; // 3 minutes buffer per errand stop
  const detourTimeMinutes = Math.max(3, extraTravelMinutes + handoverBufferMinutes);
  const pooledTimeMinutes = directTimeMinutes + detourTimeMinutes;

  const totalCombinedReward = requests.reduce((sum, r) => sum + (Number(r.rewardFee) || 0), 0);
  const platformFee = 0; // Raahi peer-to-peer 100% direct reward model
  const netTravellerEarnings = totalCombinedReward;

  const isDetourFeasible = detourDistanceMeters <= maxDetourMeters;
  const isTimeFeasible = detourTimeMinutes <= maxDetourMinutes;
  const isFeasible = isDetourFeasible && isTimeFeasible;

  // Match score algorithm (0 - 100)
  const detourRatio = Math.min(1.5, detourDistanceMeters / Math.max(1, maxDetourMeters));
  const timeRatio = Math.min(1.5, detourTimeMinutes / Math.max(1, maxDetourMinutes));
  const penalty = detourRatio * 30 + timeRatio * 20;
  const rewardBonus = Math.min(25, (totalCombinedReward / 60) * 10);
  const matchScore = Math.max(40, Math.min(99, Math.round(92 - penalty + rewardBonus)));

  // Build the complete stops array
  const stops = [];

  // Stop 0: Origin
  stops.push({
    sequenceOrder: 0,
    stopType: 'ORIGIN',
    requestId: null,
    locationName: origin.name || 'My Origin',
    address: origin.formattedAddress || origin.address || '',
    coordinates: {
      latitude: oLat,
      longitude: oLng,
    },
    itemSummary: 'Start Commute Journey',
    rewardFee: 0,
    status: 'COMPLETED',
  });

  // Intermediate Stops
  bestPermutation.forEach((s, idx) => {
    const req = s.request;
    const isPickup = s.stopType === 'PICKUP';
    stops.push({
      sequenceOrder: idx + 1,
      stopType: s.stopType,
      requestId: req._id || req.id,
      customerName: req.customer?.name || (isPickup ? 'Sender / Store' : 'Recipient'),
      contactPhone: req.customer?.phone || '',
      locationName: isPickup
        ? req.storeOrPickup || req.pickupLocation?.name || 'Pickup Location'
        : req.destination || req.destinationLocation?.name || 'Dropoff Location',
      address: isPickup
        ? req.pickupLocation?.formattedAddress || ''
        : req.destinationLocation?.formattedAddress || '',
      coordinates: {
        latitude: s.location.latitude,
        longitude: s.location.longitude,
      },
      itemSummary: isPickup
        ? `Pick up: ${req.title || 'Order items'}`
        : `Deliver: ${req.title || 'Order items'} (Verify OTP)`,
      rewardFee: req.rewardFee || 0,
      otpCode: isPickup ? null : req.otp,
      status: 'PENDING',
    });
  });

  // Final Stop: Destination
  stops.push({
    sequenceOrder: stops.length,
    stopType: 'DESTINATION',
    requestId: null,
    locationName: destination.name || 'My Destination',
    address: destination.formattedAddress || destination.address || '',
    coordinates: {
      latitude: dLat,
      longitude: dLng,
    },
    itemSummary: 'Arrive at destination',
    rewardFee: 0,
    status: 'PENDING',
  });

  return {
    stops,
    metrics: {
      directDistanceMeters,
      pooledDistanceMeters: bestPooledDistance,
      detourDistanceMeters,
      directTimeMinutes,
      pooledTimeMinutes,
      detourTimeMinutes,
      totalCombinedReward,
      platformFee,
      netTravellerEarnings,
      matchScore,
      isFeasible,
      isDetourFeasible,
      isTimeFeasible,
      travelMode,
      stopsCount: stops.length,
      errandsCount: requests.length,
    },
  };
}

/**
 * Searches and bundles high-synergy multi-request combinations for a commute route.
 */
function findSmartPoolCandidates(route, openRequests, maxPoolSize = 3) {
  if (!route || !openRequests || openRequests.length === 0) {
    return { singleCandidates: [], bundledPools: [] };
  }

  const origin = route.originLocation;
  const destination = route.destinationLocation;

  if (!origin?.latitude || !destination?.latitude) {
    return { singleCandidates: [], bundledPools: [] };
  }

  // Filter requests matching network scope & basic sanity
  const eligibleRequests = openRequests.filter((req) => {
    if (req.status !== 'OPEN') return false;
    if (!req.pickupLocation?.latitude || !req.destinationLocation?.latitude) return false;

    // Network check
    if (route.networkScope === 'CAMPUS') {
      if (req.networkScope !== 'CAMPUS') return false;
      if (route.campusRef && req.campusRef && route.campusRef !== req.campusRef) return false;
    }
    return true;
  });

  if (eligibleRequests.length === 0) {
    return { singleCandidates: [], bundledPools: [] };
  }

  const options = {
    travelMode: route.travelMode,
    maxDetourMeters: route.maxDetourMeters,
    maxDetourMinutes: route.maxDetourMinutes,
    availableCapacity: route.availableCapacity,
  };

  // 1. Evaluate single candidates
  const singleCandidates = [];
  for (const req of eligibleRequests) {
    try {
      const opt = optimizeSmartPool(origin, destination, [req], options);
      if (opt.metrics.isFeasible) {
        singleCandidates.push({
          request: req,
          metrics: opt.metrics,
          stops: opt.stops,
        });
      }
    } catch (_err) {
      // Skip invalid single candidate
    }
  }

  singleCandidates.sort((a, b) => b.metrics.matchScore - a.metrics.matchScore);

  // 2. Evaluate 2-request combinations from top singles
  const bundledPools = [];
  const topSingles = singleCandidates.slice(0, 8);

  for (let i = 0; i < topSingles.length; i++) {
    for (let j = i + 1; j < topSingles.length; j++) {
      const rA = topSingles[i].request;
      const rB = topSingles[j].request;

      try {
        const poolOpt = optimizeSmartPool(origin, destination, [rA, rB], options);
        if (poolOpt.metrics.isFeasible) {
          bundledPools.push({
            requests: [rA, rB],
            requestIds: [rA._id || rA.id, rB._id || rB.id],
            metrics: poolOpt.metrics,
            stops: poolOpt.stops,
          });
        }
      } catch (_err) {
        // Skip invalid bundle
      }
    }
  }

  // 3. Evaluate 3-request combinations if maxPoolSize >= 3
  if (maxPoolSize >= 3 && topSingles.length >= 3) {
    for (let i = 0; i < Math.min(4, topSingles.length); i++) {
      for (let j = i + 1; j < Math.min(5, topSingles.length); j++) {
        for (let k = j + 1; k < Math.min(6, topSingles.length); k++) {
          const rA = topSingles[i].request;
          const rB = topSingles[j].request;
          const rC = topSingles[k].request;

          try {
            const poolOpt = optimizeSmartPool(origin, destination, [rA, rB, rC], options);
            if (poolOpt.metrics.isFeasible) {
              bundledPools.push({
                requests: [rA, rB, rC],
                requestIds: [rA._id || rA.id, rB._id || rB.id, rC._id || rC.id],
                metrics: poolOpt.metrics,
                stops: poolOpt.stops,
              });
            }
          } catch (_err) {
            // Skip invalid bundle
          }
        }
      }
    }
  }

  bundledPools.sort((a, b) => {
    // Prioritize high combined reward, then highest match score
    if (b.metrics.totalCombinedReward !== a.metrics.totalCombinedReward) {
      return b.metrics.totalCombinedReward - a.metrics.totalCombinedReward;
    }
    return b.metrics.matchScore - a.metrics.matchScore;
  });

  return {
    singleCandidates,
    bundledPools: bundledPools.slice(0, 10),
  };
}

module.exports = {
  getTravelSpeedMps,
  getMaxConcurrentParcels,
  generatePrecedencePermutations,
  optimizeSmartPool,
  findSmartPoolCandidates,
};
