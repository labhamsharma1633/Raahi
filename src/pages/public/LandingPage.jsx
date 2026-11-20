import React, { useState } from 'react';
import InteractiveHero from '../../components/showcase/InteractiveHero';
import ScenarioComparison from '../../components/showcase/ScenarioComparison';
import GroupShoppingSimulator from '../../components/showcase/GroupShoppingSimulator';
import QuickErrandsSimulator from '../../components/showcase/QuickErrandsSimulator';
import RaahiEcosystemSection from '../../components/showcase/RaahiEcosystemSection';
import ShowcaseFinalCta from '../../components/showcase/ShowcaseFinalCta';
import RaahiVideoPlayer from '../../components/video/RaahiVideoPlayer';
import ActionCard from '../../components/ActionCard';
import RequestCard from '../../components/RequestCard';
import { useRaahi } from '../../context/RaahiContext';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Footprints, 
  CheckCircle2, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  MapPin, 
  Clock,
  Video
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const { currentRole, setRole, requests, acceptRequest } = useRaahi();
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter(req => {
    const matchesCategory = filterCategory === 'all' || req.type === filterCategory;
    const matchesSearch = searchQuery === '' || 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.storeOrPickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-16 bg-raahi-bg">
      {/* Interactive Hero Section (Section 1) */}
      <InteractiveHero 
        onExplore={() => scrollToSection('scenarios-showcase')}
        onHowItWorks={() => scrollToSection('explainer-video-section')}
      />

      {/* Real-Life Problem Scenarios (Section 2) */}
      <div id="scenarios-showcase">
        <ScenarioComparison 
          onExploreShopping={() => scrollToSection('group-shopping-showcase')}
          onExploreErrands={() => {
            const el = document.getElementById('errands-showcase') || document.getElementById('live-requests-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Interactive Group Shopping Basket Simulator (Section 3) */}
      <GroupShoppingSimulator />

      {/* Interactive Quick Errands Workflow Simulator (Section 4) */}
      <QuickErrandsSimulator />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Section: Make an errand happen */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>COMMUNITY DELIVERY CORRIDOR</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-raahi-text-main tracking-tight">
                Make an errand happen
              </h3>
              <p className="text-sm text-raahi-text-sub mt-1">
                Select your errand type to connect with campus peers already travelling along your path
              </p>
            </div>
            <span className="text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              2 Delivery Types
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              type="buy"
              title="Buy & Deliver"
              subtitle="Ask a travelling peer to purchase food, notes, or medicine from nearby shops and bring them to your hostel or department."
              badgeText="Most Popular on Campus"
              examples={[
                "Sudama Tea Point & Nescafe", 
                "Late-night Stationery & Chart Papers", 
                "Apollo Pharmacy OTC Medicines",
                "Kamla Nagar Snacks & Juices"
              ]}
              popularIn="Kamla Nagar Market & Arts Faculty"
              estimatedDetour="+150m - 350m detour (~6 mins)"
              onClick={() => onNavigate('buy')}
            />

            <ActionCard
              type="pickup"
              title="Pick Up & Deliver"
              subtitle="Ask a student to collect an already-prepared parcel, spiral-bound notes, or laundry package along their walk."
              badgeText="Pre-Paid & Ready"
              examples={[
                "Patel Chest Xerox Notes", 
                "Hostel Laundry Packets", 
                "Library Reserved Books",
                "Borrowed Lab Manuals"
              ]}
              popularIn="Patel Chest Marg & Hostels"
              estimatedDetour="+200m - 400m detour (~8 mins)"
              onClick={() => onNavigate('pickup')}
            />
          </div>
        </section>

        {/* Section: Transparent Model Explainer */}
        <section className="bg-gradient-to-r from-white via-[#F4F9FC] to-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
          <div className="max-w-3xl mb-8 space-y-2">
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Community Commute Architecture
            </div>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-raahi-teal">
              How Route-Based Campus Delivery Works
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike commercial delivery aggregators with fleet bikes, surge prices, and high delivery fees, Raahi leverages people who are already commuting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative group hover:border-teal-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-raahi-teal flex items-center justify-center font-black text-sm">
                01
              </div>
              <h5 className="text-base font-bold text-slate-900">Post or Share Commute</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers enter what they need; travellers walking from the metro, hostel, or market share where they are heading.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative group hover:border-amber-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-sm">
                02
              </div>
              <h5 className="text-base font-bold text-slate-900">Carry with Minimal Detour</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Route Matching Engine matches requests requiring only a minor detour (average +200m to +350m along the corridor).
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative group hover:border-emerald-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-sm">
                03
              </div>
              <h5 className="text-base font-bold text-slate-900">Cover Travel Fares</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customer gets their item directly from a peer; traveller earns ₹35 - ₹80 to help cover daily metro and bus expenses.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Want to see the detailed routing algorithm and safety checks?
            </span>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="text-xs font-bold text-raahi-teal hover:text-teal-900 flex items-center gap-1.5"
            >
              <span>Learn How Raahi Works In Depth</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Section: Live Campus Requests */}
        <section id="live-requests-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-2xl font-extrabold text-raahi-text-main tracking-tight">
                Live Requests Across India
              </h3>
              <p className="text-xs sm:text-sm text-raahi-text-sub mt-0.5">
                Users connecting across India — from campuses, markets, and transit hubs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                {filteredRequests.length} active tasks
              </span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by shop, notes, snacks, or hostel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-raahi-teal transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  filterCategory === 'all'
                    ? 'bg-raahi-teal text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Requests ({requests.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('buy')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterCategory === 'buy'
                    ? 'bg-raahi-teal text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy & Deliver ({requests.filter(r => r.type === 'buy').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('pickup')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterCategory === 'pickup'
                    ? 'bg-raahi-teal text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Pick Up & Deliver ({requests.filter(r => r.type === 'pickup').length})</span>
              </button>
            </div>
          </div>

          {/* Grid of Request Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const reqId = req._id || req.id || req.requestId;
                return (
                  <RequestCard
                    key={reqId}
                    request={req}
                    isTravellerView={currentRole === 'traveller'}
                    onSelect={(r) => onNavigate(`request-details-${r?._id || r?.id || reqId}`)}
                    onAccept={(r) => acceptRequest(r?._id || r?.id || reqId)}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center p-8">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No requests match your current search</h4>
                <p className="text-xs text-slate-500 mt-1">Try resetting your search terms or posting an errand yourself.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Explainer Video Section */}
        <section id="explainer-video-section" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full">
              <Video className="w-3.5 h-3.5 text-teal-700" />
              <span>OFFICIAL EXPLAINER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              See how Raahi makes everyday life easier.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Real-life problems. Simple community-powered solutions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <RaahiVideoPlayer />
          </div>
        </section>
      </div>

      {/* Section 6: Complete Raahi Ecosystem */}
      <div className="mt-16">
        <RaahiEcosystemSection onNavigate={onNavigate} />
      </div>

      {/* Section 7: Final Interactive Community CTA */}
      <ShowcaseFinalCta onNavigate={onNavigate} />
    </div>
  );
}
