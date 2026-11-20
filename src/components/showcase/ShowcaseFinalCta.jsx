import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  HeartHandshake, 
  Users, 
  ShoppingBag, 
  Footprints,
  ShieldCheck
} from 'lucide-react';
import { useRaahi } from '../../context/RaahiContext';

export default function ShowcaseFinalCta({ onNavigate }) {
  const { user, currentRole } = useRaahi();

  const handleExplore = () => {
    if (user) {
      onNavigate(currentRole === 'traveller' ? 'traveller-dashboard' : 'customer-dashboard');
    } else {
      onNavigate('register');
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-[#072426] via-[#0D3B3E] to-[#041517] text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute left-10 top-0 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-teal-400/30 text-teal-100 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>The Future of Community Convenience</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Imagine what your community <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-amber-200">
            could do with Raahi.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto leading-relaxed">
          Your next journey or everyday errand could help someone. Join thousands of students, commuters, and neighbors saving money and helping each other.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm hover:from-emerald-300 hover:to-teal-300 transition-all shadow-xl hover:shadow-emerald-400/25 flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>Explore Raahi</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('circles')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-emerald-300" />
            <span>Discover Circles</span>
          </button>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="pt-8 border-t border-teal-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-teal-200/90 text-left">
          <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <Footprints className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white">Route-Based Delivery</strong>
              <span>Offset daily metro and bus passes without detour.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <ShoppingBag className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white">Group Shopping</strong>
              <span>Pool baskets to reach minimum order value thresholds.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white">4-Digit OTP Security</strong>
              <span>Direct peer accountability and confirmed handovers.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
