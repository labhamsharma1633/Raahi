import React, { useState, useEffect } from 'react';
import StatusStepper from '../components/StatusStepper';
import PrimaryButton from '../components/PrimaryButton';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';
import { apiClient } from '../services/apiClient';
import { REQUEST_STATUS } from '../utils/constants';

export default function OrderTracking({
  orderId,
  order: propOrder,
  onBack,
  onNavigate
}) {
  const { requests, myRequests, currentRole, advanceDeliveryStatus, showToast } = useRaahi();
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [callAlert, setCallAlert] = useState(false);
  const [inputOtp, setInputOtp] = useState('');

  // 1. Search order across propOrder, fetchedOrder, myRequests and public requests
  const allKnownOrders = [...(myRequests || []), ...(requests || [])];
  const activeOrder = propOrder || fetchedOrder || allKnownOrders.find(r => {
    const rId = String(r._id || r.id);
    return rId === String(orderId);
  });

  // 2. If not found in memory (e.g. page reload or direct navigation), fetch from backend API
  useEffect(() => {
    if (!activeOrder && orderId && orderId !== 'undefined') {
      setLoading(true);
      apiClient.getRequestById(orderId)
        .then(res => {
          if (res?.data?.request) {
            setFetchedOrder(res.data.request);
          }
        })
        .catch(err => {
          console.warn('Could not fetch order by ID:', err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId, activeOrder]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-raahi-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-raahi-teal animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Retrieving live errand details...</p>
        </div>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="p-12 text-center bg-raahi-bg min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
          <p className="text-xs text-slate-500">
            We could not find an active errand matching ID <span className="font-mono text-slate-700 font-semibold">{orderId || 'N/A'}</span>.
          </p>
          <PrimaryButton onClick={onBack}>Return to Dashboard</PrimaryButton>
        </div>
      </div>
    );
  }

  const stepIndex = 
    activeOrder.status === REQUEST_STATUS.OPEN ? 1 :
    activeOrder.status === REQUEST_STATUS.ACCEPTED ? 2 :
    activeOrder.status === REQUEST_STATUS.PICKED_UP ? 3 :
    activeOrder.status === REQUEST_STATUS.IN_TRANSIT ? 4 : 5;

  const isDelivered = activeOrder.status === REQUEST_STATUS.DELIVERED;
  const isTraveller = currentRole === 'traveller';
  const resolvedId = activeOrder._id || activeOrder.id;

  const handleAdvanceStep = () => {
    if (activeOrder.status === REQUEST_STATUS.IN_TRANSIT) {
      if (inputOtp.trim() !== String(activeOrder.otp || '').trim()) {
        showToast(`Verification code must match customer's 4-digit OTP (${activeOrder.otp})`, 'error');
        return;
      }
      advanceDeliveryStatus(resolvedId, inputOtp);
    } else {
      advanceDeliveryStatus(resolvedId);
    }
  };

  const handleSimulateCall = () => {
    setCallAlert(true);
    setTimeout(() => setCallAlert(false), 3000);
  };

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* Title Bar */}
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
                Live Errand Tracking
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Order Tracking: #{String(resolvedId).slice(-6)}
              </h2>
            </div>
          </div>

          <span className={`text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl ${
            isDelivered 
              ? 'bg-emerald-500 text-white' 
              : 'bg-amber-400 text-slate-900 animate-pulse'
          }`}>
            {isDelivered ? '✓ Delivered' : `• ${activeOrder.status.replace('_', ' ')}`}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {callAlert && (
          <div className="mb-6 bg-teal-900 text-white p-4 rounded-2xl text-sm flex items-center justify-between shadow-xl animate-bounce border border-teal-500/40">
            <span>Connecting campus call with {isTraveller ? activeOrder.customer?.name : (activeOrder.traveller?.name || 'Assigned Peer')}...</span>
            <Phone className="w-5 h-5 text-emerald-400" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Lifecycle Stepper */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activeOrder.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {activeOrder.storeOrPickup} ➔ {activeOrder.destination}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Travel Reward</span>
                  <span className="text-base font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    ₹{activeOrder.rewardFee}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="py-2">
                <StatusStepper currentStep={stepIndex} />
              </div>

              {/* Advance Button Simulation for Testing */}
              {!isDelivered ? (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {activeOrder.status === REQUEST_STATUS.IN_TRANSIT && (
                    <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 space-y-2">
                      <span className="text-xs font-bold text-teal-900 block">
                        Enter Customer's Handover Verification Code to Complete Delivery
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength="4"
                          placeholder={activeOrder.otp || "4821"}
                          value={inputOtp}
                          onChange={(e) => setInputOtp(e.target.value)}
                          className="w-32 text-center text-lg font-mono font-bold tracking-widest p-2 rounded-xl border border-teal-300 bg-white"
                        />
                        <span className="text-[11px] text-teal-700">(Demo code is {activeOrder.otp})</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
                    <div>
                      <span className="text-xs font-bold text-raahi-teal block">Delivery Lifecycle Control:</span>
                      <span className="text-[11px] text-slate-500">Advance the delivery status to verify real-time timeline progression.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAdvanceStep}
                      className="bg-raahi-teal hover:bg-[#072527] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Simulate Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center space-y-2 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900">Delivery Verified & Completed!</h4>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                    The item was handed over successfully. ₹{activeOrder.rewardFee} has been disbursed to {activeOrder.traveller?.name || 'travelling peer'} to help cover commute expenses.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Handover Code & Contact */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                {isTraveller ? 'Customer Information' : 'Travelling Peer'}
              </h4>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-raahi-teal text-white flex items-center justify-center font-bold text-base">
                  {isTraveller ? activeOrder.customer?.name?.[0] : (activeOrder.traveller?.name?.[0] || 'T')}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {isTraveller ? activeOrder.customer?.name : (activeOrder.traveller?.name || 'Awaiting Traveller Assignment')}
                  </span>
                  <span className="text-xs text-teal-700 font-medium block">
                    {isTraveller ? activeOrder.customer?.dept : (activeOrder.traveller?.dept || 'Delhi University Campus')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSimulateCall}
                  className="bg-teal-50 hover:bg-teal-100 text-raahi-teal font-bold py-2.5 px-3 rounded-xl border border-teal-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Peer</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateCall}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-3 rounded-xl border border-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>

              <div className="bg-[#F8FBFC] rounded-2xl p-4 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                  Handover Verification Code
                </span>
                <div className="text-2xl font-mono font-black tracking-widest text-raahi-teal bg-white py-1.5 px-4 rounded-xl border border-teal-300 inline-block">
                  {activeOrder.otp}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Exchange upon receiving items to verify handover.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 text-center py-2"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
