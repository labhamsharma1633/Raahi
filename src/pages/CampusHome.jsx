import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import ActionCard from '../components/ActionCard';
import RequestCard from '../components/RequestCard';
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  Footprints,
  Clock,
  Compass,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  Package
} from 'lucide-react';

export default function CampusHome({
  currentRole,
  onRoleChange,
  requests = [],
  onSelectRequest,
  onAcceptRequest,
  onNavigateToBuy,
  onNavigateToPickup,
  onNavigateToRoutes
}) {
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

  return (
    <div className="pb-16 bg-raahi-bg">
      {/* Expansive Hero Section */}
      <HeroSection 
        currentRole={currentRole}
        onPrimaryAction={
          currentRole === 'customer' 
            ? onNavigateToBuy 
            : onNavigateToRoutes
        }
        onSecondaryAction={() => {
          const el = document.getElementById('errands-feed');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onRoleSwitch={onRoleChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Section: "Make an errand happen" - 2 Column Action Cards on Desktop */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>COMMUNITY ERRANDS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-raahi-text-main tracking-tight">
                Make an errand happen
              </h3>
              <p className="text-sm text-raahi-text-sub mt-1">
                Select your errand type to connect with commuters already travelling your way across India
              </p>
            </div>
            <span className="text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              2 Ways to Send
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buy & Deliver Action Card */}
            <ActionCard
              type="buy"
              title="Buy & Deliver"
              subtitle="Ask a travelling student to purchase food, notes, or medicines from nearby shops and bring them to you."
              badgeText="Popular Everywhere"
              examples={[
                "Filter Coffee & South Indian Breakfast", 
                "Stationery, Sketch Pads & Lab Supplies", 
                "OTC Medicines & Electrolytes",
                "Canteen Meals, Snacks & Shakes"
              ]}
              popularIn="Markets, Food Stalls & Campuses"
              estimatedDetour="+150m - 500m detour (~6-10 mins)"
              onClick={onNavigateToBuy}
            />

            {/* Pick Up & Deliver Action Card */}
            <ActionCard
              type="pickup"
              title="Pick Up & Deliver"
              subtitle="Ask a student to pick up an already-prepared package, spiral-bound assignment, or dry cleaning along their walk."
              badgeText="Pre-Paid / Ready"
              examples={[
                "Xerox & Spiral-bound Notes", 
                "Hostel Laundry & Dry Cleaning", 
                "Library Reserved Books",
                "Lab Manuals, Printouts & Parcels"
              ]}
              popularIn="Xerox Centres, Hostels & Transit Hubs"
              estimatedDetour="+200m - 500m detour (~8 mins)"
              onClick={onNavigateToPickup}
            />
          </div>
        </section>

        {/* Section: How Raahi Works on Campus (3-Column Interactive Model) */}
        <section className="bg-gradient-to-r from-white via-[#F4F9FC] to-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          <div className="max-w-2xl mb-8">
            <h4 className="text-xl sm:text-2xl font-extrabold text-raahi-teal">
              How Route-Based Delivery Works Anywhere in India
            </h4>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Unlike commercial delivery apps with surge pricing and fleets, Raahi leverages existing foot, rickshaw, and transit traffic — across any Indian city or campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-raahi-teal flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h5 className="text-base font-bold text-slate-800">Post or Share Route</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers post small requests; commuters entering a market, college, or transit hub share their destination — from any city in India.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h5 className="text-base font-bold text-slate-800">Carry Along Existing Walk</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tasks only match if the pickup and drop-off involve a negligible detour (average +200m to +400m).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h5 className="text-base font-bold text-slate-800">Offset Travel Costs</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                The customer gets their item promptly; the traveller earns ₹35 - ₹80 to help cover bus, metro, and snack costs.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Live Campus Requests Grid */}
        <section id="errands-feed" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-raahi-text-main tracking-tight">
                Live Requests Near You
              </h3>
              <p className="text-xs sm:text-sm text-raahi-text-sub mt-0.5">
                People across India looking for a hand along their commute route
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                {filteredRequests.length} active requests
              </span>
            </div>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by shop, item, city, or area..."
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

          {/* Multi-Column Grid of Request Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const reqId = req._id || req.id || req.requestId;
                return (
                  <RequestCard
                    key={reqId}
                    request={req}
                    isTravellerView={currentRole === 'traveller'}
                    onSelect={onSelectRequest}
                    onAccept={() => onAcceptRequest && onAcceptRequest(reqId)}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center p-8">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No requests match your current filters</h4>
                <p className="text-xs text-slate-500 mt-1">Try clearing your search terms or selecting another category.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
