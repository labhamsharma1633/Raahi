import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import { useRaahi } from '../../context/RaahiContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  RotateCcw, 
  IndianRupee, 
  Star,
  Receipt,
  MapPin,
  ChevronRight
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import { REQUEST_STATUS } from '../../utils/constants';

export default function OrderHistoryPage({ onNavigate }) {
  const { currentRole, setRole, requests, createRequest } = useRaahi();

  const completedRequests = requests.filter(r => r.status === REQUEST_STATUS.DELIVERED);

  const handleReorder = (order) => {
    const reordered = {
      type: order.type,
      title: order.title,
      storeOrPickup: order.storeOrPickup,
      destination: order.destination,
      items: order.items,
      itemBudget: order.itemBudget,
      rewardFee: order.rewardFee,
      neededBy: "Within 45 mins",
      notes: "Re-ordered previous errand."
    };
    createRequest(reordered);
    onNavigate('customer-requests');
  };

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('customer-dashboard')}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Past Errands
              </span>
              <h1 className="text-2xl font-black text-white">Order History & Receipts</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="customer-history"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Delivered Errands Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">Every completed delivery verified with peer OTP</p>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
                {completedRequests.length} Completed
              </span>
            </div>

            <div className="space-y-4">
              {completedRequests.length > 0 ? (
                completedRequests.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-base font-bold text-slate-900">{order.title}</h4>
                        <span className="text-xs font-mono text-slate-400">#{order.id}</span>
                      </div>
                      <span className="text-xs text-slate-400">Delivered {order.updatedAt ? new Date(order.updatedAt).toLocaleTimeString() : 'Recently'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Items Delivered</span>
                        <ul className="mt-1 space-y-1 text-slate-700">
                          {order.items?.map((it, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>• {it.name}</span>
                              <span className="font-bold">x{it.qty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Route Segment</span>
                        <p className="text-slate-800 font-medium mt-1">
                          {order.storeOrPickup} ➔ {order.destination}
                        </p>
                        {order.traveller && (
                          <span className="text-[11px] text-teal-700 block mt-1">
                            Delivered by: <strong>{order.traveller.name}</strong>
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Items:</span>
                          <span className="font-bold">₹{order.itemBudget}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Commute Reward:</span>
                          <span className="font-bold text-emerald-700">₹{order.rewardFee}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-slate-900 border-t border-slate-200 pt-1 mt-1 text-xs">
                          <span>Total Paid:</span>
                          <span>₹{order.itemBudget + order.rewardFee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleReorder(order)}
                        className="text-xs font-bold text-raahi-teal hover:text-teal-900 flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-order Errand</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
                  <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-700">No completed orders yet</h4>
                  <p className="text-xs text-slate-400 mt-1">Once a travelling peer completes your errand, receipts appear here.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
