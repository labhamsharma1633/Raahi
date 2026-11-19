import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Key,
  Compass,
  Phone,
  Package,
} from 'lucide-react';
import SmartPoolMap from './SmartPoolMap';
import PrimaryButton from './PrimaryButton';
import { useRaahi } from '../context/RaahiContext';

export default function ActiveSmartPoolCard({ pool, onAdvance, onCancel }) {
  const [otpInput, setOtpInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { showToast } = useRaahi();

  if (!pool || !pool.stops) return null;

  const activeIdx = pool.activeStopIndex || 0;
  const currentStop = pool.stops[activeIdx] || null;
  const isDeliveryStop = currentStop?.stopType === 'DELIVERY';
  const isFinalStop = currentStop?.stopType === 'DESTINATION';
  const isCompleted = pool.status === 'COMPLETED';

  const handleAdvanceStop = async () => {
    if (isDeliveryStop && (!otpInput || otpInput.trim().length !== 4)) {
      setErrorMsg('Please enter the 4-digit handover OTP from the recipient');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await onAdvance(pool._id || pool.id, isDeliveryStop ? otpInput.trim() : null);
      setOtpInput('');
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPool = async () => {
    if (!window.confirm('Are you sure you want to cancel this pooled commute? Any uncollected errands will be returned to open commuters.')) {
      return;
    }

    setCancelling(true);
    try {
      await onCancel(pool._id || pool.id, 'Cancelled by commuter');
    } catch (err) {
      alert(err.message || 'Failed to cancel pool');
    } finally {
      setCancelling(false);
    }
  };

  const completedCount = pool.stops.filter((s) => s.status === 'COMPLETED').length;
  const progressPct = Math.round((completedCount / pool.stops.length) * 100);

  return (
    <div className="bg-white rounded-3xl border border-raahi-border shadow-soft overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Active Smart Pool</h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                {pool.status}
              </span>
            </div>
            <p className="text-xs text-teal-200 mt-0.5">
              {pool.requests?.length || 2} Pooled Errands • Route: {pool.route?.origin} ➔ {pool.route?.destination}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-teal-300 block">Total Reward</span>
            <span className="text-xl font-black text-amber-300">
              ₹{pool.metrics?.totalCombinedReward || 0}
            </span>
          </div>

          {!isCompleted && (
            <button
              onClick={handleCancelPool}
              disabled={cancelling}
              className="text-xs text-rose-300 hover:text-white hover:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-500/30 transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Pool'}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5">
        <div
          className="bg-emerald-500 h-1.5 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="p-5 space-y-5">
        {/* Interactive Map */}
        <SmartPoolMap
          stops={pool.stops}
          activeStopIndex={activeIdx}
          metrics={pool.metrics}
        />

        {/* Current Target Stop Action Card */}
        {currentStop && !isCompleted && (
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-900">
                    Step {activeIdx + 1} of {pool.stops.length}: {currentStop.stopType}
                  </span>
                  {currentStop.rewardFee > 0 && (
                    <span className="text-xs font-bold text-emerald-800">
                      Earns ₹{currentStop.rewardFee}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {currentStop.locationName}
                </h4>
                <p className="text-xs text-slate-600">
                  {currentStop.address || 'Address provided by sender'}
                </p>

                {currentStop.itemSummary && (
                  <p className="text-xs font-semibold text-slate-800 pt-1">
                    📦 {currentStop.itemSummary}
                  </p>
                )}

                {currentStop.contactPhone && (
                  <a
                    href={`tel:${currentStop.contactPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline pt-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Contact: {currentStop.contactPhone}</span>
                  </a>
                )}
              </div>

              {/* Action Inputs */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {isDeliveryStop && (
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-600" />
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="4-digit OTP"
                      className="w-28 px-3 py-1.5 text-center text-sm font-black tracking-widest bg-white border-2 border-amber-300 rounded-xl outline-none focus:border-amber-600"
                    />
                  </div>
                )}

                {errorMsg && (
                  <span className="text-xs font-bold text-rose-600">
                    {errorMsg}
                  </span>
                )}

                <PrimaryButton
                  onClick={handleAdvanceStop}
                  disabled={submitting}
                  variant="primary"
                  className="!bg-emerald-600 hover:!bg-emerald-700 whitespace-nowrap"
                >
                  {submitting
                    ? 'Processing...'
                    : isDeliveryStop
                    ? 'Verify & Complete Drop'
                    : isFinalStop
                    ? 'Finish Commute Journey'
                    : 'Mark Step Completed'}
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}

        {/* Complete Stops Timeline */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Trip Progression ({completedCount}/{pool.stops.length} Complete)
          </span>

          <div className="space-y-1.5">
            {pool.stops.map((stop, sIdx) => {
              const isPast = stop.status === 'COMPLETED' || sIdx < activeIdx;
              const isCurrent = sIdx === activeIdx && !isCompleted;

              return (
                <div
                  key={sIdx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-300 font-bold'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isPast
                          ? 'bg-emerald-100 text-emerald-700'
                          : isCurrent
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : sIdx}
                    </span>

                    <span className="font-semibold text-slate-900 truncate">
                      [{stop.stopType}] {stop.locationName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {stop.rewardFee > 0 && (
                      <span className="text-emerald-700 font-bold">
                        ₹{stop.rewardFee}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        isPast
                          ? 'text-emerald-600'
                          : isCurrent
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {isPast ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
