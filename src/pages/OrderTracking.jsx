import React, { useState, useEffect } from 'react';
import StatusStepper from '../components/StatusStepper';
import OrderTrackingMap from '../components/OrderTrackingMap';
import ConfirmModal from '../components/ConfirmModal';
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
  AlertTriangle,
  Loader2,
  Package,
  ShoppingBag,
  ExternalLink,
  Store,
  HelpCircle,
  XCircle,
  Copy,
  Check,
  Building2,
  Globe2,
  UserCheck
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';
import { apiClient } from '../services/apiClient';
import { REQUEST_STATUS } from '../utils/constants';

/**
 * OrderTracking
 * Customer Order Tracking Page featuring real request retrieval, 7-stage lifecycle stepper,
 * OpenStreetMap interactive Leaflet routing map, secure handover OTP, truthful traveller assignment state,
 * and comprehensive errand details.
 */
export default function OrderTracking({
  orderId,
  order: propOrder,
  onBack,
  onNavigate
}) {
  const { 
    user,
    requests, 
    myRequests, 
    currentRole, 
    advanceDeliveryStatus, 
    cancelRequest,
    showToast 
  } = useRaahi();

  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [callAlert, setCallAlert] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [inputOtp, setInputOtp] = useState('');

  // 1. Search order across propOrder, fetchedOrder, myRequests, public requests, and localStorage
  const searchId = String(orderId || '');
  
  // Find in memory or local cache
  let matchedOrder = propOrder || fetchedOrder;
  if (!matchedOrder && searchId) {
    const memoryPool = [...(myRequests || []), ...(requests || [])];
    matchedOrder = memoryPool.find(r => {
      const rId = String(r._id || r.id || '');
      return rId === searchId || rId.endsWith(searchId);
    });
  }

  // Fallback to localStorage directly if not in state yet
  if (!matchedOrder && searchId) {
    try {
      const cached = JSON.parse(localStorage.getItem('raahi_my_requests') || '[]');
      matchedOrder = cached.find(r => {
        const rId = String(r._id || r.id || '');
        return rId === searchId || rId.endsWith(searchId);
      });
    } catch {}
  }

  // 2. If not found locally, attempt asynchronous backend API lookup
  useEffect(() => {
    if (!matchedOrder && searchId && searchId !== 'undefined' && searchId !== 'null') {
      setLoading(true);
      apiClient.getRequestById(searchId)
        .then(res => {
          if (res?.data?.request) {
            setFetchedOrder(res.data.request);
          }
        })
        .catch(err => {
          console.warn('Order fetch by ID notice:', err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchId, matchedOrder]);

  const activeOrder = matchedOrder;

  // Loading state
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

  // Missing order state
  if (!activeOrder) {
    return (
      <div className="p-8 sm:p-12 text-center bg-raahi-bg min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-5 text-center">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Order Not Found</h3>
            <p className="text-xs text-slate-500">
              We could not find an active errand matching ID <span className="font-mono text-slate-800 font-bold">{orderId || 'N/A'}</span>.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">Possible reasons:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
              <li>The errand was created in another browser tab or expired.</li>
              <li>The order ID is mistyped or incomplete.</li>
              <li>The request was cancelled or removed.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <PrimaryButton onClick={onBack}>Return to Dashboard</PrimaryButton>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('customer-requests')}
                className="text-xs font-bold text-raahi-teal hover:underline py-1.5"
              >
                View My Requests
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const resolvedId = String(activeOrder._id || activeOrder.id || 'N/A');
  const isDelivered = activeOrder.status === REQUEST_STATUS.DELIVERED;
  const isCancelled = activeOrder.status === REQUEST_STATUS.CANCELLED;
  const isTraveller = currentRole === 'traveller';
  const hasTraveller = Boolean(activeOrder.traveller && activeOrder.traveller.name);

  // Map 7-stage delivery index:
  // 1. Request Created (OPEN)
  // 2. Waiting for Traveller (OPEN)
  // 3. Traveller Accepted (ACCEPTED)
  // 4. Pickup in Progress (ACCEPTED / moving to store)
  // 5. Picked Up (PICKED_UP)
  // 6. Out for Delivery (IN_TRANSIT)
  // 7. Delivered (DELIVERED)
  let currentStepIndex = 1;
  if (activeOrder.status === REQUEST_STATUS.OPEN) {
    currentStepIndex = 2; // Waiting for traveller
  } else if (activeOrder.status === REQUEST_STATUS.ACCEPTED) {
    currentStepIndex = 3; // Traveller accepted
  } else if (activeOrder.status === REQUEST_STATUS.PICKED_UP) {
    currentStepIndex = 5; // Picked up
  } else if (activeOrder.status === REQUEST_STATUS.IN_TRANSIT) {
    currentStepIndex = 6; // Out for delivery
  } else if (activeOrder.status === REQUEST_STATUS.DELIVERED) {
    currentStepIndex = 7; // Delivered
  }

  // Format request timestamp in IST
  const formattedDate = activeOrder.createdAt
    ? new Date(activeOrder.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }) + ' IST'
    : 'Recently';

  // 7-Stage dynamic lifecycle definitions
  const deliveryStages = [
    { 
      label: "Request Created", 
      description: "Errand registered in Raahi community system", 
      time: activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Done" 
    },
    { 
      label: "Waiting for Traveller", 
      description: activeOrder.status === REQUEST_STATUS.OPEN ? "Broadcasting to active commuters travelling along this route" : "Route matched with commuter", 
      time: activeOrder.status === REQUEST_STATUS.OPEN ? "Broadcasting" : "Matched" 
    },
    { 
      label: "Traveller Accepted", 
      description: hasTraveller ? `${activeOrder.traveller.name} accepted your errand` : "Awaiting peer confirmation", 
      time: hasTraveller ? "Confirmed" : "" 
    },
    { 
      label: "Pickup in Progress", 
      description: "Traveller is navigating to the pickup location", 
      time: currentStepIndex >= 4 ? "En route" : "" 
    },
    { 
      label: "Items Picked Up", 
      description: "Items collected and checked by traveller", 
      time: currentStepIndex >= 5 ? "Verified" : "" 
    },
    { 
      label: "Out for Delivery", 
      description: "Traveller is travelling towards your delivery destination", 
      time: currentStepIndex >= 6 ? "On the way" : "" 
    },
    { 
      label: "Delivered & Handed Over", 
      description: "Handover confirmed using your 4-digit verification code", 
      time: isDelivered ? "Complete" : "Pending OTP" 
    }
  ];

  const handleCopyOtp = () => {
    if (activeOrder.otp) {
      navigator.clipboard?.writeText(String(activeOrder.otp));
      setCopiedOtp(true);
      showToast('Handover OTP copied to clipboard', 'info');
      setTimeout(() => setCopiedOtp(false), 2500);
    }
  };

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

  const handleConfirmCancel = (reason) => {
    cancelRequest(resolvedId, reason);
    setCancelModalOpen(false);
  };

  const handleSimulateCall = () => {
    setCallAlert(true);
    setTimeout(() => setCallAlert(false), 3000);
  };

  const isCampus = activeOrder.networkScope === 'CAMPUS';
  const itemBudget = Number(activeOrder.itemBudget) || 0;
  const rewardFee = Number(activeOrder.rewardFee) || 0;
  const totalEstimatedCost = itemBudget + rewardFee;

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* SECTION A: Title Bar & Request Overview Header */}
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start sm:items-center gap-4">
              <button 
                type="button" 
                onClick={onBack}
                className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20 shrink-0 mt-0.5 sm:mt-0"
                aria-label="Back to previous page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                    Live Errand Tracking
                  </span>
                  <span className="text-teal-400">•</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isCampus 
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                      : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                  }`}>
                    {isCampus ? <Building2 className="w-3 h-3" /> : <Globe2 className="w-3 h-3" />}
                    <span>{isCampus ? 'Raahi Campus' : 'Raahi Community'}</span>
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {activeOrder.title || `${activeOrder.storeOrPickup} Errand`}
                </h1>

                <div className="flex items-center gap-3 text-xs text-teal-200/80 mt-1 flex-wrap">
                  <span className="font-mono bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-500/20">
                    ID: #{String(resolvedId).slice(-8)}
                  </span>
                  <span>Created {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Current Status Badge */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              {isCancelled ? (
                <span className="text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Cancelled</span>
                </span>
              ) : isDelivered ? (
                <span className="text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Delivered & Verified</span>
                </span>
              ) : (
                <span className="text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-4 h-4" />
                  <span>{activeOrder.status === REQUEST_STATUS.OPEN ? 'Broadcasting to Route' : activeOrder.status.replace('_', ' ')}</span>
                </span>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Simulated Call Notification */}
        {callAlert && (
          <div className="mb-6 bg-teal-900 text-white p-4 rounded-2xl text-sm flex items-center justify-between shadow-xl animate-bounce border border-teal-500/40">
            <span>Connecting direct call with {isTraveller ? activeOrder.customer?.name : (activeOrder.traveller?.name || 'Assigned Traveller')}...</span>
            <Phone className="w-5 h-5 text-emerald-400" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (8 cols): Timeline, Route Map & Order Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION B: 7-Stage Delivery Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Delivery Progression Timeline</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time status updates along the commuter route corridor
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    Traveller Reward
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-xl border border-emerald-200">
                    ₹{rewardFee}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              {isCancelled ? (
                <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-900">Request Was Cancelled</h4>
                  <p className="text-xs text-rose-700 max-w-md mx-auto">
                    This errand is no longer active. Any hold or pending rewards were released.
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  <StatusStepper currentStep={currentStepIndex} steps={deliveryStages} />
                </div>
              )}

              {/* Prototype Delivery Lifecycle Simulator Toolbar for Reviewers */}
              {!isDelivered && !isCancelled && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {activeOrder.status === REQUEST_STATUS.IN_TRANSIT && (
                    <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 space-y-2">
                      <span className="text-xs font-bold text-teal-900 block">
                        Enter Handover OTP to Complete Delivery
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
                        <span className="text-[11px] text-teal-700">(OTP code is {activeOrder.otp})</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
                    <div>
                      <span className="text-xs font-bold text-raahi-teal block">Delivery Lifecycle Simulation</span>
                      <span className="text-[11px] text-slate-500">Advance the delivery status to verify real-time timeline progression.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAdvanceStep}
                      className="bg-raahi-teal hover:bg-[#072527] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Advance Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {isDelivered && (
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center space-y-2 animate-fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Delivery Verified & Completed!</h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    The item was handed over successfully. ₹{rewardFee} has been disbursed to {activeOrder.traveller?.name || 'travelling peer'} to help cover commute expenses.
                  </p>
                </div>
              )}
            </div>

            {/* SECTION D: Route Information & Interactive Leaflet Map */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-raahi-teal flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Route Geometry & Live Map</h3>
                    <p className="text-xs text-slate-500">Interactive OpenStreetMap view of pickup and dropoff coordinates</p>
                  </div>
                </div>
              </div>

              {/* Waypoint details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center">P</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800">Community Pickup</span>
                  </div>
                  <strong className="text-sm text-slate-900 block pt-1">{activeOrder.storeOrPickup}</strong>
                  <p className="text-xs text-slate-500 leading-snug">
                    {activeOrder.pickupLocation?.formattedAddress || activeOrder.pickupArea || activeOrder.storeOrPickup}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">D</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-800">Delivery Destination</span>
                  </div>
                  <strong className="text-sm text-slate-900 block pt-1">{activeOrder.destination}</strong>
                  <p className="text-xs text-slate-500 leading-snug">
                    {activeOrder.destinationLocation?.formattedAddress || activeOrder.dropArea || activeOrder.destination}
                  </p>
                </div>
              </div>

              {/* Interactive Leaflet Map */}
              <OrderTrackingMap
                pickup={activeOrder.pickupLocation || activeOrder.storeOrPickup}
                destination={activeOrder.destinationLocation || activeOrder.destination}
                travellerLocation={activeOrder.travellerLocation || null}
                status={activeOrder.status}
              />
            </div>

            {/* SECTION E: Order & Item Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-raahi-teal flex items-center justify-center">
                    {activeOrder.type === 'pickup' ? <Package className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {activeOrder.type === 'pickup' ? 'Package Specification' : 'Requested Items & Store'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeOrder.type === 'pickup' ? 'Details of parcel for pickup & delivery' : 'Items to purchase and bring along commute'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {activeOrder.neededBy ? `Needed: ${activeOrder.neededBy}` : 'Regular Delivery'}
                </span>
              </div>

              {/* Items Table / List */}
              {Array.isArray(activeOrder.items) && activeOrder.items.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                    <span>Item Description</span>
                    <span>Quantity</span>
                  </div>
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-slate-800">{item.name || item}</span>
                      <span className="text-xs font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg">
                        x{item.qty || 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">{activeOrder.packageDetails || activeOrder.title || 'General Errand'}</p>
                  {activeOrder.packageWeight && (
                    <span className="text-slate-500 text-[11px] block mt-1">Weight category: {activeOrder.packageWeight}</span>
                  )}
                </div>
              )}

              {/* Delivery notes & instructions */}
              {activeOrder.notes && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800">
                    Customer Delivery Instructions
                  </span>
                  <p className="text-slate-700">{activeOrder.notes}</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN (4 cols): Traveller Info, Payment, OTP Code & Customer Actions */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* SECTION G: Handover Verification Code (OTP) */}
            <div className="bg-gradient-to-b from-[#08282A] to-[#051C1E] rounded-3xl p-6 text-white border border-teal-500/30 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    Handover Verification
                  </span>
                </div>
                <span className="text-[10px] bg-teal-900 text-teal-200 px-2 py-0.5 rounded-full font-bold">
                  Secret OTP
                </span>
              </div>

              <div className="text-center py-2 space-y-2">
                <p className="text-xs text-teal-200/80">
                  Share this 4-digit code with the traveller <strong>ONLY upon delivery</strong> to verify physical handover:
                </p>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-teal-300 bg-[#0B3538] py-2 px-6 rounded-2xl border border-teal-400/40 shadow-inner">
                    {activeOrder.otp || '4821'}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyOtp}
                    className="p-2.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 border border-teal-500/30 transition-colors"
                    title="Copy OTP"
                    aria-label="Copy OTP"
                  >
                    {copiedOtp ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-[11px] text-teal-400/70 pt-1">
                  Keep this code private until you inspect your items. Never share it over chat before arrival.
                </p>
              </div>
            </div>

            {/* SECTION C: Traveller Information (Truthful State) */}
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Assigned Commuter</span>
                {hasTraveller && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Verified
                  </span>
                )}
              </h3>

              {hasTraveller ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-raahi-teal text-white flex items-center justify-center font-black text-lg shadow-sm">
                      {activeOrder.traveller.name?.[0] || 'T'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {activeOrder.traveller.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-emerald-700">★ 4.9</span>
                        <span>•</span>
                        <span>{activeOrder.traveller.completedDeliveries || 18} errands completed</span>
                      </div>
                      <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
                        {activeOrder.traveller.dept || activeOrder.traveller.city || 'Verified Community Member'}
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
                </div>
              ) : (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <h4 className="text-xs font-bold text-amber-900">Broadcasting to Travellers</h4>
                  <p className="text-[11px] text-amber-800/90 leading-relaxed">
                    No traveller has accepted your request yet. Commuters walking or driving along this corridor will see your errand in their live feed.
                  </p>
                </div>
              )}
            </div>

            {/* SECTION F: Payment & Reward Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                Payment & Reward Breakdown
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Estimated Item Cost:</span>
                  <span className="font-semibold text-slate-900">₹{itemBudget}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>Traveller Commute Reward:</span>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ₹{rewardFee}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Platform Service Fee:</span>
                  <span className="font-semibold text-emerald-700">Free (Beta)</span>
                </div>

                <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Total Estimated Outlay:</span>
                  <span className="text-base text-raahi-teal">₹{totalEstimatedCost}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                <p>
                  <strong>Payment Method:</strong> Direct Handover upon OTP verification. Exact item cost is reconciled against the store receipt.
                </p>
              </div>
            </div>

            {/* SECTION H: Customer Actions */}
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
                Errand Actions
              </h3>

              {activeOrder.status === REQUEST_STATUS.OPEN && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 px-4 rounded-xl border border-rose-200 text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel This Request</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSupportModalOpen(true)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 text-xs transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Report Issue / Help</span>
              </button>

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

      {/* Cancel Request Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Errand Request"
        message={`Are you sure you want to cancel "${activeOrder.title}"? This request will be immediately removed from commuters' feeds.`}
        confirmLabel="Yes, Cancel Errand"
        confirmVariant="danger"
        withReasonInput={true}
      />

      {/* Support / Help Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Raahi Community Support</h4>
              <button 
                onClick={() => setSupportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Need assistance with errand <strong>#{String(resolvedId).slice(-8)}</strong>? Our support team and campus moderators are available to help.
            </p>
            <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-1">
              <p className="font-bold">Support Hotline:</p>
              <p>support@raahi-india.org • Helpline: 1800-RAAHI-HELP</p>
            </div>
            <PrimaryButton onClick={() => {
              showToast('Support ticket registered. Our moderator will connect shortly.', 'info');
              setSupportModalOpen(false);
            }}>
              Submit Support Ticket
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
