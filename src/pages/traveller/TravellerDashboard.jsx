import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import RequestCard from '../../components/RequestCard';
import StatusStepper from '../../components/StatusStepper';
import { useRaahi } from '../../context/RaahiContext';
import { 
  Footprints, 
  Route, 
  Compass, 
  IndianRupee, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  SlidersHorizontal,
  Navigation,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import { REQUEST_STATUS } from '../../utils/constants';

export default function TravellerDashboard({ onNavigate }) {
  const { 
    user, 
    authLoading,
    currentRole, 
    setRole, 
    activeRoute, 
    matchingRequests, 
    activeDeliveries, 
    travellerStats, 
    acceptRequest, 
    advanceDeliveryStatus 
  } = useRaahi();

  // If user is not yet loaded, show clean loading placeholder instead of crashing
  if (!user) {
    return (
      <div className="min-h-screen bg-raahi-bg flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-raahi-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Title Greeting */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-8 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                Traveller Commute Workspace
              </span>
              <span className="text-teal-400">•</span>
              <span className="text-xs text-teal-200">{user?.college || user?.city || 'India Community'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Welcome back, {user?.name || 'Traveller'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <PrimaryButton
              onClick={() => onNavigate('routes')}
              variant="accent"
              size="md"
              fullWidth={false}
              icon={Compass}
            >
              Update My Commute Route
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="traveller-dashboard"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          {/* Main Space */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Dynamic Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Commute Offset
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 flex items-center">
                  <IndianRupee className="w-6 h-6 stroke-[3]" />
                  <span>{travellerStats.totalEarned}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Earned toward transport</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Route Matches
                </span>
                <div className="text-2xl sm:text-3xl font-black text-raahi-teal">
                  {matchingRequests.length}
                </div>
                <span className="text-[11px] text-teal-700 font-medium">Eligible along current walk</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Deliveries
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {activeDeliveries.length}
                </div>
                <span className="text-[11px] text-amber-800 font-medium">In transit / Accepted</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Errands Carried
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {user.completedDeliveries}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Peer trust score: ★ {user.rating}</span>
              </div>
            </div>

            {/* Current Planned Route Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-raahi-teal flex items-center justify-center font-bold">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Your Active Planned Route</h3>
                    <p className="text-xs text-slate-500">Only errands matching this segment are displayed</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('routes')}
                  className="text-xs font-bold text-raahi-teal hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-xl border border-teal-200 transition-colors self-start sm:self-auto"
                >
                  Change Route
                </button>
              </div>

              {activeRoute ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Origin</span>
                    <strong className="text-slate-900 text-sm block mt-0.5">{activeRoute.origin}</strong>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination</span>
                    <strong className="text-slate-900 text-sm block mt-0.5">{activeRoute.destination}</strong>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Timing & Mode</span>
                    <strong className="text-slate-900 text-sm block mt-0.5">{activeRoute.travelMode} • {activeRoute.departureTime}</strong>
                  </div>

                  <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200/80">
                    <span className="text-[10px] uppercase font-bold text-teal-800 block">Max Extra Detour</span>
                    <strong className="text-teal-900 text-sm block mt-0.5">+{activeRoute.maxDetourMeters} meters (~{Math.round(activeRoute.maxDetourMeters / 50)} mins)</strong>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-2xl">
                  <p className="text-xs text-slate-600 mb-2">No route currently published.</p>
                  <PrimaryButton onClick={() => onNavigate('routes')} variant="primary" size="sm" fullWidth={false}>
                    Publish Commute Route
                  </PrimaryButton>
                </div>
              )}
            </div>

            {/* Active Task in Progress Spotlight */}
            {activeDeliveries.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-300 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <h3 className="text-base font-bold text-slate-900">
                      Active Errand in Progress ({activeDeliveries[0].id})
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('traveller-active')}
                    className="text-xs font-bold text-raahi-teal hover:underline flex items-center gap-1"
                  >
                    <span>Manage Active Deliveries</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{activeDeliveries[0].title}</h4>
                    <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                      ₹{activeDeliveries[0].rewardFee} Reward
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Pick up from <strong>{activeDeliveries[0].storeOrPickup}</strong> and deliver to <strong>{activeDeliveries[0].destination}</strong>.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => advanceDeliveryStatus(activeDeliveries[0].id)}
                      className="bg-raahi-teal hover:bg-[#072528] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Advance Status Lifecycle
                    </button>
                    <button
                      onClick={() => onNavigate('traveller-active')}
                      className="bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition-all"
                    >
                      View Full Task Controls & OTP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Compatible Route Matching Tasks Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Matched Requests Along Your Route ({matchingRequests.length})
                  </h3>
                  <p className="text-xs text-slate-500">Filtered strictly within your +{activeRoute?.maxDetourMeters || 600}m detour tolerance</p>
                </div>
                <button
                  onClick={() => onNavigate('traveller-matching')}
                  className="text-xs font-bold text-raahi-teal hover:underline flex items-center gap-1"
                >
                  <span>Explore Full Matching Board</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingRequests && matchingRequests.length > 0 ? (
                  matchingRequests.slice(0, 4).map((req) => {
                    const reqId = req._id || req.id;
                    return (
                      <RequestCard
                        key={reqId}
                        request={req}
                        isTravellerView={true}
                        onSelect={() => onNavigate(`request-details-${reqId}`)}
                        onAccept={() => acceptRequest(reqId)}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">No route matching errands right now.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Publish or adjust your commute route to discover nearby errands.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
