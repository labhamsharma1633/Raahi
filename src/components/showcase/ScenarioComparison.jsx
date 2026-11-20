import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  ShoppingBag, 
  Coffee, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  IndianRupee, 
  Users, 
  Sparkles,
  Clock
} from 'lucide-react';

export default function ScenarioComparison({ onExploreShopping, onExploreErrands }) {
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'pg' | 'office'

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-800 bg-teal-100/80 px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Real-Life Scenarios</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Small everyday problems. <br className="hidden sm:inline" />
            <span className="text-raahi-teal">Smarter ways to solve them.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Traditional delivery apps were built for big standalone orders with hefty delivery fees. See how Raahi solves daily convenience from within your building and community.
          </p>
        </div>

        {/* Filter View Selector */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'both' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Scenarios
            </button>
            <button
              onClick={() => setActiveTab('pg')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'pg' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span>Scenario A: PG Life</span>
            </button>
            <button
              onClick={() => setActiveTab('office')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'office' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Scenario B: Office Life</span>
            </button>
          </div>
        </div>

        {/* The Two Relatable Scenarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* SCENARIO A: PG LIFE */}
          {(activeTab === 'both' || activeTab === 'pg') && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                {/* Header Badge */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 tracking-wider">
                      Scenario A
                    </span>
                    <span className="text-xs font-bold text-emerald-100 flex items-center gap-1">
                      <Home className="w-3.5 h-3.5" />
                      Hostel & PG Resident
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white pt-1">
                    The ₹60 Grocery Dilemma
                  </h3>
                  <p className="text-xs text-emerald-100/90">
                    Someone living in a PG wants to order groceries, but their basket is below the retailer's minimum order value.
                  </p>
                </div>

                {/* The Comparison Cards */}
                <div className="p-6 space-y-4">
                  {/* The Everyday Friction */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 text-xs font-black uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>The Frustrating Way</span>
                    </div>
                    <ul className="text-xs text-rose-950 space-y-1.5 pl-6 list-disc">
                      <li>You only need a pack of milk (₹30) and brown bread (₹35) = ₹65 total.</li>
                      <li>Retailer requires <strong>₹150 to ₹199 minimum order value</strong> to allow checkout.</li>
                      <li>You are forced to add unwanted junk snacks just to meet the cart threshold, or pay a ₹35 small-cart penalty.</li>
                    </ul>
                  </div>

                  {/* The Raahi Way */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>The Raahi Group Shopping Way</span>
                    </div>
                    <ul className="text-xs text-emerald-950 space-y-1.5 pl-6 list-disc">
                      <li>You add your milk & bread (₹65) to your <strong>Hostel Floor Circle</strong>.</li>
                      <li>Roommate Priya adds eggs (₹55); Aman adds curd & bananas (₹65).</li>
                      <li>Together you cross ₹185 — meeting the minimum basket instantly with zero junk items!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 pt-0">
                <button
                  onClick={onExploreShopping}
                  className="w-full py-3 px-4 rounded-2xl bg-[#0D3B3E] hover:bg-[#124e52] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-300" />
                  <span>Try the Interactive Group Shopping Basket</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO B: OFFICE LIFE */}
          {(activeTab === 'both' || activeTab === 'office') && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                {/* Header Badge */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-white/20 text-blue-100 tracking-wider">
                      Scenario B
                    </span>
                    <span className="text-xs font-bold text-blue-100 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Office & Co-Working
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white pt-1">
                    The Afternoon Coffee Craving
                  </h3>
                  <p className="text-xs text-blue-100/90">
                    Someone at work wants coffee or snacks, but doesn't want to leave their desk or office floor.
                  </p>
                </div>

                {/* The Comparison Cards */}
                <div className="p-6 space-y-4">
                  {/* The Everyday Friction */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 text-xs font-black uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>The Frustrating Way</span>
                    </div>
                    <ul className="text-xs text-rose-950 space-y-1.5 pl-6 list-disc">
                      <li>You are on a tight deadline or client call and craving hot chai or cold coffee.</li>
                      <li>Going down 4 floors through security to the street market wastes 25 minutes.</li>
                      <li>Delivery apps quote 40-50 minutes plus ₹49 delivery charge for a single ₹60 beverage.</li>
                    </ul>
                  </div>

                  {/* The Raahi Way */}
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                    <div className="flex items-center gap-2 text-blue-800 text-xs font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>The Raahi Quick Errand Way</span>
                    </div>
                    <ul className="text-xs text-blue-950 space-y-1.5 pl-6 list-disc">
                      <li>You post a Quick Errand in your <strong>Office Floor Circle</strong> with a ₹20 tip.</li>
                      <li>Colleague Aman is already taking a 10-minute break downstairs at the cafeteria.</li>
                      <li>Aman accepts, grabs your coffee, and drops it right at your desk with OTP safety!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 pt-0">
                <button
                  onClick={onExploreErrands}
                  className="w-full py-3 px-4 rounded-2xl bg-[#0D3B3E] hover:bg-[#124e52] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <Coffee className="w-4 h-4 text-amber-300" />
                  <span>Try the Interactive Quick Errands Flow</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
