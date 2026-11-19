import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Navigation,
  MapPin,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  X,
  Compass,
  PackageCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import SmartPoolMap from './SmartPoolMap';
import PrimaryButton from './PrimaryButton';

export default function SmartPoolBuilder({
  activeRoute,
  openRequests = [],
  onPoolConfirmed,
  onClose,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optimization, setOptimization] = useState(null);
  const [optimizationError, setOptimizationError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [bundledSuggestions, setBundledSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('custom'); // 'custom' | 'suggested'

  // Fetch pre-bundled suggestions
  useEffect(() => {
    let isMounted = true;
    async function loadCandidates() {
      if (!activeRoute?._id) return;
      try {
        const res = await apiClient.getSmartPoolCandidates(activeRoute._id);
        if (isMounted && res?.data?.bundledPools) {
          setBundledSuggestions(res.data.bundledPools);
        }
      } catch (err) {
        console.warn('Failed to fetch candidate pools:', err);
      }
    }
    loadCandidates();
    return () => {
      isMounted = false;
    };
  }, [activeRoute?._id]);

  // Run dynamic optimization when selectedIds change
  useEffect(() => {
    let isMounted = true;
    async function recompute() {
      if (!activeRoute?._id || selectedIds.length === 0) {
        setOptimization(null);
        setOptimizationError(null);
        return;
      }

      setOptimizing(true);
      setOptimizationError(null);

      try {
        const res = await apiClient.optimizeSmartPool(activeRoute._id, selectedIds);
        if (isMounted && res?.data) {
          setOptimization(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setOptimizationError(err.message || 'Route optimization failed');
        }
      } finally {
        if (isMounted) setOptimizing(false);
      }
    }

    const timer = setTimeout(recompute, 250);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [activeRoute?._id, selectedIds]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert('You can pool up to 4 errands per commute.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleApplyBundle = (bundle) => {
    const ids = bundle.requestIds || bundle.requests?.map((r) => r._id || r.id) || [];
    setSelectedIds(ids);
    setActiveTab('custom');
  };

  const handleConfirmPool = async () => {
    if (!activeRoute?._id || selectedIds.length === 0) return;
    setConfirming(true);
    try {
      const res = await apiClient.confirmSmartPool(activeRoute._id, selectedIds);
      if (res?.data) {
        if (onPoolConfirmed) onPoolConfirmed(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to lock Smart Pool. Another commuter may have accepted one of the errands.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] px-6 py-5 text-white flex items-center justify-between border-b border-teal-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">Raahi Smart Pool Builder</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                  Multi-Stop Feasibility
                </span>
              </div>
              <p className="text-xs text-teal-200 mt-0.5">
                Combine 2 to 4 errands along your commute for maximum earnings and zero detour hassle.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('custom')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'custom'
                  ? 'bg-raahi-teal text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Custom Selection ({selectedIds.length}/4)
            </button>
            <button
              onClick={() => setActiveTab('suggested')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'suggested'
                  ? 'bg-raahi-teal text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Smart Combos ({bundledSuggestions.length})</span>
            </button>
          </div>

          {activeRoute && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{activeRoute.origin}</span>
              <span className="text-slate-400">➔</span>
              <span className="font-semibold text-slate-900">{activeRoute.destination}</span>
              <span className="text-slate-400">• Cap: +{activeRoute.maxDetourMeters}m</span>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB: SUGGESTED SMART COMBOS */}
          {activeTab === 'suggested' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>AI Synergy Engine:</strong> These combos group multiple pickup and drop points that share the exact corridor of your commute, minimizing extra walking or driving.
                </div>
              </div>

              {bundledSuggestions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <PackageCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold">No multi-errand combos currently detected for your exact route corridor.</p>
                  <p className="text-xs text-slate-500 mt-1">Switch to "Custom Selection" to manually pick errands.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bundledSuggestions.map((bundle, idx) => {
                    const reqCount = bundle.requests?.length || 2;
                    const combinedReward = bundle.metrics?.totalCombinedReward || 0;
                    const detourM = bundle.metrics?.detourDistanceMeters || 0;
                    const detourMins = bundle.metrics?.detourTimeMinutes || 0;

                    return (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-200 hover:border-teal-600 rounded-2xl p-4 shadow-soft transition-all hover:shadow-md flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                              {reqCount}-Errand Combo
                            </span>
                            <span className="text-base font-extrabold text-emerald-700">
                              ₹{combinedReward}
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            {bundle.requests?.map((r, rIdx) => (
                              <div key={rIdx} className="text-xs text-slate-700 flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                                <span className="font-semibold text-slate-900 truncate">{r.title}</span>
                                <span className="text-slate-400 text-[11px]">({r.storeOrPickup || 'Pickup'} ➔ {r.destination || 'Drop'})</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 pt-3 text-[11px] text-slate-500 border-t border-slate-100">
                            <span>Detour: <strong>+{detourM}m</strong></span>
                            <span>•</span>
                            <span>Time: <strong>+{detourMins} mins</strong></span>
                            <span>•</span>
                            <span>Score: <strong>{bundle.metrics?.matchScore}%</strong></span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyBundle(bundle)}
                          className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-raahi-teal hover:text-white text-teal-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-teal-200 hover:border-raahi-teal"
                        >
                          <span>Review & Optimize This Combo</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: CUSTOM SELECTION */}
          {activeTab === 'custom' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Available Requests to Pool (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Available Errands Near Corridor ({openRequests.length})
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Select up to 4
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {openRequests.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                      No matching open errands currently available.
                    </div>
                  ) : (
                    openRequests.map((req) => {
                      const reqId = req._id || req.id || req.requestId;
                      const isSelected = selectedIds.includes(reqId);

                      return (
                        <div
                          key={reqId}
                          onClick={() => toggleSelect(reqId)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-raahi-teal bg-teal-50/60 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Controlled by container onClick
                            className="mt-1 rounded text-raahi-teal focus:ring-raahi-teal"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {req.title}
                              </h4>
                              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                                +₹{req.rewardFee}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 mt-1 truncate">
                              <strong>Pick:</strong> {req.storeOrPickup || req.pickupLocation?.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              <strong>Drop:</strong> {req.destination || req.destinationLocation?.name}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Dynamic Multi-Stop Map & Sequence (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {selectedIds.length === 0 ? (
                  <div className="bg-slate-50 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                    <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-800">No Errands Selected</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Check 2 or more errands from the list on the left to simulate a multi-stop pooled journey with detour and earnings optimization.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Live Metrics Header */}
                    {optimization && (
                      <div className="bg-[#08282A] text-white p-4 rounded-3xl border border-teal-500/20 shadow-soft">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                          <div className="bg-white/5 rounded-2xl p-2.5">
                            <span className="text-[10px] uppercase font-bold text-teal-300 block">Total Earnings</span>
                            <span className="text-lg font-black text-amber-300">
                              ₹{optimization.metrics.totalCombinedReward}
                            </span>
                          </div>

                          <div className="bg-white/5 rounded-2xl p-2.5">
                            <span className="text-[10px] uppercase font-bold text-teal-300 block">Total Detour</span>
                            <span className="text-lg font-black text-white">
                              +{optimization.metrics.detourDistanceMeters}m
                            </span>
                          </div>

                          <div className="bg-white/5 rounded-2xl p-2.5">
                            <span className="text-[10px] uppercase font-bold text-teal-300 block">Extra Time</span>
                            <span className="text-lg font-black text-white">
                              +{optimization.metrics.detourTimeMinutes}m
                            </span>
                          </div>

                          <div className="bg-white/5 rounded-2xl p-2.5">
                            <span className="text-[10px] uppercase font-bold text-teal-300 block">Match Synergy</span>
                            <span className="text-lg font-black text-emerald-300">
                              {optimization.metrics.matchScore}%
                            </span>
                          </div>
                        </div>

                        {/* Feasibility Alert */}
                        <div className="mt-3 pt-3 border-t border-teal-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            {optimization.metrics.isFeasible ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-300 font-semibold">
                                  Feasible commute detour (within your limits)
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-rose-400" />
                                <span className="text-rose-300 font-semibold">
                                  Exceeds your preferred detour limits
                                </span>
                              </>
                            )}
                          </div>
                          <span className="text-teal-300 font-mono text-[11px]">
                            {optimization.stops.length} Total Waypoints
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Interactive Leaflet Route Map */}
                    {optimization?.stops && (
                      <SmartPoolMap
                        stops={optimization.stops}
                        metrics={optimization.metrics}
                        activeStopIndex={0}
                      />
                    )}

                    {/* Stop Sequence Ordered List */}
                    {optimization?.stops && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          Optimized Multi-Stop Itinerary
                        </span>
                        <div className="space-y-1.5">
                          {optimization.stops.map((stop, sIdx) => {
                            const isOrigin = stop.stopType === 'ORIGIN';
                            const isDest = stop.stopType === 'DESTINATION';
                            const isPickup = stop.stopType === 'PICKUP';

                            let colorClass = 'bg-teal-50 text-teal-800 border-teal-200';
                            if (isOrigin) colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                            if (isDest) colorClass = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                            if (isPickup) colorClass = 'bg-amber-50 text-amber-800 border-amber-200';

                            return (
                              <div
                                key={sIdx}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] border uppercase ${colorClass}`}>
                                    #{sIdx} {stop.stopType}
                                  </span>
                                  <span className="font-semibold text-slate-900 truncate">
                                    {stop.locationName}
                                  </span>
                                </div>
                                {stop.rewardFee > 0 && (
                                  <span className="font-bold text-emerald-700 shrink-0">
                                    +₹{stop.rewardFee}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        Clear Selection
                      </button>

                      <PrimaryButton
                        onClick={handleConfirmPool}
                        disabled={confirming || !optimization || !optimization.metrics?.isFeasible}
                        variant="primary"
                        className="!bg-emerald-600 hover:!bg-emerald-700"
                      >
                        {confirming
                          ? 'Locking & Reserving...'
                          : `Confirm & Lock Smart Pool (Earn ₹${optimization?.metrics?.totalCombinedReward || 0})`}
                      </PrimaryButton>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
