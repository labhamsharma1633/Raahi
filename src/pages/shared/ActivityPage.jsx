import React from 'react';
import { ArrowLeft, Clock, Activity, CheckCircle2, ShoppingBag, Footprints } from 'lucide-react';
import { useRaahi } from '../../context/RaahiContext';

export default function ActivityPage({ onNavigate }) {
  const { activity } = useRaahi();

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Audit Timeline
              </span>
              <h1 className="text-2xl font-black text-white">System Activity Log</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-4">
          <div className="space-y-6 relative">
            <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-slate-200" />

            {activity.map((act) => (
              <div key={act.id} className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-raahi-teal text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                  <Activity className="w-4 h-4 text-teal-300" />
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
