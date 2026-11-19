import React, { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import ActionCard from '../../components/ActionCard';
import RequestCard from '../../components/RequestCard';
import StatusStepper from '../../components/StatusStepper';
import ConfirmModal from '../../components/ConfirmModal';
import { useRaahi } from '../../context/RaahiContext';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Phone,
  ShieldCheck
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import { REQUEST_STATUS } from '../../utils/constants';

export default function CustomerDashboard({ onNavigate }) {
  const { 
    user, 
    currentRole, 
    setRole, 
    myRequests, 
    customerStats, 
    cancelRequest, 
    advanceDeliveryStatus 
  } = useRaahi();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReqForCancel, setSelectedReqForCancel] = useState(null);

  // Active requests for this customer
  const activeRequests = (myRequests || []).filter(r => 
    [REQUEST_STATUS.OPEN, REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status)
  );

  const mostRecentActive = activeRequests[0];

  const handleOpenCancel = (req) => {
    setSelectedReqForCancel(req);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    if (selectedReqForCancel) {
      cancelRequest(selectedReqForCancel.id, reason);
    }
    setCancelModalOpen(false);
    setSelectedReqForCancel(null);
  };

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Header Greeting */}
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-8 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-300">
                Customer Workspace
              </span>
              <span className="text-teal-400">•</span>
              <span className="text-xs text-emerald-300 font-semibold">{user.college}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Welcome back, {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <PrimaryButton
              onClick={() => onNavigate('buy')}
              variant="accent"
              size="md"
              fullWidth={false}
              icon={ShoppingBag}
            >
              Buy & Deliver
            </PrimaryButton>
            <PrimaryButton
              onClick={() => onNavigate('pickup')}
              variant="secondary"
              size="md"
              fullWidth={false}
              icon={Package}
            >
              Pick Up & Deliver
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Dashboard Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="customer-dashboard"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          {/* Main Dashboard Space */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Dynamic Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Errands
                </span>
                <div className="text-2xl sm:text-3xl font-black text-raahi-teal">
                  {customerStats.activeCount}
                </div>
                <span className="text-[11px] text-teal-700 font-medium">Currently in transit/open</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Awaiting Match
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {customerStats.awaitingCount}
                </div>
                <span className="text-[11px] text-amber-800 font-medium">Broadcasted to route</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  In Progress
                </span>
                <div className="text-2xl sm:text-3xl font-black text-blue-600">
                  {customerStats.inProgressCount}
                </div>
                <span className="text-[11px] text-blue-800 font-medium">Peer assigned & en route</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-raahi-border shadow-soft space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Completed
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {customerStats.completedCount}
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">Delivered & verified</span>
              </div>
            </div>

            {/* Live Active Delivery Spotlight Card */}
            {mostRecentActive && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-teal-200/90 shadow-card space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-amber-400 to-emerald-500" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Live Delivery Tracking ({mostRecentActive.id})</span>
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                      {mostRecentActive.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate(`tracking-${mostRecentActive.id}`)}
                      className="bg-raahi-teal hover:bg-[#072426] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <span>Open Live Tracker</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {mostRecentActive.status === REQUEST_STATUS.OPEN && (
                      <button
                        onClick={() => handleOpenCancel(mostRecentActive)}
                        className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Waypoints & Handover OTP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup Store / Spot</span>
                    <strong className="text-slate-900 text-sm block mt-0.5">{mostRecentActive.storeOrPickup}</strong>
                    <span className="text-slate-500">{mostRecentActive.pickupArea}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Destination</span>
                    <strong className="text-slate-900 text-sm block mt-0.5">{mostRecentActive.destination}</strong>
                    <span className="text-slate-500">{mostRecentActive.dropArea}</span>
                  </div>

                  <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200/80 text-center flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 block">
                      Handover Verification Code
                    </span>
                    <div className="text-xl font-mono font-black text-raahi-teal mt-1">
                      {mostRecentActive.otp}
                    </div>
                    <span className="text-[10px] text-teal-700/80 mt-0.5">Share with traveller in person</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">
                Place a Campus Errand
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionCard
                  type="buy"
                  title="Buy & Deliver"
                  subtitle="Have a travelling student purchase items from campus markets and bring them to you."
                  badgeText="Food, Pharmacy & Supplies"
                  onClick={() => onNavigate('buy')}
                />
                <ActionCard
                  type="pickup"
                  title="Pick Up & Deliver"
                  subtitle="Have a student collect pre-printed notes, hostel laundry, or reserved library books."
                  badgeText="Pre-Paid Parcels"
                  onClick={() => onNavigate('pickup')}
                />
              </div>
            </div>

            {/* Active & Recent Requests List */}
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Your Recent Requests
                </h3>
                <button
                  onClick={() => onNavigate('customer-requests')}
                  className="text-xs font-bold text-raahi-teal hover:underline flex items-center gap-1"
                >
                  <span>View All ({requests.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {requests.slice(0, 4).map((req) => (
                  <div 
                    key={req.id} 
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          req.type === 'buy' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {req.type === 'buy' ? 'Buy & Deliver' : 'Pick Up'}
                        </span>
                        <span className="text-xs font-mono text-slate-400 font-medium">#{req.id}</span>
                        <span className="text-xs font-bold text-slate-700">• {req.status}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {req.storeOrPickup} ➔ {req.destination}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">REWARD</span>
                        <span className="text-xs font-bold text-emerald-700">₹{req.rewardFee}</span>
                      </div>
                      <button
                        onClick={() => onNavigate(`request-details-${req.id}`)}
                        className="text-xs font-bold text-raahi-teal bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-teal-300"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Campus Errand"
        message={`Are you sure you want to cancel request "${selectedReqForCancel?.title}"? It will be removed from travelling peers' routes.`}
        confirmLabel="Yes, Cancel Request"
        confirmVariant="danger"
        withReasonInput={true}
        reasonPlaceholder="Optional cancellation reason (e.g., plans changed, already bought)..."
      />
    </div>
  );
}
