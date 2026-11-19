import React, { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import RequestCard from '../../components/RequestCard';
import ConfirmModal from '../../components/ConfirmModal';
import { useRaahi } from '../../context/RaahiContext';
import { 
  ArrowLeft, 
  Search, 
  PlusCircle, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import { REQUEST_STATUS } from '../../utils/constants';

export default function MyRequestsPage({ onNavigate }) {
  const { 
    currentRole, 
    setRole, 
    requests, 
    cancelRequest 
  } = useRaahi();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReqForCancel, setSelectedReqForCancel] = useState(null);

  const filtered = requests.filter((r) => {
    let matchesTab = true;
    if (activeTab === 'awaiting') matchesTab = r.status === REQUEST_STATUS.OPEN;
    else if (activeTab === 'in-progress') matchesTab = [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status);
    else if (activeTab === 'completed') matchesTab = r.status === REQUEST_STATUS.DELIVERED;
    else if (activeTab === 'cancelled') matchesTab = r.status === REQUEST_STATUS.CANCELLED;

    const matchesSearch = searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.storeOrPickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

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
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('customer-dashboard')}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Customer Management
              </span>
              <h1 className="text-2xl font-black text-white">My Errand Requests</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PrimaryButton
              onClick={() => onNavigate('buy')}
              variant="accent"
              size="sm"
              fullWidth={false}
              icon={PlusCircle}
            >
              New Errand
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="customer-requests"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          {/* Main List */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Filter Tabs & Search */}
            <div className="bg-white p-4 rounded-3xl border border-raahi-border shadow-soft space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter requests by keyword, shop, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-raahi-teal transition-all"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({requests.length})
                </button>
                <button
                  onClick={() => setActiveTab('awaiting')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === 'awaiting'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Awaiting Match ({requests.filter(r => r.status === REQUEST_STATUS.OPEN).length})
                </button>
                <button
                  onClick={() => setActiveTab('in-progress')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === 'in-progress'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  In Progress ({requests.filter(r => [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status)).length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === 'completed'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Completed ({requests.filter(r => r.status === REQUEST_STATUS.DELIVERED).length})
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === 'cancelled'
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cancelled ({requests.filter(r => r.status === REQUEST_STATUS.CANCELLED).length})
                </button>
              </div>
            </div>

            {/* List of Requests */}
            <div className="space-y-4">
              {filtered.length > 0 ? (
                filtered.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-5 border border-raahi-border shadow-soft space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          req.type === 'buy' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {req.type === 'buy' ? 'Buy & Deliver' : 'Pick Up'}
                        </span>
                        <span className="text-xs font-mono text-slate-400">#{req.id}</span>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ₹{req.rewardFee} Commute Reward
                        </span>
                        {req.status === REQUEST_STATUS.OPEN && (
                          <button
                            onClick={() => handleOpenCancel(req)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{req.title}</h4>
                        <span className="text-slate-400 text-[11px] block mt-0.5">Needed: {req.neededBy}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">From</span>
                        <span className="font-semibold text-slate-800">{req.storeOrPickup}</span>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block mt-1">To</span>
                        <span className="font-semibold text-slate-800">{req.destination}</span>
                      </div>
                      <div className="flex flex-col justify-between items-start md:items-end gap-2">
                        {req.otp && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-bold">OTP CODE</span>
                            <span className="text-sm font-mono font-black text-raahi-teal bg-teal-50 px-2 py-0.5 rounded">
                              {req.otp}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigate(`request-details-${req.id}`)}
                            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => onNavigate(`tracking-${req.id}`)}
                            className="text-xs font-bold text-white bg-raahi-teal hover:bg-[#072528] px-3.5 py-1.5 rounded-xl transition-colors"
                          >
                            Track Live
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
                  <h4 className="text-base font-bold text-slate-700">No requests in this view</h4>
                  <p className="text-xs text-slate-400 mt-1">You have no requests matching this filter criteria.</p>
                  <div className="mt-4">
                    <PrimaryButton onClick={() => onNavigate('buy')} variant="primary" size="sm">
                      Post an Errand Now
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Request"
        message={`Are you sure you want to cancel "${selectedReqForCancel?.title}"?`}
        confirmLabel="Yes, Cancel"
        confirmVariant="danger"
        withReasonInput={true}
      />
    </div>
  );
}
