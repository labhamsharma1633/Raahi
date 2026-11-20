import React, { useState } from 'react';
import { 
  GraduationCap, 
  Globe, 
  Users, 
  Home, 
  Building2, 
  Building, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  MapPin
} from 'lucide-react';

export default function RaahiEcosystemSection({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('circles'); // 'campus' | 'community' | 'circles'

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-800 bg-teal-100/80 px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>The Complete Raahi Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            One platform. <span className="text-raahi-teal">Multiple ways to connect.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Whether you are on a university campus, commuting across town, or organizing daily essentials within your building, Raahi unifies everything under one single trusted profile.
          </p>
        </div>

        {/* 3 Pillar Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {[
            {
              id: 'campus',
              title: 'Raahi Campus',
              subtitle: 'University & College Network',
              icon: GraduationCap,
              activeColor: 'bg-emerald-600 text-white shadow-md',
              inactiveColor: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200',
            },
            {
              id: 'community',
              title: 'Raahi Community',
              subtitle: 'City & Transit Corridors',
              icon: Globe,
              activeColor: 'bg-blue-600 text-white shadow-md',
              inactiveColor: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200',
            },
            {
              id: 'circles',
              title: 'Raahi Circles',
              subtitle: 'Micro-Community Groups',
              icon: Users,
              activeColor: 'bg-[#0D3B3E] text-white shadow-md',
              inactiveColor: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200',
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activeTab === pillar.id;

            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`p-4 rounded-2xl text-left transition-all flex items-center gap-3.5 ${
                  isSelected ? pillar.activeColor : pillar.inactiveColor
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-2xs'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-black truncate">{pillar.title}</h4>
                  <span className={`text-[11px] block truncate ${
                    isSelected ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {pillar.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Pillar View */}
        <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm transition-all">
          
          {/* TAB 1: RAAHI CAMPUS */}
          {activeTab === 'campus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>College Students & Campus Networks</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-snug">
                  Designed for high-density student corridors and hostel clusters
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Students walk between metro stations, campus markets (like Kamla Nagar and Patel Chest), libraries, and department complexes every single day. Raahi Campus enables peers to get photocopied notes, pharmacy supplies, and meals delivered right to their hostel gate by someone already heading that way.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Institutional email & ID check</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hostel-to-campus corridors</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onNavigate('home')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Explore Campus Deliveries</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Campus Verified Perks
                </span>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <strong className="block text-emerald-900">Peer Accountability</strong>
                    <span>Deliveries handled with care by fellow students sharing the same campus code of conduct.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <strong className="block text-slate-900">Affordable Rewards (₹35–₹70)</strong>
                    <span>Helps student commuters easily cover their daily DTC bus pass or Delhi Metro fare.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RAAHI COMMUNITY */}
          {activeTab === 'community' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                  <Globe className="w-4 h-4" />
                  <span>All-India Commute & City Network</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-snug">
                  Connecting everyday commuters across neighborhoods, transit hubs, and towns
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Open to all verified citizens across India. Whether taking the metro, walking from a bus terminal, or driving your routine morning commute, you can carry packages along your exact travel corridor without detour or vehicle emissions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Smart Pool multi-stop pickups</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Metro and bus corridor matching</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onNavigate('routes')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Share Your Daily Commute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Community Network Impact
                </span>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <strong className="block text-blue-900">Zero Commercial Fleet Congestion</strong>
                    <span>Utilizes existing transit trips instead of sending extra delivery bikes onto crowded roads.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <strong className="block text-slate-900">Direct Peer-to-Peer Settlement</strong>
                    <span>Fair compensation that offsets real daily fuel and transit ticket expenses.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAAHI CIRCLES */}
          {activeTab === 'circles' && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                  <Users className="w-4 h-4" />
                  <span>Private & Discoverable Micro-Communities</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-snug">
                  Trusted local groups for everyday convenience
                </h3>
                <p className="text-sm text-slate-600">
                  Raahi Circles brings people who live or work together into private, invite-based or locality-discovered circles with Group Shopping and Quick Errands:
                </p>
              </div>

              {/* 5 Circle Types Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {[
                  {
                    icon: Home,
                    title: 'PG & Hostels',
                    desc: 'Pool groceries to beat minimum cart limits; quick late-night snacks.',
                    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                  },
                  {
                    icon: Building2,
                    title: 'Offices & Floors',
                    desc: 'Afternoon coffee runs, stationery, and cafeteria pickups during breaks.',
                    color: 'text-blue-700 bg-blue-50 border-blue-200',
                  },
                  {
                    icon: Building,
                    title: 'Societies & Flats',
                    desc: 'Apartment tower grocery pooling and gate parcel collections.',
                    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
                  },
                  {
                    icon: GraduationCap,
                    title: 'Colleges & Depts',
                    desc: 'Department clubs, student societies, and lab printing groups.',
                    color: 'text-amber-700 bg-amber-50 border-amber-200',
                  },
                  {
                    icon: MapPin,
                    title: 'Neighbourhoods',
                    desc: 'Local residential blocks sharing trips to markets and chemists.',
                    color: 'text-purple-700 bg-purple-50 border-purple-200',
                  },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${item.color}`}>
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mt-2.5">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('circles')}
                  className="px-5 py-2.5 rounded-xl bg-[#0D3B3E] hover:bg-[#124e52] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Join or Create a Circle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  Protected with secure invite codes, admin approvals, and 4-digit OTP handovers.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
