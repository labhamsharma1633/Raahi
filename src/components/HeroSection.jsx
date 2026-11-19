import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Route, 
  ShieldCheck, 
  HeartHandshake, 
  IndianRupee, 
  Footprints,
  ShoppingBag,
  CheckCircle2,
  Users,
  Compass,
  MapPin
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';

// Safe location name resolver for string or structured coordinate object
const getLocationLabel = (loc) => {
  if (!loc) return null;
  if (typeof loc === 'object') {
    return loc.name || loc.formattedAddress || loc.city || null;
  }
  return String(loc).trim() || null;
};

export default function HeroSection({ 
  currentRole, 
  onPrimaryAction, 
  onSecondaryAction,
  onRoleSwitch
}) {
  const isCustomer = currentRole === 'customer';
  const { activeRoute, matchingRequests = [] } = useRaahi();

  // Dynamic route evaluation
  const hasActiveRoute = Boolean(activeRoute && (activeRoute.origin || activeRoute.destination));
  const originName = hasActiveRoute ? (getLocationLabel(activeRoute.origin) || 'Departure Location') : null;
  const destName = hasActiveRoute ? (getLocationLabel(activeRoute.destination) || 'Arrival Destination') : null;

  // Real matched requests along the active route
  const hasMatches = hasActiveRoute && Array.isArray(matchingRequests) && matchingRequests.length > 0;
  const primaryMatch = hasMatches ? matchingRequests[0] : null;

  // Potential reward dynamically summed from actual matched requests
  const totalPotentialReward = hasMatches
    ? matchingRequests.reduce((sum, r) => sum + (Number(r.rewardFee) || 0), 0)
    : 0;

  // Dynamic detour information calculated from actual routing data
  const detourDistanceText = primaryMatch?.detourMeters != null
    ? (primaryMatch.detourMeters >= 1000
        ? `+${(primaryMatch.detourMeters / 1000).toFixed(1)}km`
        : `+${Math.round(primaryMatch.detourMeters)}m`)
    : (activeRoute?.maxDetourMeters ? `Max +${activeRoute.maxDetourMeters}m` : null);

  const detourTimeText = primaryMatch?.detourMinutes != null
    ? `~${Math.round(primaryMatch.detourMinutes)} min`
    : (activeRoute?.travelTimeMinutes ? `~${activeRoute.travelTimeMinutes} min` : null);

  return (
    <section className="bg-gradient-to-b from-raahi-teal via-[#0B393C] to-[#08282A] text-white pt-8 sm:pt-12 pb-10 sm:pb-16 rounded-b-[32px] sm:rounded-b-[48px] shadow-hero relative overflow-hidden border-b border-[#1A4F52]">
      {/* Decorative ambient background glows */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Value Prop & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* India-Wide Community Identity Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/70 border border-teal-400/30 text-teal-100 text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>India-Wide Commute Network</span>
              <span className="text-teal-400">•</span>
              <span className="text-teal-200">Earn on the way</span>
            </div>

            {/* Main Hero Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Going somewhere? <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-100 to-teal-300">
                Help someone along the way.
              </span>
            </h2>

            {/* Confirmed Supporting Copy */}
            <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal max-w-xl">
              Pick up an item, deliver it along your route and earn rewards to help cover your travel costs.
            </p>

            {/* Value Trust Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-teal-100/85">
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero extra commercial trips</span>
              </div>
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <IndianRupee className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Offsets commute & fuel expenses</span>
              </div>
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0" />
                <span>Verified community members</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isCustomer ? (
                <>
                  <button
                    onClick={onPrimaryAction}
                    className="bg-white hover:bg-teal-50 text-raahi-teal font-extrabold py-3.5 px-6 rounded-2xl text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 active:scale-[0.98] hover:shadow-xl"
                  >
                    <ShoppingBag className="w-5 h-5 text-raahi-teal" />
                    <span>Post an Errand Request</span>
                    <ArrowRight className="w-4 h-4 text-raahi-teal" />
                  </button>
                  <button
                    onClick={onSecondaryAction}
                    className="bg-[#092B2D] hover:bg-[#062022] text-teal-100 border border-teal-500/30 font-bold py-3.5 px-6 rounded-2xl text-sm sm:text-base transition-all flex items-center gap-2"
                  >
                    <span>Browse Community Errands</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onPrimaryAction}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 active:scale-[0.98]"
                  >
                    <Footprints className="w-5 h-5 text-slate-950" />
                    <span>Set Commute Journey</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                  <button
                    onClick={onSecondaryAction}
                    className="bg-[#092B2D] hover:bg-[#062022] text-teal-100 border border-teal-500/30 font-bold py-3.5 px-6 rounded-2xl text-sm sm:text-base transition-all flex items-center gap-2"
                  >
                    <span>View Compatible Requests</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Live Raahi Route Network Infographic */}
          <div className="lg:col-span-5">
            <div className="bg-[#051C1E]/85 border border-teal-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative">
              <div className="flex items-center justify-between pb-3.5 border-b border-teal-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Live Raahi Route Network</h4>
                    <p className="text-[11px] text-teal-300/80">Your journey • Your stops • Your community</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                  hasActiveRoute 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' 
                    : 'bg-teal-950/80 text-teal-300 border-teal-500/30'
                }`}>
                  {hasActiveRoute ? 'Route Active' : 'Network Ready'}
                </span>
              </div>

              {/* Dynamic Route Content or Empty State */}
              {!hasActiveRoute ? (
                <div className="py-7 px-3 text-center space-y-3.5 my-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#092B2D] border border-teal-500/30 flex items-center justify-center mx-auto text-teal-300">
                    <Compass className="w-6 h-6 text-teal-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-white">
                      No active journey yet.
                    </p>
                    <p className="text-xs text-teal-200/80 max-w-xs mx-auto leading-relaxed">
                      Add your destination to discover requests along your way.
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={onPrimaryAction}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      <Footprints className="w-3.5 h-3.5 text-slate-950" />
                      <span>Add Destination</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Waypoint Steps Visualization from Real Route */
                <div className="py-4 space-y-3.5">
                  {/* Step 1: Starting Point */}
                  <div className="flex items-center justify-between text-xs bg-[#092B2D]/70 p-3 rounded-2xl border border-teal-500/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-teal-600/30 border border-teal-400 flex items-center justify-center text-xs font-bold text-teal-200 shrink-0">
                        1
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{originName}</span>
                        <span className="text-[11px] text-teal-300/70 block">Starting Point</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-amber-300 font-bold shrink-0 ml-2">Origin</span>
                  </div>

                  {/* Step 2: Community Pickup (Matched requests along route) */}
                  <div className="flex items-center justify-between text-xs bg-[#092B2D]/70 p-3 rounded-2xl border border-teal-500/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center text-xs font-bold text-amber-200 shrink-0">
                        2
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white block">Traveller's Existing Journey</span>
                        <span className="text-[11px] text-teal-300/70 truncate block">
                          {hasMatches
                            ? `Community Pickup: ${primaryMatch.storeOrPickup || primaryMatch.title}${matchingRequests.length > 1 ? ` (+${matchingRequests.length - 1} more)` : ''}`
                            : 'No matched pickup requests along route yet'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[11px] text-teal-200 font-bold block">
                        {detourTimeText || (hasMatches ? '~5-8 min' : 'Direct')}
                      </span>
                      <span className="text-[10px] text-teal-300/60 block">
                        {detourDistanceText || (hasMatches ? '+250m detour' : '0m detour')}
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Delivery Destination */}
                  <div className="flex items-center justify-between text-xs bg-[#092B2D]/70 p-3 rounded-2xl border border-teal-500/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-200 shrink-0">
                        3
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{destName}</span>
                        <span className="text-[11px] text-teal-300/70 block">Delivery Destination</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-300 font-bold shrink-0 ml-2">Destination</span>
                  </div>
                </div>
              )}

              {/* Traveller Reward Metric Banner */}
              <div className="pt-3 border-t border-teal-500/20 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-teal-200/90">
                  <HeartHandshake className="w-4 h-4 text-teal-300" />
                  <span>Traveller Reward:</span>
                </span>
                <span className="font-black text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-xl text-sm">
                  {hasMatches
                    ? `₹${totalPotentialReward} earned along way`
                    : (hasActiveRoute ? 'Awaiting matched requests' : 'Offset travel & fuel costs')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
