import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import { useRaahi } from '../../context/RaahiContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  IndianRupee, 
  MapPin, 
  Star,
  Receipt
} from 'lucide-react';
import { REQUEST_STATUS } from '../../utils/constants';

export default function CompletedDeliveriesPage({ onNavigate }) {
  const { currentRole, setRole, requests, user } = useRaahi();

  const completed = requests.filter(r => r.status === REQUEST_STATUS.DELIVERED);

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('traveller-dashboard')}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Traveller Archive
              </span>
              <h1 className="text-2xl font-black text-white">Completed Errands</h1>
            </div>
          </div>

          <span className="text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-xl">
            {completed.length} Delivered
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="traveller-completed"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          <div className="flex-1 w-full space-y-4">
            {completed.length > 0 ? (
              completed.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-base font-bold text-slate-900">{order.title}</h4>
                      <span className="text-xs font-mono text-slate-400">#{order.id}</span>
                    </div>

                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      +₹{order.rewardFee} Commute Reward
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer</span>
                      <strong className="text-slate-800 text-sm block mt-0.5">{order.customer?.name}</strong>
                      <span className="text-slate-500">{order.customer?.dept}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Route Segment</span>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {order.storeOrPickup} ➔ {order.destination}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                      <span className="text-slate-600">Verification Code:</span>
                      <span className="font-mono font-bold text-raahi-teal bg-white px-2 py-0.5 rounded border border-teal-200">
                        {order.otp} (Verified)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No completed tasks yet</h4>
                <p className="text-xs text-slate-400 mt-1">Accept tasks and complete handovers to build your delivery record.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
