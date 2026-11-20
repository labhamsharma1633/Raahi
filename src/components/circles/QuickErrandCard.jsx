import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Key, 
  ArrowRight,
  User,
  Loader2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

const STATUS_CONFIG = {
  OPEN: { label: 'Open Request', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ACCEPTED: { label: 'Helper Assigned', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  PURCHASED: { label: 'Purchased', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  HANDED_OVER: { label: 'Awaiting OTP Handover', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  COMPLETED: { label: 'Completed', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-slate-100 text-slate-500 border-slate-200' },
  EXPIRED: { label: 'Expired', bg: 'bg-rose-50 text-rose-600 border-rose-200' },
};

const CATEGORY_ICONS = {
  grocery: '🛒',
  food_beverage: '☕',
  pharmacy: '💊',
  stationery: '📝',
  parcel: '📦',
  other: '✨',
};

export function QuickErrandCard({ errand, currentUserId, onUpdated }) {
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [receiptProof, setReceiptProof] = useState('');

  const isRequester = errand.requester && (
    (typeof errand.requester === 'object' ? errand.requester._id : errand.requester) === currentUserId
  );

  const isHelper = errand.helper && (
    (typeof errand.helper === 'object' ? errand.helper._id : errand.helper) === currentUserId
  );

  const statusInfo = STATUS_CONFIG[errand.status] || STATUS_CONFIG.OPEN;
  const icon = CATEGORY_ICONS[errand.category] || '🛒';

  // Format deadline
  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'Flexible';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.round((d - now) / 60000);
    if (diffMins < 0) return 'Overdue';
    if (diffMins < 60) return `in ${diffMins} mins`;
    const hours = Math.round(diffMins / 60);
    return `in ~${hours} hr${hours > 1 ? 's' : ''}`;
  };

  const handleAccept = async () => {
    try {
      setIsActing(true);
      setError(null);
      const res = await apiClient.acceptCircleErrand(errand._id);
      if (res && res.status === 'success' && onUpdated) {
        onUpdated(res.data.errand);
      }
    } catch (err) {
      setError(err.message || 'Could not accept errand. It may have already been claimed.');
    } finally {
      setIsActing(false);
    }
  };

  const handleAdvance = async (targetStatus, customPayload = {}) => {
    try {
      setIsActing(true);
      setError(null);
      const res = await apiClient.advanceCircleErrand(errand._id, targetStatus, customPayload);
      if (res && res.status === 'success') {
        setShowOtpInput(false);
        setOtpCode('');
        if (onUpdated) onUpdated(res.data.errand);
      }
    } catch (err) {
      setError(err.message || 'Failed to update errand state.');
    } finally {
      setIsActing(false);
    }
  };

  const handleVerifyOtpAndComplete = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 4) {
      setError('Please enter the 4-digit handover code.');
      return;
    }
    await handleAdvance('COMPLETED', { otpCode, receiptProof });
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this errand?')) return;
    try {
      setIsActing(true);
      setError(null);
      const res = await apiClient.cancelCircleErrand(errand._id, 'Cancelled by requester');
      if (res && res.status === 'success' && onUpdated) {
        onUpdated(res.data.errand);
      }
    } catch (err) {
      setError(err.message || 'Could not cancel errand.');
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner for user role */}
      {isRequester && (
        <div className="absolute top-0 right-0 bg-[#0D3B3E] text-emerald-300 text-[10px] font-bold px-3 py-0.5 rounded-bl-xl tracking-wider uppercase">
          Your Request
        </div>
      )}
      {isHelper && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl tracking-wider uppercase">
          You are Helper
        </div>
      )}

      <div>
        {/* Header: Category & Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl" role="img" aria-label={errand.category}>
            {icon}
          </span>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.bg}`}>
            {statusInfo.label}
          </span>
          <span className="text-slate-400 text-xs ml-auto flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {formatDeadline(errand.deadline)}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-800 line-clamp-2 mb-2 leading-snug">
          {errand.title}
        </h4>

        {/* Requester & Locations */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
              {errand.requester?.name ? errand.requester.name[0].toUpperCase() : 'U'}
            </div>
            <span className="font-semibold text-slate-800">
              {errand.requester?.name || 'Circle Member'}
            </span>
          </div>

          {errand.pickupLocationName && (
            <div className="flex items-start gap-1.5 text-slate-600 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><span className="font-medium text-slate-500">Pick up:</span> {errand.pickupLocationName}</span>
            </div>
          )}

          {errand.handoverLocationName && (
            <div className="flex items-start gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><span className="font-medium text-slate-500">Deliver to:</span> {errand.handoverLocationName}</span>
            </div>
          )}

          {errand.instructions && (
            <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/50">
              "{errand.instructions}"
            </p>
          )}
        </div>

        {/* Budget & Tip Ribbon */}
        <div className="flex items-center justify-between mb-4 px-3 py-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
          <div>
            <div className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Item Cost</div>
            <div className="text-base font-bold text-emerald-950">₹{errand.itemBudget}</div>
          </div>
          {errand.rewardFee > 0 && (
            <div className="text-right">
              <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Helper Tip</div>
              <div className="text-sm font-bold text-emerald-700 flex items-center justify-end gap-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                +₹{errand.rewardFee}
              </div>
            </div>
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-2.5 mb-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Requester Handover OTP Card */}
        {isRequester && errand.handoverOtp && errand.status !== 'COMPLETED' && errand.status !== 'CANCELLED' && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Key className="w-4 h-4 text-amber-700" />
                <span>Handover Verification Code</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-200/80 rounded-lg font-mono font-black text-sm tracking-widest text-amber-950">
                {errand.handoverOtp}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              Give this 4-digit code to your helper when they deliver your items.
            </p>
          </div>
        )}

        {/* Helper OTP Verification Input */}
        {isHelper && showOtpInput && (
          <form onSubmit={handleVerifyOtpAndComplete} className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              Enter Handover OTP from Requester
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength="4"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit code"
                className="w-full px-3 py-1.5 rounded-lg border border-indigo-300 font-mono tracking-widest text-center text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={isActing || otpCode.length !== 4}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors"
              >
                {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowOtpInput(false)}
              className="text-[11px] text-indigo-600 underline font-medium"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* When Errand is OPEN */}
        {errand.status === 'OPEN' && !isRequester && (
          <button
            onClick={handleAccept}
            disabled={isActing}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0D3B3E] hover:bg-[#124e52] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isActing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>I'll Pick This Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}

        {/* When current user is Helper */}
        {isHelper && (
          <div className="w-full flex items-center gap-2">
            {errand.status === 'ACCEPTED' && (
              <button
                onClick={() => handleAdvance('IN_PROGRESS')}
                disabled={isActing}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                Start Errand (On My Way)
              </button>
            )}

            {errand.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleAdvance('PURCHASED')}
                disabled={isActing}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Mark Items Purchased
              </button>
            )}

            {errand.status === 'PURCHASED' && (
              <button
                onClick={() => handleAdvance('HANDED_OVER')}
                disabled={isActing}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                At Delivery Spot
              </button>
            )}

            {errand.status === 'HANDED_OVER' && !showOtpInput && (
              <button
                onClick={() => setShowOtpInput(true)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <Key className="w-3.5 h-3.5" />
                Enter Handover OTP
              </button>
            )}
          </div>
        )}

        {/* Requester Actions */}
        {isRequester && (errand.status === 'OPEN' || errand.status === 'ACCEPTED') && (
          <button
            onClick={handleCancel}
            disabled={isActing}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors ml-auto"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancel Errand
          </button>
        )}

        {/* Completed Indicator */}
        {errand.status === 'COMPLETED' && (
          <div className="w-full text-center text-xs font-bold text-emerald-700 py-1 bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Handover Complete & Verified
          </div>
        )}
      </div>
    </div>
  );
}
