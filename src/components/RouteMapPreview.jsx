import React from 'react';
import { MapPin, Navigation, Compass, Route as RouteIcon, Info, Layers } from 'lucide-react';
import { calculateEstimatedRoadDistanceKm } from '../services/locationService';

export default function RouteMapPreview({
  origin,
  destination,
  pickup,
  dropoff,
  detourMeters,
  className = ""
}) {
  const originName = typeof origin === 'object' ? (origin?.name || origin?.city) : origin;
  const destName = typeof destination === 'object' ? (destination?.name || destination?.city) : destination;
  const pickupName = typeof pickup === 'object' ? (pickup?.name || pickup?.city) : pickup;
  const dropoffName = typeof dropoff === 'object' ? (dropoff?.name || dropoff?.city) : dropoff;

  const originCoords = typeof origin === 'object' ? origin : null;
  const destCoords = typeof destination === 'object' ? destination : null;

  const estimatedTripKm = originCoords?.latitude && destCoords?.latitude
    ? calculateEstimatedRoadDistanceKm(originCoords.latitude, originCoords.longitude, destCoords.latitude, destCoords.longitude)
    : null;

  return (
    <div className={`bg-gradient-to-b from-[#08282A] to-[#051C1E] rounded-3xl p-5 border border-teal-500/30 text-white shadow-soft relative overflow-hidden ${className}`}>
      {/* Background Grid Lines simulating geographic coordinate projections */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #2DD4BF 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-teal-500/20 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <RouteIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Route Corridor Visualization</h4>
            <span className="text-[10px] text-teal-300/70 block">India-Wide Geographic Waypoints</span>
          </div>
        </div>

        {estimatedTripKm !== null && (
          <span className="text-xs font-bold bg-teal-900/80 text-teal-200 border border-teal-500/30 px-2.5 py-1 rounded-xl">
            ~{estimatedTripKm} km road distance
          </span>
        )}
      </div>

      {/* Visual Waypoint Projection Diagram */}
      <div className="py-6 px-2 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          
          {/* Continuous Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 -translate-y-1/2 -z-0 rounded-full opacity-60" />

          {/* Origin Node */}
          <div className="flex items-center md:flex-col items-start md:items-center gap-3 text-left md:text-center relative z-10 w-full md:w-1/4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-lg shadow-amber-950/40 shrink-0">
              A
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Commute Origin
              </span>
              <span className="text-xs font-bold text-white truncate block max-w-[160px]">
                {originName || "Select Origin"}
              </span>
              {origin?.city && (
                <span className="text-[10px] text-teal-300/80 block">{origin.city}, {origin.state}</span>
              )}
            </div>
          </div>

          {/* Waypoint Errand Detour (If present) */}
          {(pickupName || dropoffName) && (
            <div className="flex items-center md:flex-col items-start md:items-center gap-3 text-left md:text-center relative z-10 w-full md:w-2/4 bg-[#0B3538]/70 p-3 rounded-2xl border border-teal-400/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  P
                </div>
                <span className="text-teal-300 text-xs">➔</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                  D
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-teal-200 block">
                  Errand Waypoints Along Path
                </span>
                <span className="text-xs text-white truncate block">
                  {pickupName || 'Pickup'} ➔ {dropoffName || 'Drop'}
                </span>
                {detourMeters && (
                  <span className="text-[10px] text-amber-300 font-semibold block">
                    Estimated detour: +{detourMeters}m
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Destination Node */}
          <div className="flex items-center md:flex-col items-start md:items-center gap-3 text-left md:text-center relative z-10 w-full md:w-1/4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-lg shadow-emerald-950/40 shrink-0">
              B
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                Destination
              </span>
              <span className="text-xs font-bold text-white truncate block max-w-[160px]">
                {destName || "Select Destination"}
              </span>
              {destination?.city && (
                <span className="text-[10px] text-teal-300/80 block">{destination.city}, {destination.state}</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Info Notice */}
      <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between text-[11px] text-teal-200/70 relative z-10">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-teal-400" />
          <span>Calculated using road network topology factor (~1.35x aerial)</span>
        </span>
        <span className="text-[10px] text-teal-400 font-semibold">India Coverage</span>
      </div>
    </div>
  );
}
