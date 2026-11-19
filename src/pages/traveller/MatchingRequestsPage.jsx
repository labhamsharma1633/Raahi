import React, { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import RequestCard from '../../components/RequestCard';
import { useRaahi } from '../../context/RaahiContext';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Compass, 
  Footprints, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  IndianRupee 
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';

export default function MatchingRequestsPage({ onNavigate }) {
  const { 
    currentRole, 
    setRole, 
    activeRoute, 
    matchingRequests, 
    acceptRequest 
  } = useRaahi();

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('lowest-detour');

  const filtered = matchingRequests.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  }).sort((a, b) => {
    if (sortBy === 'lowest-detour') return a.detourMeters - b.detourMeters;
    if (sortBy === 'highest-reward') return b.rewardFee - a.rewardFee;
    return 0;
  });

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('traveller-dashboard')}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Route Engine
              </span>
              <h1 className="text-2xl font-black text-white">Matching Errands Along Your Route</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('routes')}
              className="text-xs font-bold bg-[#08282A] hover:bg-black/40 text-teal-200 px-3.5 py-2 rounded-xl border border-teal-500/30 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Modify Route</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="traveller-matching"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          <div className="flex-1 w-full space-y-6">
            
            {/* Active Route Summary Strip */}
            {activeRoute && (
              <div className="bg-white p-5 rounded-3xl border border-raahi-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Matching Against Your Commute:
                  </span>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{activeRoute.origin}</span>
                    <span className="text-slate-400">➔</span>
                    <span>{activeRoute.destination}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Mode: {activeRoute.travelMode} • Departure: {activeRoute.departureTime} • Detour Cap: +{activeRoute.maxDetourMeters}m
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-xl border border-teal-200">
                    {matchingRequests.length} Eligible Errands
                  </span>
                </div>
              </div>
            )}

            {/* Filter and Sort Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    filterType === 'all'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({matchingRequests.length})
                </button>
                <button
                  onClick={() => setFilterType('buy')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    filterType === 'buy'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Buy Tasks ({matchingRequests.filter(r => r.type === 'buy').length})
                </button>
                <button
                  onClick={() => setFilterType('pickup')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    filterType === 'pickup'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Parcel Pickups ({matchingRequests.filter(r => r.type === 'pickup').length})
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="lowest-detour">Lowest Detour Distance (+m)</option>
                  <option value="highest-reward">Highest Commute Reward (₹)</option>
                </select>
              </div>
            </div>

            {/* Matching Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.length > 0 ? (
                filtered.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    isTravellerView={true}
                    onSelect={(r) => onNavigate(`request-details-${r.id}`)}
                    onAccept={(r) => {
                      const res = acceptRequest(r.id);
                      if (res) onNavigate('traveller-active');
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full py-16 bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
                  <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-700">No requests match your current detour constraints</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try widening your maximum detour distance or adjusting your departure time window.
                  </p>
                  <div className="mt-4">
                    <PrimaryButton onClick={() => onNavigate('routes')} variant="primary" size="sm">
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
