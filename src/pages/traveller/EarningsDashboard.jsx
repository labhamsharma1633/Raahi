import React, { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import { useRaahi } from '../../context/RaahiContext';
import { 
  ArrowLeft, 
  IndianRupee, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Download, 
  Wallet,
  ShieldCheck,
  Info
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';

export default function EarningsDashboard({ onNavigate }) {
  const { currentRole, setRole, earnings, travellerStats, showToast } = useRaahi();
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdrawSimulate = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      showToast(`Payout of ₹${travellerStats.totalEarned} initiated to verified campus UPI handle!`);
    }, 1000);
  };

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
                Commute Reimbursement Ledger
              </span>
              <h1 className="text-2xl font-black text-white">Earnings & Travel Offsets</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PrimaryButton
              onClick={handleWithdrawSimulate}
              variant="accent"
              size="sm"
              loading={withdrawing}
              fullWidth={false}
              icon={Wallet}
            >
              Transfer to UPI (₹{travellerStats.totalEarned})
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="traveller-earnings"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          <div className="flex-1 w-full space-y-6">
            
            {/* Big Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Travel Rewards Earned
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-700 flex items-center">
                  <IndianRupee className="w-8 h-8 stroke-[3]" />
                  <span>{travellerStats.totalEarned}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Available balance for metro/commute</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Metro Tokens Covered
                </span>
                <div className="text-3xl sm:text-4xl font-black text-raahi-teal">
                  ~{Math.round(travellerStats.totalEarned / 40)} rides
                </div>
                <span className="text-xs text-slate-500 font-medium">Based on ₹40 avg campus metro fare</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Completed Route Errands
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-700">
                  {earnings.length}
                </div>
                <span className="text-xs text-slate-500 font-medium">100% verified with peer OTP</span>
              </div>
            </div>

            {/* Principle Disclaimer Box */}
            <div className="bg-gradient-to-r from-teal-900 to-[#072426] text-white p-5 rounded-3xl border border-teal-500/30 flex items-start gap-3 shadow-sm">
              <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed space-y-1">
                <strong className="text-white text-sm block">Core Community Principle:</strong>
                <p className="text-teal-100/90">
                  Raahi is a peer-to-peer campus commute collaboration system. Rewards are designed to help cover daily travel expenses (metro, bus, auto share). We do not promise guaranteed earnings or employment.
                </p>
              </div>
            </div>

            {/* Trip Ledger Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Recent Trip Disbursements
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {earnings.length} recorded
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {earnings.map((entry) => (
                  <div key={entry.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{entry.title}</h4>
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        Ref: {entry.requestId || entry.id} • {entry.date}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-700 block">
                        +₹{entry.amount}
                      </span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold inline-block mt-0.5">
                        Disbursed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
