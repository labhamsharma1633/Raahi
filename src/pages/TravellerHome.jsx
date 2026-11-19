import React, { useState } from 'react';
import RequestCard from '../components/RequestCard';
import PrimaryButton from '../components/PrimaryButton';
import { 
  Footprints, 
  Route, 
  Compass, 
  MapPin, 
  Clock, 
  IndianRupee, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Bike,
  Navigation
} from 'lucide-react';

export default function TravellerHome({
  activeRoute,
  onSetupRoute,
  compatibleRequests = [],
  onSelectRequest,
  onAcceptRequest,
  onViewActiveDeliveries
}) {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('lowest-detour');

  const filtered = compatibleRequests.filter(req => {
    if (filterType === 'all') return true;
    return req.type === filterType;
  }).sort((a, b) => {
    if (sortBy === 'lowest-detour') return a.detourMeters - b.detourMeters;
    if (sortBy === 'highest-reward') return b.rewardFee - a.rewardFee;
    return 0;
  });

  const totalPossibleRewards = filtered.reduce((acc, curr) => acc + curr.rewardFee, 0);

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* Traveller Mode Banner */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-8 sm:py-12 border-b border-[#14474B] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                <Footprints className="w-3.5 h-3.5" />
                <span>Traveller Mode Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                Earn Towards Your Campus Commute
              </h2>
              <p className="text-sm text-teal-100/90 max-w-xl">
                Deliver errands along your planned route. Each completed errand rewards you to help offset everyday travel costs.
              </p>
            </div>

            <div className="bg-[#051C1E]/80 border border-teal-500/30 rounded-2xl p-4 sm:p-5 text-right shrink-0">
              <span className="text-xs text-teal-300 font-medium block">Potential Travel Cost Offset:</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center justify-end gap-1 mt-0.5">
                <IndianRupee className="w-6 h-6 stroke-[3]" />
                <span>{totalPossibleRewards}</span>
              </div>
              <span className="text-[11px] text-teal-200/70 block mt-0.5">Across {filtered.length} route matches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout for Web */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Planned Route Sidebar */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-raahi-border shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-raahi-teal" />
                  <h3 className="text-base font-bold text-slate-800">Your Current Route</h3>
                </div>
                <button
                  onClick={onSetupRoute}
                  className="text-xs font-bold text-raahi-teal hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors"
                >
                  Edit Route
                </button>
              </div>

              {activeRoute ? (
                <div className="space-y-4">
                  <div className="space-y-3 bg-[#F8FBFC] p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Origin (Starting Point)
                        </span>
                        <span className="text-sm font-bold text-slate-800">{activeRoute.origin}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Destination
                        </span>
                        <span className="text-sm font-bold text-slate-800">{activeRoute.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Departure</span>
                      <strong className="text-slate-800">{activeRoute.departureTime}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Mode</span>
                      <strong className="text-slate-800">{activeRoute.travelMode}</strong>
                    </div>
                  </div>

                  <div className="bg-teal-50/80 rounded-xl p-3 border border-teal-100 text-xs space-y-1">
                    <div className="flex justify-between text-teal-900 font-semibold">
                      <span>Carrying Space:</span>
                      <span>{activeRoute.availableCapacity || 'Backpack'}</span>
                    </div>
                    <p className="text-[11px] text-teal-700/80 leading-normal">
                      Only errands within your maximum detour limit are suggested.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500 mb-3">No active route established.</p>
                  <PrimaryButton onClick={onSetupRoute} variant="primary" size="sm">
                    Configure Route
                  </PrimaryButton>
                </div>
              )}
            </div>

            {/* Commute Expense Tip Card */}
            <div className="bg-gradient-to-br from-teal-900 to-[#072B2E] text-white rounded-3xl p-5 border border-teal-500/20 shadow-md space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Commute Tip
              </span>
              <p className="text-xs text-teal-100/90 leading-relaxed">
                Accepting 1-2 errands while walking from Kamla Nagar to Arts Faculty typically covers your daily metro recharge or auto share.
              </p>
            </div>
          </div>

          {/* Right Column: Matching Requests Grid */}
          <div className="lg:col-span-8 space-y-5">
            {/* Filter and Sort Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    filterType === 'all'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Matches ({compatibleRequests.length})
                </button>
                <button
                  onClick={() => setFilterType('buy')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    filterType === 'buy'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Buy Tasks ({compatibleRequests.filter(r => r.type === 'buy').length})
                </button>
                <button
                  onClick={() => setFilterType('pickup')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    filterType === 'pickup'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Parcel Pickups ({compatibleRequests.filter(r => r.type === 'pickup').length})
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="lowest-detour">Lowest Detour (+m)</option>
                  <option value="highest-reward">Highest Commute Reward (₹)</option>
                </select>
              </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.length > 0 ? (
                filtered.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    isTravellerView={true}
                    onSelect={onSelectRequest}
                    onAccept={onAcceptRequest}
                  />
                ))
              ) : (
                <div className="col-span-full py-16 bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
                  <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-700">No requests match this segment currently</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your departure window or widening your maximum detour limit in route setup.
                  </p>
                  <div className="mt-4">
                    <PrimaryButton onClick={onSetupRoute} variant="secondary" size="sm">
                      Adjust Route Settings
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
