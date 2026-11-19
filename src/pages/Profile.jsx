import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Star, 
  MapPin, 
  IndianRupee, 
  Footprints, 
  ShoppingBag, 
  Award, 
  ChevronRight, 
  HeartHandshake, 
  CheckCircle2, 
  Settings,
  Mail,
  Calendar,
  Save
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';
import PrimaryButton from '../components/PrimaryButton';

export default function Profile({ onNavigate }) {
  const { user, setUser, currentRole, setRole, travellerStats, customerStats, showToast } = useRaahi();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [college, setCollege] = useState(user?.college || user?.city || 'India Community');

  if (!user) {
    return (
      <div className="min-h-screen bg-raahi-bg flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-raahi-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, name, phone, college };
    setUser(updated);
    setEditing(false);
    showToast('Campus profile updated.');
  };

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-10 sm:py-12 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-1 shadow-xl">
                <div className="w-full h-full rounded-[20px] bg-raahi-teal flex items-center justify-center text-white font-black text-2xl sm:text-3xl">
                  {user.name?.[0] || 'U'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h2>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>DU Verified</span>
                  </span>
                </div>
                <p className="text-sm text-teal-200/90 font-medium">
                  {user.college} • Roll #{user.rollNo || '22/DU/108'}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-teal-200">
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Star className="w-4 h-4 fill-amber-300" />
                    <span>{user.rating || 4.9} Rating</span>
                  </span>
                  <span>•</span>
                  <span>Verified Campus Commuter</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRole(currentRole === 'customer' ? 'traveller' : 'customer')}
                className="bg-[#08282A] hover:bg-[#051C1E] text-teal-100 border border-teal-500/30 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2"
              >
                <span>Switch to {currentRole === 'customer' ? 'Traveller Mode' : 'Customer Mode'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Travel Cost Offsets Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Commute Expenses Covered</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Offsets toward daily metro tokens, bus passes, and shared autos</p>
                </div>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl">
                  This Month
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-4xl font-black text-raahi-teal flex items-center">
                  <IndianRupee className="w-8 h-8 stroke-[3]" />
                  <span>{travellerStats.totalEarned}</span>
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  earned as rewards across {user.completedDeliveries} completed errands
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Avg. Detour per Errand</span>
                  <strong className="text-slate-800 text-sm">~240m (5 mins)</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Errands Delivered</span>
                  <strong className="text-slate-800 text-sm">{user.completedDeliveries}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Errands Requested</span>
                  <strong className="text-slate-800 text-sm">{customerStats.completedCount}</strong>
                </div>
              </div>
            </div>

            {/* Profile Edit Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-800">
                  Campus Profile Information
                </h4>
                <button
                  type="button"
                  onClick={() => setEditing(!editing)}
                  className="text-xs font-bold text-raahi-teal hover:underline"
                >
                  {editing ? 'Cancel' : 'Edit Details'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">College / Department</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>

                  <PrimaryButton type="submit" variant="primary" size="sm" icon={Save}>
                    Save Changes
                  </PrimaryButton>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Email</span>
                    <strong className="text-slate-800">{user.email}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone</span>
                    <strong className="text-slate-800">{user.phone}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl sm:col-span-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Institution</span>
                    <strong className="text-slate-800">{user.college}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
              <h4 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                Campus Trust Badges
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-teal-50/70 rounded-2xl border border-teal-100">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">DU College ID Verified</strong>
                    <span className="text-slate-500">Linked to institutional account</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Punctual Campus Wayfarer</strong>
                    <span className="text-slate-500">100% on-time handover rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
