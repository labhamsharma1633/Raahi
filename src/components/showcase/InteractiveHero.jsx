import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  ShoppingBag, 
  Footprints, 
  Compass, 
  CheckCircle2, 
  MapPin, 
  Coffee, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function InteractiveHero({ onExplore, onHowItWorks }) {
  const [activeScenario, setActiveScenario] = useState('pg'); // 'pg' | 'office' | 'campus'

  const scenarios = {
    pg: {
      tag: 'Hostel & PG Living',
      question: 'Need groceries but under the ₹150 minimum order threshold?',
      solution: 'Pool baskets with roommates in your Circle and checkout together.',
      badge: 'Group Shopping',
      color: 'from-emerald-400 to-teal-300',
    },
    office: {
      tag: 'Corporate & Co-Working',
      question: 'Stuck in meetings and craving tea or snacks from downstairs?',
      solution: 'Post a Quick Errand for a colleague already heading to the cafeteria.',
      badge: 'Quick Errands',
      color: 'from-amber-300 to-orange-400',
    },
    campus: {
      tag: 'College Campus Life',
      question: 'Walking back from metro to hostel with an empty bag?',
      solution: 'Pick up printing notes or pharmacy items on your route and offset your metro fare.',
      badge: 'Route Travel',
      color: 'from-cyan-300 to-blue-400',
    },
  };

  const curr = scenarios[activeScenario];

  return (
    <section className="bg-gradient-to-b from-[#072426] via-[#0D3B3E] to-[#0A2F32] text-white pt-10 sm:pt-16 pb-14 sm:pb-20 rounded-b-[36px] sm:rounded-b-[56px] shadow-2xl relative overflow-hidden border-b border-[#1A4F52]">
      {/* Decorative ambient background glows */}
      <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute left-[-5%] bottom-[-5%] w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headlines, Value Prop & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Community Identity Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08282A]/80 border border-teal-400/30 text-teal-100 text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Community-Powered Logistics</span>
              <span className="text-teal-400">•</span>
              <span className="text-emerald-300 font-semibold">Zero commercial fleet emissions</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Everyday needs. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-100 to-amber-200">
                Community-powered.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal max-w-xl">
              Raahi connects people travelling in the same direction and communities that help each other make everyday life easier.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg hover:shadow-emerald-400/25 flex items-center gap-2 group active:scale-95"
              >
                <span>Explore Raahi</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onHowItWorks}
                className="px-6 py-3.5 rounded-2xl bg-[#082B2E]/90 hover:bg-[#0E3D42] text-teal-100 font-bold text-sm border border-teal-500/30 transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>How Raahi Works</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-teal-100/85">
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero fleet surcharges</span>
              </div>
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <Users className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Trusted peer circles</span>
              </div>
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0" />
                <span>4-digit OTP handover</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Scenario Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#0B393C] to-[#061E20] p-6 sm:p-7 rounded-3xl border border-teal-500/30 shadow-2xl space-y-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-teal-900/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-200">
                    Interactive Preview
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-900/90 text-teal-300 border border-teal-500/30">
                  Try Clicking Scenarios
                </span>
              </div>

              {/* Scenario Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#041517] rounded-2xl border border-teal-900">
                {[
                  { id: 'pg', label: 'Hostel/PG' },
                  { id: 'office', label: 'Office' },
                  { id: 'campus', label: 'Campus' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenario(s.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl transition-all text-center truncate ${
                      activeScenario === s.id
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                        : 'text-teal-300/70 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Scenario Stage */}
              <div className="p-4 bg-[#072426] rounded-2xl border border-teal-800/60 space-y-3 min-h-[155px] flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                      {curr.tag}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/10 text-emerald-200">
                      {curr.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    "{curr.question}"
                  </h4>
                </div>

                <div className="pt-2 border-t border-teal-900/60 flex items-start gap-2 text-xs text-teal-200/90">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>The Raahi Solution:</strong> {curr.solution}</span>
                </div>
              </div>

              {/* Interactive prompt button */}
              <button
                onClick={onExplore}
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-colors"
              >
                <span>See How {curr.badge} Works Below</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
