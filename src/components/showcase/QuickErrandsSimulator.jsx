import React, { useState } from 'react';
import { 
  Coffee, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Key, 
  RotateCcw,
  User,
  HeartHandshake,
  Check
} from 'lucide-react';

const STEPS = [
  {
    id: 'open',
    status: 'OPEN',
    title: '1. Request Posted',
    actor: 'Rahul (Desk 412, Marketing)',
    description: 'Rahul is on a deadline and posts an errand for 2 cold coffees from the Ground Floor cafeteria.',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'accepted',
    status: 'ACCEPTED',
    title: '2. Colleague Accepts',
    actor: 'Aman (Desk 408, Tech)',
    description: 'Aman is stepping away for a 10-minute afternoon break and clicks "Accept Request" on his phone.',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    id: 'picked_up',
    status: 'PICKED UP',
    title: '3. Items Picked Up',
    actor: 'Aman (Cafeteria)',
    description: 'Aman collects the cold coffees from the counter and starts walking back to Floor 4.',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'handed_over',
    status: 'HANDED OVER',
    title: '4. Arrival & Handover',
    actor: 'Aman & Rahul (Desk 412)',
    description: 'Aman reaches Rahul\'s desk. Rahul shares his 4-digit handover verification code.',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  {
    id: 'completed',
    status: 'COMPLETED',
    title: '5. Completed & Settled',
    actor: 'Both Colleagues',
    description: 'OTP verified! Rahul enjoys his cold coffee; Aman earns a ₹25 coffee tip.',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
];

export default function QuickErrandsSimulator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <section id="errands-showcase" className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-800 bg-blue-100/80 px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5 text-blue-700" />
            <span>Interactive Workflow Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Need something? <br className="hidden sm:inline" />
            <span className="text-blue-700">Someone nearby might be going that way.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Step through this interactive office scenario to see how colleagues fulfill small favours along their natural walking path.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600">
            * Interactive simulation: click the steps or action buttons below to advance the errand lifecycle.
          </div>
        </div>

        {/* The Interactive Board */}
        <div className="max-w-4xl mx-auto bg-slate-50/70 rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Top Interactive Progress Timeline */}
          <div className="p-6 bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold text-blue-400 tracking-wider">
                Errand Lifecycle Timeline
              </span>
              <button
                onClick={handleReset}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Story</span>
              </button>
            </div>

            {/* Stepper Nodes */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2 pt-2">
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className="flex flex-col items-center gap-1.5 group text-left transition-all"
                  >
                    <div className="w-full flex items-center">
                      <div 
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all mx-auto ${
                          isActive
                            ? 'bg-blue-500 text-white ring-4 ring-blue-500/30 shadow-lg scale-110'
                            : isPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold truncate max-w-full hidden sm:block ${
                      isActive ? 'text-blue-300' : isPassed ? 'text-emerald-300' : 'text-slate-400'
                    }`}>
                      {step.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Storyboard Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Errand Brief Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0">
                    ☕
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Office Errand</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentStep.badge}`}>
                        {currentStep.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      2 Hazelnut Cold Coffees
                    </h3>
                  </div>
                </div>

                {/* Price Breakdown Ribbon */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Item Cost</span>
                    <strong className="text-xs font-bold text-slate-900">₹140</strong>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Helper Tip</span>
                    <strong className="text-xs font-black text-emerald-700">+₹25</strong>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Pickup:</strong> Ground Floor Cafeteria (Counter 2)</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Handover:</strong> 4th Floor Tech Wing (Desk 412)</span>
                </div>
              </div>

              {/* Step Narrative Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-blue-900 uppercase tracking-wider">
                    {currentStep.title}
                  </span>
                  <span className="text-slate-500 font-semibold">{currentStep.actor}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentStep.description}
                </p>
              </div>

              {/* Step 4 OTP Reveal Highlight */}
              {currentStep.id === 'handed_over' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 animate-fade-in text-amber-950">
                  <div className="flex items-center gap-2.5">
                    <Key className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <strong className="text-xs font-bold block">One-Time Handover Code (OTP)</strong>
                      <span className="text-[11px] text-amber-800">Rahul provides this 4-digit code to Aman at his desk</span>
                    </div>
                  </div>
                  <span className="font-mono text-base font-black px-3 py-1 bg-amber-200/90 rounded-xl tracking-widest text-amber-950">
                    7 4 9 2
                  </span>
                </div>
              )}

              {/* Step 5 Concluding Message */}
              {currentStep.id === 'completed' && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 text-center space-y-2 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">
                    One small favour. One happier workday.
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Rahul didn't lose 25 minutes of productive time; Aman easily earned ₹25 on a walking break he was already taking. No commercial vehicles, zero hassle.
                  </p>
                </div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>

              {currentStepIndex < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 active:scale-95"
                >
                  <span>
                    {currentStepIndex === 0 && 'Aman Sees & Accepts Request →'}
                    {currentStepIndex === 1 && 'Aman Picks Up Cold Coffees →'}
                    {currentStepIndex === 2 && 'Aman Reaches Desk for Handover →'}
                    {currentStepIndex === 3 && 'Verify Handover OTP & Complete →'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-[#0D3B3E] hover:bg-[#124e52] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Replay Demonstration</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
