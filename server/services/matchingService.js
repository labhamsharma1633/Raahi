// Route Matching Engine Service
// Computes detour distance and time estimates using Haversine formula + ~1.35x Indian road network tortuosity factor.

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates estimated road distance between two coordinates in meters.
 */
function calculateRoadDistanceMeters(lat1, lon1, lat2, lon2) {
  if (
    lat1 === null ||
    lon1 === null ||
    lat2 === null ||
    lon2 === null ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return null;
  }

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const aerialKm = R * c;
  const roadKm = aerialKm * 1.35; // Standard Indian urban & arterial road factor

  return Math.round(roadKm * 1000);
}

/**
 * Evaluates candidate open requests against a traveller's commute route.
 */
function findMatches(route, requests) {
  if (!route || !requests || requests.length === 0) return [];

  const originLat = route.originLocation?.latitude;
  const originLng = route.originLocation?.longitude;
  const destLat = route.destinationLocation?.latitude;
  const destLng = route.destinationLocation?.longitude;

  if (originLat === null || destLat === null) return [];

  const directTripMeters =
    calculateRoadDistanceMeters(originLat, originLng, destLat, destLng) || 2000;

  // Travel speed in meters per second
  const speedMps =
    (route.travelMode === 'Bicycle'
      ? 14
      : route.travelMode === 'E-Rickshaw'
      ? 18
      : route.travelMode === 'Shared Auto'
      ? 25
      : 4.5) *
    (1000 / 3600);

  const maxDetourMeters = Number(route.maxDetourMeters) || 1200;
  const maxDetourMins = Number(route.maxDetourMinutes) || 20;

  const matches = [];

  for (const req of requests) {
    if (req.status !== 'OPEN') continue;

    const pLat = req.pickupLocation?.latitude;
    const pLng = req.pickupLocation?.longitude;
    const dLat = req.destinationLocation?.latitude;
    const dLng = req.destinationLocation?.longitude;

    if (pLat === null || dLat === null) continue;

    // Region / City check: avoid cross-state/city matches exceeding 40km
    const originCity = (route.originLocation?.city || '').toLowerCase().trim();
    const reqCity = (req.pickupLocation?.city || '').toLowerCase().trim();

    if (originCity && reqCity && originCity !== reqCity) {
      const interCityDist = calculateRoadDistanceMeters(originLat, originLng, pLat, pLng);
      if (interCityDist && interCityDist > 40000) {
        continue;
      }
    }

    // Detour Calculation:
    // Route with detour = Origin -> Pickup -> Dropoff -> Destination
    const distToPickup = calculateRoadDistanceMeters(originLat, originLng, pLat, pLng);
    const distPickupToDrop = calculateRoadDistanceMeters(pLat, pLng, dLat, dLng);
    const distDropToDest = calculateRoadDistanceMeters(dLat, dLng, destLat, destLng);

    if (distToPickup === null || distPickupToDrop === null || distDropToDest === null) {
      continue;
    }

    const totalDetourTrip = distToPickup + distPickupToDrop + distDropToDest;
    const additionalMeters = Math.max(0, totalDetourTrip - directTripMeters);

    // Approximate extra time: detour travel seconds + 3 minute handover buffer
    const extraSeconds = additionalMeters / speedMps;
    const additionalMinutes = Math.max(3, Math.round(extraSeconds / 60) + 3);

    if (additionalMeters <= maxDetourMeters && additionalMinutes <= maxDetourMins) {
      const rewardRate = (req.rewardFee || 0) / (additionalMinutes || 1);
      const detourScore = Math.max(0, 100 - (additionalMeters / maxDetourMeters) * 50);
      const matchScore = Math.round(detourScore + rewardRate * 5);

      matches.push({
        request: req,
        detourMeters: additionalMeters,
        detourTimeMinutes: additionalMinutes,
        matchScore,
      });
    }
  }

  // Sort descending by highest match score
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { calculateRoadDistanceMeters, findMatches };
