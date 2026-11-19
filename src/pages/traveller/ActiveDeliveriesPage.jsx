import React, { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import StatusStepper from '../../components/StatusStepper';
import ConfirmModal from '../../components/ConfirmModal';
import { useRaahi } from '../../context/RaahiContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  IndianRupee, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Package
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import ActiveSmartPoolCard from '../../components/ActiveSmartPoolCard';
import { REQUEST_STATUS } from '../../utils/constants';

export default function ActiveDeliveriesPage({ onNavigate }) {
  const { 
    user, 
    currentRole, 
    setRole, 
    activeDeliveries, 
    activeSmartPool,
    advanceSmartPoolStop,
    cancelSmartPool,
    advanceDeliveryStatus, 
    disputeDelivery, 
    cancelRequest, 
    showToast 
  } = useRaahi();

  const [otpInputs, setOtpInputs] = useState({});
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [activeReqId, setActiveReqId] = useState(null);

  const handleOtpChange = (reqId, val) => {
    setOtpInputs(prev => ({ ...prev, [reqId]: val }));
  };

  const handleAdvance = (req) => {
    if (req.status === REQUEST_STATUS.IN_TRANSIT) {
      const code = otpInputs[req.id];
      if (!code || code.trim() !== req.otp.trim()) {
        showToast(`Verification code must match customer's 4-digit OTP (${req.otp})`, 'error');
        return;
      }
      advanceDeliveryStatus(req.id, code);
      onNavigate('traveller-earnings');
    } else {
      advanceDeliveryStatus(req.id);
    }
  };

  const handleOpenDispute = (reqId) => {
    setActiveReqId(reqId);
    setDisputeModalOpen(true);
  };

  const handleConfirmDispute = (reason) => {
    if (activeReqId) {
      disputeDelivery(activeReqId, reason);
    }
    setDisputeModalOpen(false);
    setActiveReqId(null);
  };

  const handleOpenCancel = (reqId) => {
    setActiveReqId(reqId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    if (activeReqId) {
      cancelRequest(activeReqId, reason);
    }
    setCancelModalOpen(false);
    setActiveReqId(null);
  };

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
                Delivery Execution Lifecycle
              </span>
              <h1 className="text-2xl font-black text-white">Active Tasks in Progress</h1>
            </div>
          </div>

          <span className="text-xs font-bold bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl">
            {activeDeliveries.length} Active
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="hidden lg:block">
            <DashboardSidebar
              currentRole={currentRole}
              activeScreen="traveller-active"
              onNavigate={onNavigate}
              onRoleToggle={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
            />
          </div>

          <div className="flex-1 w-full space-y-6">
            
            {/* Active Smart Pool Card */}
            {activeSmartPool && (
              <ActiveSmartPoolCard
                pool={activeSmartPool}
                onAdvance={advanceSmartPoolStop}
                onCancel={cancelSmartPool}
              />
            )}

            {activeDeliveries.length > 0 ? (
              activeDeliveries.map((req) => {
                const stepIndex = 
                  req.status === REQUEST_STATUS.ACCEPTED ? 2 :
                  req.status === REQUEST_STATUS.PICKED_UP ? 3 :
                  req.status === REQUEST_STATUS.IN_TRANSIT ? 4 : 5;

                const isReadyForHandover = req.status === REQUEST_STATUS.IN_TRANSIT;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            req.type === 'buy' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}>
                            {req.type === 'buy' ? 'Buy & Deliver' : 'Pick Up'}
                          </span>
                          <span className="text-xs font-mono text-slate-400">#{req.id}</span>
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{req.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold">REWARD</span>
                          <span className="text-base font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                            +₹{req.rewardFee}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stepper Progression */}
                    <div className="bg-[#F8FBFC] p-4 sm:p-5 rounded-2xl border border-slate-100">
                      <StatusStepper currentStep={stepIndex} />
                    </div>

                    {/* Customer & Route Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Collection Point</span>
                        <strong className="text-slate-900 text-sm block mt-0.5">{req.storeOrPickup}</strong>
                        <span className="text-slate-500">{req.pickupArea}</span>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Delivery Drop Point</span>
                        <strong className="text-slate-900 text-sm block mt-0.5">{req.destination}</strong>
                        <span className="text-slate-500">{req.dropArea}</span>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Peer</span>
                          <strong className="text-slate-900 text-sm block mt-0.5">{req.customer?.name}</strong>
                          <span className="text-teal-700">{req.customer?.dept}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => showToast(`Calling ${req.customer?.name}...`, 'info')}
                            className="bg-white hover:bg-slate-100 text-slate-700 p-2 rounded-xl border border-slate-200 text-xs flex items-center gap-1 font-semibold"
                          >
                            <Phone className="w-3.5 h-3.5 text-teal-600" />
                            <span>Call</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast(`Messaging ${req.customer?.name}...`, 'info')}
                            className="bg-white hover:bg-slate-100 text-slate-700 p-2 rounded-xl border border-slate-200 text-xs flex items-center gap-1 font-semibold"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                            <span>Message</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Handover OTP Verification (When in transit) */}
                    {isReadyForHandover && (
                      <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-teal-900 block">
                              Final Step: Enter Customer's 4-Digit Handover Code
                            </span>
                            <span className="text-[11px] text-teal-700">
                              Ask the customer for their code in person to disburse the ₹{req.rewardFee} reward. (Demo code: <strong>{req.otp}</strong>)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            maxLength="4"
                            placeholder="e.g. 4821"
                            value={otpInputs[req.id] || ''}
                            onChange={(e) => handleOtpChange(req.id, e.target.value)}
                            className="w-32 text-center text-lg font-mono font-bold tracking-widest p-2.5 rounded-xl border border-teal-300 bg-white outline-none focus:ring-2 focus:ring-teal-400"
                          />
                          <PrimaryButton
                            onClick={() => handleAdvance(req)}
                            variant="primary"
                            size="md"
                            fullWidth={false}
                          >
                            Verify & Complete Delivery
                          </PrimaryButton>
                        </div>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDispute(req.id)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          Report Issue
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          onClick={() => handleOpenCancel(req.id)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800"
                        >
                          Cancel Assignment
                        </button>
                      </div>

                      {!isReadyForHandover && (
                        <PrimaryButton
                          onClick={() => handleAdvance(req)}
                          variant="primary"
                          size="md"
                          fullWidth={false}
                        >
                          {req.status === REQUEST_STATUS.ACCEPTED ? 'Confirm Item Picked Up' : 'Mark En Route to Drop Point'}
                        </PrimaryButton>
                      )}
                    </div>
                  </div>
                );
              })
            ) : !activeSmartPool ? (
              <div className="py-20 bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No active deliveries right now</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse matching errands along your route and accept suitable tasks to earn rewards.
                </p>
                <div className="mt-4">
                  <PrimaryButton onClick={() => onNavigate('traveller-matching')} variant="primary" size="sm">
                    Browse Matching Errands
                  </PrimaryButton>
                </div>
              </div>
            ) : null}

          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        onConfirm={handleConfirmDispute}
        title="Report Delivery Issue"
        message="Let the campus coordinator know what happened (e.g. shop closed, item out of stock, customer unreachable)."
        confirmLabel="Submit Issue"
        confirmVariant="danger"
        withReasonInput={true}
        reasonPlaceholder="Describe the issue in detail..."
      />

      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Delivery Assignment"
        message="Are you sure you want to release this task? It will be re-assigned to other available campus commuters."
        confirmLabel="Yes, Release Task"
        confirmVariant="danger"
        withReasonInput={true}
      />
    </div>
  );
}
