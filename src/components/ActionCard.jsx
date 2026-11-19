import React from 'react';
import { ShoppingCart, Package, ArrowRight, Clock, Store, MapPin } from 'lucide-react';

export default function ActionCard({
  type = 'buy', // 'buy' or 'pickup'
  title,
  subtitle,
  badgeText,
  badgeColor = 'teal',
  examples = [],
  onClick,
  estimatedDetour = 'Low Detour',
  popularIn = 'Kamla Nagar / Patel Chest'
}) {
  const isBuy = type === 'buy';

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-raahi-border shadow-soft hover:shadow-card hover:border-teal-300 transition-all duration-200 cursor-pointer group relative overflow-hidden"
    >
      {/* Top Accent Indicator */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isBuy ? 'bg-gradient-to-r from-teal-600 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
        }`} 
      />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              isBuy 
                ? 'bg-raahi-teal/10 text-raahi-teal' 
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {isBuy ? (
              <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <Package className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-raahi-text-main group-hover:text-raahi-teal transition-colors">
                {title}
              </h3>
            </div>
            <p className="text-xs text-raahi-text-sub mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {badgeText && (
          <span 
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
              isBuy 
                ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Typical Examples Pill Box */}
      {examples && examples.length > 0 && (
        <div className="bg-[#F6FAFC] rounded-xl p-2.5 my-3 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
            {isBuy ? <Store className="w-3 h-3 text-slate-400" /> : <Package className="w-3 h-3 text-slate-400" />}
            <span>Common campus requests:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {examples.map((ex, idx) => (
              <span 
                key={idx} 
                className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80 font-medium"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info Row */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-teal-600" />
            <span>{popularIn}</span>
          </span>
          <span className="flex items-center gap-1 hidden xs:inline-flex">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{estimatedDetour}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 font-bold text-raahi-teal group-hover:translate-x-0.5 transition-transform">
          <span>Start</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
