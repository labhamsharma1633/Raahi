import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package, 
  MapPin, 
  Clock, 
  Compass, 
  IndianRupee, 
  Star, 
  ShieldCheck, 
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';
import { apiClient } from '../services/apiClient';
import { REQUEST_STATUS } from '../utils/constants';

export default function RequestDetails({
  requestId,
  request: propRequest,
  onBack,
  onNavigate
}) {
  const { requests, myRequests, currentRole, acceptRequest } = useRaahi();
  const [fetchedRequest, setFetchedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Find request from context by ID or fallback to prop
  const allKnown = [...(myRequests || []), ...(requests || [])];
  const request = propRequest || fetchedRequest || allKnown.find(r => {
    const rId = String(r._id || r.id);
    return rId === String(requestId);
  });

  useEffect(() => {
    if (!request && requestId && requestId !== 'undefined') {
      setLoading(true);
      apiClient.getRequestById(requestId)
        .then(res => {
          if (res?.data?.request) {
            setFetchedRequest(res.data.request);
          }
        })
        .catch(err => {
          console.warn('Could not fetch request details:', err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [requestId, request]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-raahi-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-raahi-teal animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading errand details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-12 text-center bg-raahi-bg min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Request Not Found</h3>
          <p className="text-xs text-slate-500">
            We could not find an errand matching ID <span className="font-mono text-slate-700 font-semibold">{requestId || 'N/A'}</span>.
          </p>
          <PrimaryButton onClick={onBack}>Return to Home</PrimaryButton>
        </div>
      </div>
    );
  }

  const isBuy = request.type === 'buy';
  const isTraveller = currentRole === 'traveller';
  const isAvailable = request.status === REQUEST_STATUS.OPEN;
  const resolvedReqId = request._id || request.id;

  const handleAcceptClick = async () => {
    setAccepted(true);
    try {
      const res = await acceptRequest(resolvedReqId);
      if (res && onNavigate) {
        onNavigate('traveller-active');
      }
    } catch {
      setAccepted(false);
    }
  };

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* Web Header Bar */}
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={onBack}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                {isBuy ? 'Buy & Deliver Task' : 'Pick Up & Deliver Task'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Task Reference: {request.id}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-amber-300 bg-[#08282A] px-4 py-2 rounded-xl border border-teal-500/30 flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              <span>{request.rewardFee} Travel Reward</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details & Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  isBuy 
                    ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}>
                  {isBuy ? <ShoppingCart className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                  <span>{isBuy ? 'Buy & Deliver' : 'Pick Up & Deliver'}</span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    Status: {request.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Needed: {request.neededBy}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {request.title}
              </h3>
              <p className="text-xs text-slate-500">
                Posted {request.createdAt ? new Date(request.createdAt).toLocaleTimeString() : 'Recently'} • {request.pickupLocationObj?.city || request.destinationLocationObj?.city || 'India'}
              </p>

              {/* Customer Profile Pill */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-raahi-teal text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {request.customer?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">{request.customer?.name}</span>
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-xs text-slate-500">{request.customer?.dept}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{request.customer?.rating || 4.9} Verified Peer</span>
                </div>
              </div>
            </div>

            {/* Waypoints */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-800">
                  Pickup and Delivery Waypoints
                </h4>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl">
                  Estimated Detour: +{request.detourMeters}m (~{request.detourTimeMinutes} min)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <span>{isBuy ? '1. PURCHASE STORE / MARKET' : '1. COLLECTION POINT'}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">{request.storeOrPickup}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">{request.pickupArea}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>2. {isBuy ? 'DELIVERY DESTINATION' : 'DROP-OFF LOCATION'}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">{request.destination}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">{request.dropArea}</p>
                </div>
              </div>
            </div>

            {/* Items to Carry */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-3">
              <h4 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                Items to Carry
              </h4>

              <div className="divide-y divide-slate-100">
                {request.items && request.items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-start justify-between text-sm">
                    <div>
                      <span className="font-bold text-slate-800">{it.name}</span>
                      {it.note && (
                        <p className="text-xs text-slate-500 mt-0.5 italic">"{it.note}"</p>
                      )}
                    </div>
                    <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-xs shrink-0">
                      Qty: {it.qty}
                    </span>
                  </div>
                ))}
              </div>

              {request.notes && (
                <div className="mt-3 bg-[#F8FBFC] p-4 rounded-2xl border border-slate-100 text-xs">
                  <strong className="text-slate-700 block mb-1">Customer Special Notes:</strong>
                  <p className="text-slate-600 leading-relaxed">{request.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Financial Breakdown & Actions */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-5">
              <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
                Settlement & Travel Offset
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                {isBuy && (
                  <div className="flex justify-between">
                    <span>Estimated Shop Bill:</span>
                    <strong className="text-slate-800">₹{request.itemBudget}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Commute Travel Reward:</span>
                  <strong className="text-emerald-700 font-bold text-base">₹{request.rewardFee}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-900 text-base">
                  <span>Total Handover Amount:</span>
                  <span className="text-raahi-teal font-black">₹{request.itemBudget + request.rewardFee}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                {isTraveller && isAvailable ? (
                  <PrimaryButton 
                    onClick={handleAcceptClick}
                    variant="primary" 
                    size="lg"
                    loading={accepted}
                    icon={CheckCircle2}
                  >
                    Accept Errand (+₹{request.rewardFee} Reward)
                  </PrimaryButton>
                ) : (
                  <PrimaryButton 
                    onClick={() => onNavigate && onNavigate(`tracking-${request.id}`)}
                    variant="primary" 
                    size="lg"
                  >
                    Track Request Status
                  </PrimaryButton>
                )}

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 text-center"
                >
                  Back to listings
                </button>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-[11px] text-teal-800 leading-normal">
                Safety notice: Always verify the recipient's 4-digit handover code upon delivery. Do not hand over to anyone else.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
