import React from 'react';
import { ArrowLeft, Database, Trash2, RotateCcw, Settings, ShieldCheck, Info } from 'lucide-react';
import { useRaahi } from '../../context/RaahiContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function SettingsPage({ onNavigate }) {
  const { currentRole, setRole, resetSampleData, clearData, user } = useRaahi();

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
                Preferences & State
              </span>
              <h1 className="text-2xl font-black text-white">Application Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sample Data & Persistence Management */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-5 h-5 text-raahi-teal" />
            <h3 className="text-base font-bold text-slate-800">
              Frontend Storage & Sample Data Mode
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            During this MVP frontend phase, all user requests, published routes, earnings, and status progressions are maintained in your browser's <code>localStorage</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-3">
              <div>
                <strong className="text-xs font-bold text-teal-900 block">Reset / Load Sample Data</strong>
                <span className="text-[11px] text-teal-700">Populate realistic Delhi University campus requests and routes for testing.</span>
              </div>
              <PrimaryButton onClick={resetSampleData} variant="primary" size="sm">
                Reload Sample Data
              </PrimaryButton>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
              <div>
                <strong className="text-xs font-bold text-rose-900 block">Clear Application Storage</strong>
                <span className="text-[11px] text-rose-700">Wipe all requests, routes, and earnings from local storage.</span>
              </div>
              <PrimaryButton onClick={clearData} variant="danger" size="sm">
                Clear All Data
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Role Preference */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
            Workspace Mode Preference
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Current Operating Role</span>
              <span className="text-xs text-slate-500">Currently set to: <strong>{currentRole.toUpperCase()}</strong></span>
            </div>
            <button
              onClick={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl transition-colors"
            >
              Toggle to {currentRole === 'customer' ? 'Traveller' : 'Customer'}
            </button>
          </div>
        </div>

        {/* Technical Architecture Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Info className="w-4 h-4 text-teal-600" />
            <span>Architecture & Integrations Readiness</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            The data layer is completely decoupled in <code>storageService.js</code> and ready for backend REST API substitution, UPI gateway integration, and real-time WebSockets without UI redesign.
          </p>
        </div>
      </div>
    </div>
  );
}
