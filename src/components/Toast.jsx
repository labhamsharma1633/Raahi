import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-300 shrink-0" />
  };

  const bgStyles = {
    success: "bg-[#072426] border-emerald-500/40 text-white",
    error: "bg-[#2A080A] border-rose-500/40 text-white",
    warning: "bg-[#2A1B08] border-amber-500/40 text-white",
    info: "bg-[#0A2E33] border-teal-500/40 text-white"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 pointer-events-none animate-slide-up">
      <div 
        className={`p-4 rounded-2xl border shadow-2xl flex items-start justify-between gap-3 pointer-events-auto backdrop-blur-md ${
          bgStyles[toast.type] || bgStyles.info
        }`}
      >
        <div className="flex items-start gap-3">
          {icons[toast.type] || icons.info}
          <p className="text-xs sm:text-sm font-medium leading-snug">
            {toast.message}
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white p-0.5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
