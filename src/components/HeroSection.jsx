import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Route, 
  ShieldCheck, 
  HeartHandshake, 
  IndianRupee, 
  Footprints,
  ShoppingBag,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function HeroSection({ 
  currentRole, 
  onPrimaryAction, 
  onSecondaryAction,
  onRoleSwitch
}) {
  const isCustomer = currentRole === 'customer';

  return (
    <section className="bg-gradient-to-b from-raahi-teal via-[#0B393C] to-[#08282A] text-white pt-8 sm:pt-12 pb-10 sm:pb-16 rounded-b-[32px] sm:rounded-b-[48px] shadow-hero relative overflow-hidden border-b border-[#1A4F52]">
      {/* Decorative ambient background glows */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Value Prop & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Campus Identity Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/70 border border-teal-400/30 text-teal-100 text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Campus-Powered Commute Delivery</span>
              <span className="text-teal-400">•</span>
              <span className="text-teal-200">Delhi University Launch</span>
            </div>

            {/* Main Hero Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Going somewhere? <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-100 to-teal-300">
                Help someone along the way.
              </span>
            </h2>

            {/* Confirmed Supporting Copy */}
            <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal max-w-xl">
              Pick up an item, deliver it along your route and earn rewards to help cover your travel costs.
            </p>

            {/* Value Trust Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-teal-100/85">
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero extra commercial trips</span>
              </div>
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <IndianRupee className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Offsets metro & chai costs</span>
              </div>
              <div className="flex items-center gap-2 bg-[#061E20]/60 p-2.5 rounded-xl border border-teal-500/20">
                <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0" />
                <span>Peer-verified campus IDs</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isCustomer ? (
                <>
                  <button
                    onClick={onPrimaryAction}
                    className="bg-white hover:bg-teal-50 text-raahi-teal font-extrabold py-3.5 px-6 rounded-2xl text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 active:scale-[0.98] hover:shadow-xl"
                  >
                    <ShoppingBag className="w-5 h-5 text-raahi-teal" />
                    <span>Post an Errand Request</span>
                    <ArrowRight className="w-4 h-4 text-raahi-teal" />
                  </button>
                  <button
                    onClick={onSecondaryAction}
                    className="bg-[#092B2D] hover:bg-[#062022] text-teal-100 border border-teal-500/30 font-bold py-3.5 px-6 rounded-2xl text-sm sm:text-base transition-all flex items-center gap-2"
                  >
                    <span>Browse Campus Tasks</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onPrimaryAction}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 active:scale-[0.98]"
                  >
                    <Footprints className="w-5 h-5 text-slate-950" />
                    <span>Set Commute Journey</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                  <button
                    onClick={onSecondaryAction}
                    className="bg-[#092B2D] hover:bg-[#062022] text-teal-100 border border-teal-500/30 font-bold py-3.5 px-6 rounded-2xl text-sm sm:text-base transition-all flex items-center gap-2"
                  >
                    <span>View Compatible Requests</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Campus Lifestyle & Commute Network Interactive Infographic */}
          <div className="lg:col-span-5">
            <div className="bg-[#051C1E]/85 border border-teal-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative">
              <div className="flex items-center justify-between pb-3.5 border-b border-teal-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Live Campus Waypoint Network</h4>
                    <p className="text-[11px] text-teal-300/80">Kamla Nagar ⇄ Arts Faculty ⇄ Metro</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                  Active Now
                </span>
              </div>

              {/* Waypoint Steps Visualization */}
              <div className="py-4 space-y-3.5">
                <div className="flex items-center justify-between text-xs bg-[#092B2D]/70 p-3 rounded-2xl border border-teal-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal-600/30 border border-teal-400 flex items-center justify-center text-xs font-bold text-teal-200">
                      1
                    </div>
                    <div>
                      <span className="font-bold text-white block">Sudama & Market Shops</span>
                      <span className="text-[11px] text-teal-300/70">Pick up snacks, notes, pharmacy</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold">Start Point</span>
                </div>

                <div className="flex items-center justify-between text-xs bg-[#092B2D]/70 p-3 rounded-2xl border border-teal-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center text-xs font-bold text-amber-200">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-white block">Student's Existing Walk</span>
                      <span className="text-[11px] text-teal-300/70">Detour: only +150m to +350m</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-teal-200 font-bold">~5-8 min</span>
                </div>

                <div className="flex items-center justify-between text-xs bg-[#092B2D]/70 p-3 rounded-2xl border border-teal-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-200">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-white block">Hostel or Faculty Drop</span>
                      <span className="text-[11px] text-teal-300/70">Handover with 4-digit verification code</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-bold">Completed</span>
                </div>
              </div>

              {/* Reward Metric Banner */}
              <div className="pt-3 border-t border-teal-500/20 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-teal-200/90">
                  <HeartHandshake className="w-4 h-4 text-teal-300" />
                  <span>Student Travel Reward:</span>
                </span>
                <span className="font-black text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-xl text-sm">
                  ₹35 - ₹80 / errand
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
