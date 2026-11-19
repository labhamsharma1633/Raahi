// Raahi Route Matching Engine - India-Wide Multi-City Support
// Uses geographic coordinates, road network tortuosity, and regional compatibility

import { calculateEstimatedRoadDistanceKm, resolveLocationCoords, formatLocationObject } from '../services/locationService';

/**
 * Calculates estimated road distance in meters between two coordinate points
 * using the ~1.35x road network topology factor.
 */
export function getEstimatedRoadDistanceMeters(coordA, coordB) {
  if (!coordA || !coordB || coordA.lat === null || coordB.lat === null) {
    return null;
  }
  const km = calculateEstimatedRoadDistanceKm(coordA.lat, coordA.lng, coordB.lat, coordB.lng);
  return km !== null ? Math.round(km * 1000) : null;
}

/**
 * Normalizes any location (object or string) into standardized coordinate object
 */
export function extractCoords(loc) {
  if (!loc) return null;
  if (typeof loc === 'object') {
    // Use != null to guard against both null and undefined
    if (loc.latitude != null && loc.longitude != null && !isNaN(loc.latitude) && !isNaN(loc.longitude)) {
      return { lat: Number(loc.latitude), lng: Number(loc.longitude), city: loc.city, state: loc.state };
    }
    if (loc.formattedAddress) {
      return resolveLocationCoords(loc.formattedAddress);
    }
    if (loc.name) {
      return resolveLocationCoords(loc.name);
    }
  }
  if (typeof loc === 'string') {
    return resolveLocationCoords(loc);
  }
  return null;
}

/**
 * Returns a human-readable detour summary string.
 * Example: "+320m (~7 min extra)"
 */
export function formatDetourSummary(detourMeters, detourMinutes) {
  const m = Math.round(detourMeters);
  const mins = Math.round(detourMinutes);
  if (m >= 1000) {
    const km = (m / 1000).toFixed(1);
    return `+${km}km (~${mins} min extra)`;
  }
  return `+${m}m (~${mins} min extra)`;
}

/**
 * Evaluates match compatibility between a traveller route and customer requests anywhere across India.
 *
 * @param {Object} travellerRoute - { origin, destination, travelMode, maxDetourMeters, maxDetourMinutes }
 * @param {Array} requests - Customer requests
 * @returns {Array} Matched eligible requests with computed road detour and time
 */
export function findMatchingRequests(travellerRoute, requests = []) {
  if (!travellerRoute || !requests || requests.length === 0) {
    return [];
  }

  const originCoords = extractCoords(travellerRoute.origin);
  const destCoords = extractCoords(travellerRoute.destination);

  // If traveller route has no valid coordinates, return empty with notification
  if (!originCoords || !destCoords) {
    return [];
  }

  // Base road trip distance
  const baseTripMeters = getEstimatedRoadDistanceMeters(originCoords, destCoords) || 2000;

  // Travel speed in m/s based on mode
  const speedMps = (
    travellerRoute.travelMode === "Bicycle" ? 14 :
    travellerRoute.travelMode === "E-Rickshaw" ? 18 :
    travellerRoute.travelMode === "Shared Auto" ? 25 :
    4.5
  ) * (1000 / 3600);

  const maxDetourMeters = Number(travellerRoute.maxDetourMeters) || 1500;
  const maxDetourMins = Number(travellerRoute.maxDetourMinutes) || 20;

  const matches = [];

  for (const req of requests) {
    // Only match OPEN requests
    if (req.status !== "OPEN") {
      continue;
    }

    const pickupCoords = extractCoords(req.pickupLocationObj || req.storeOrPickup || req.pickupLocation);
    const dropCoords = extractCoords(req.destinationLocationObj || req.destination);

    if (!pickupCoords || !dropCoords) {
      // Cannot evaluate geographic road match without coordinate points
      continue;
    }

    // City compatibility check:
    // If locations declare distinct non-empty cities that are far apart (e.g. Phagwara vs Patna), exclude them!
    const originCity = (originCoords.city || "").toLowerCase().trim();
    const reqCity = (pickupCoords.city || "").toLowerCase().trim();

    // Allow if either city is unknown (empty string) — don't exclude unknowns
    if (originCity && reqCity && originCity !== reqCity) {
      // Same-city fast path: if both are in the same city, always allow
      // (Already handled above by the !== reqCity guard — this branch is only for different named cities)

      // Check if distance between cities is greater than 40 km (not a local commute)
      const interCityDist = getEstimatedRoadDistanceMeters(originCoords, pickupCoords);
      if (interCityDist && interCityDist > 40000) {
        continue; // Different regions of India, cannot match a daily commute
      }
    }
    // If originCity === reqCity (same city), skip the 40km inter-city check — always allow

    // Detour road distance calculation:
    // Trip with detour: Origin -> Pickup -> Dropoff -> Destination
    const distToPickup = getEstimatedRoadDistanceMeters(originCoords, pickupCoords);
    const distPickupToDrop = getEstimatedRoadDistanceMeters(pickupCoords, dropCoords);
    const distDropToDest = getEstimatedRoadDistanceMeters(dropCoords, destCoords);

    if (distToPickup === null || distPickupToDrop === null || distDropToDest === null) {
      continue;
    }

    const totalDetourTrip = distToPickup + distPickupToDrop + distDropToDest;

    // If baseTripMeters is 0 or less, use totalDetourTrip directly
    const additionalRoadDistance = baseTripMeters > 0
      ? Math.max(0, totalDetourTrip - baseTripMeters)
      : Math.max(0, totalDetourTrip);

    // Approximate extra time: walking/travel velocity + 3 min handover buffer
    const travelExtraSeconds = additionalRoadDistance / speedMps;
    const additionalMinutes = Math.max(3, Math.round(travelExtraSeconds / 60) + 3);

    // Filter within traveller's detour constraints
    if (additionalRoadDistance <= maxDetourMeters && additionalMinutes <= maxDetourMins) {
      // Reward efficiency score: reward earned per additional road minute
      const rewardRate = req.rewardFee / (additionalMinutes || 1);
      const detourScore = Math.max(0, 100 - (additionalRoadDistance / maxDetourMeters) * 50);
      const matchScore = Math.round(detourScore + rewardRate * 5);

      matches.push({
        ...req,
        detourMeters: additionalRoadDistance,
        detourTimeMinutes: additionalMinutes,
        matchScore: matchScore,
        canEvaluate: true
      });
    }
  }

  // Sort by best match score (lowest detour, best commute offset reward rate)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
