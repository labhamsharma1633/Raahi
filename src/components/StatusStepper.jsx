import React from 'react';
import { CheckCircle2, Clock, CircleDot, PackageCheck, ShoppingBag, Truck } from 'lucide-react';

export default function StatusStepper({ 
  currentStep = 1, 
  steps = [
    { label: "Request Placed", description: "Broadcasted to campus travellers along route", time: "1:15 PM" },
    { label: "Traveller Assigned", description: "Aarav is travelling from Kamla Nagar", time: "1:22 PM" },
    { label: "Item Collected", description: "Purchased & checked receipt", time: "1:35 PM" },
    { label: "On The Way", description: "Walking towards Gwyer Hall (Detour +200m)", time: "ETA 1:45 PM" },
    { label: "Delivered", description: "Handover completed & verified", time: "Pending" }
  ]
}) {
  return (
    <div className="w-full py-2">
      <div className="space-y-4 relative">
        {/* Continuous track line */}
        <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-slate-200 -z-0" />

        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={idx} className="flex items-start gap-3.5 relative z-10">
              {/* Step Indicator Dot / Icon */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  isCompleted 
                    ? 'bg-raahi-teal border-raahi-teal text-white shadow-sm' 
                    : isCurrent 
                      ? 'bg-white border-raahi-teal text-raahi-teal ring-4 ring-teal-100 animate-pulse' 
                      : 'bg-white border-slate-200 text-slate-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : isCurrent ? (
                  <CircleDot className="w-4 h-4 text-raahi-teal" />
                ) : (
                  <span className="text-xs font-semibold">{stepNumber}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-0.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className={`text-xs sm:text-sm font-bold ${
                    isCurrent ? 'text-raahi-teal' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </h5>
                  {step.time && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isCurrent 
                        ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200' 
                        : 'text-slate-400'
                    }`}>
                      {step.time}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
