import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  MapPin, 
  Clock, 
  Compass, 
  IndianRupee, 
  ChevronRight, 
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function RequestCard({
  request,
  onSelect,
  onAccept,
  isTravellerView = false,
  showActions = true
}) {
  const isBuy = request.type === 'buy';

  return (
    <div 
      className="bg-white rounded-2xl p-4 border border-raahi-border shadow-soft hover:shadow-card hover:border-teal-300 transition-all duration-200 relative group"
    >
      {/* Top Meta Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span 
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              isBuy 
                ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {isBuy ? <ShoppingCart className="w-3 h-3" /> : <Package className="w-3 h-3" />}
            <span>{isBuy ? 'Buy & Deliver' : 'Pick Up & Deliver'}</span>
          </span>

          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{request.neededBy}</span>
          </span>
        </div>

        {/* Reward Pill: Prominently formatted to cover travel expenses */}
        <div className="text-right shrink-0">
          <div className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold text-xs sm:text-sm">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
            <span>{request.rewardFee}</span>
          </div>
          <span className="block text-[9px] text-slate-400 font-medium tracking-tight">travel reward</span>
        </div>
      </div>

      {/* Title */}
      <h4 
        onClick={() => onSelect && onSelect(request)}
        className="text-sm sm:text-base font-bold text-raahi-text-main group-hover:text-raahi-teal transition-colors cursor-pointer leading-snug mb-2"
      >
        {request.title}
      </h4>

      {/* Customer Quick Profile */}
      <div className="flex items-center justify-between text-xs text-slate-500 pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-raahi-teal text-white flex items-center justify-center text-[10px] font-bold">
            {request.customer?.name?.[0] || 'C'}
          </div>
          <div>
            <span className="font-semibold text-slate-700 block text-[11px] leading-tight">
              {request.customer?.name}
            </span>
            <span className="text-[10px] text-slate-400 block leading-tight">
              {request.customer?.dept}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{request.customer?.rating}</span>
        </div>
      </div>

      {/* Route & Waypoint Details */}
      <div className="space-y-1.5 text-xs mb-3 bg-[#F8FBFC] p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
          <span className="font-medium text-slate-500 text-[11px] w-12 shrink-0">
            {isBuy ? 'Purchase:' : 'Collect:'}
          </span>
          <span className="font-semibold text-slate-800 truncate text-[11px]">
            {request.storeOrPickup}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <span className="font-medium text-slate-500 text-[11px] w-12 shrink-0">Deliver:</span>
          <span className="font-semibold text-slate-800 truncate text-[11px]">
            {request.destination}
          </span>
        </div>
      </div>

      {/* Detour Metric & Item Budget Footer */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span className="inline-flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
            <Compass className="w-3 h-3 text-teal-600" />
            <span>+{request.detourMeters}m ({request.detourTimeMinutes} min)</span>
          </span>

          {isBuy && request.itemBudget > 0 && (
            <span className="text-slate-500 text-[11px] hidden xs:inline">
              Est. Bill: ₹{request.itemBudget}
            </span>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-1.5">
            {isTravellerView ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept && onAccept(request);
                }}
                className="bg-raahi-teal hover:bg-teal-900 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-sm transition-all flex items-center gap-1 active:scale-95"
              >
                <span>Accept</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelect && onSelect(request)}
                className="text-raahi-teal hover:text-teal-900 font-bold text-xs flex items-center gap-1 py-1"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
