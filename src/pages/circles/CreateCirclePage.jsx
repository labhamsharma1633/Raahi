import React, { useState } from 'react';
import {
  Users,
  ArrowLeft,
  Building2,
  Home,
  GraduationCap,
  Briefcase,
  Compass,
  Sparkles,
  ShieldCheck,
  Lock,
  Globe,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useRaahi } from '../../context/RaahiContext';
import PrimaryButton from '../../components/PrimaryButton';

const TYPES = [
  { id: 'HOSTEL_PG', label: 'Hostel / PG', desc: 'Hostel blocks, PG floors, mess communities', icon: Home },
  { id: 'OFFICE', label: 'Office Workspace', desc: 'Coworking spaces, corporate parks, teams', icon: Briefcase },
  { id: 'SOCIETY_APARTMENT', label: 'Society / Apartment', desc: 'Residential towers, gated communities', icon: Building2 },
  { id: 'COLLEGE', label: 'College Campus', desc: 'Departments, campus clubs, batch circles', icon: GraduationCap },
  { id: 'NEIGHBOURHOOD', label: 'Neighbourhood', desc: 'Suburbs, colony streets, local markets', icon: Compass },
  { id: 'CUSTOM', label: 'Custom Circle', desc: 'Any trusted private group of peers', icon: Sparkles },
];

const THEMES = [
  { id: 'teal', label: 'Teal Deep', class: 'bg-[#0D3B3E]' },
  { id: 'amber', label: 'Warm Amber', class: 'bg-amber-700' },
  { id: 'indigo', label: 'Midnight Indigo', class: 'bg-indigo-900' },
  { id: 'rose', label: 'Ruby Rose', class: 'bg-rose-700' },
  { id: 'emerald', label: 'Emerald Forest', class: 'bg-emerald-700' },
  { id: 'violet', label: 'Royal Violet', class: 'bg-purple-900' },
];

export default function CreateCirclePage({ onNavigate }) {
  const { user, showToast } = useRaahi();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('HOSTEL_PG');
  const [approximateArea, setApproximateArea] = useState('');
  const [city, setCity] = useState(user?.city || 'Chandigarh');
  const [state, setState] = useState(user?.state || 'Punjab');
  const [visibility, setVisibility] = useState('PUBLIC_DISCOVERABLE');
  const [membershipRules, setMembershipRules] = useState(
    'Be respectful, support nearby peers with errands, and coordinate shopping responsibly.'
  );
  const [coverGradient, setCoverGradient] = useState('teal');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !approximateArea.trim() || !city.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.createCircle({
        name: name.trim(),
        description: description.trim(),
        type,
        approximateArea: approximateArea.trim(),
        city: city.trim(),
        state: state.trim(),
        visibility,
        membershipRules: membershipRules.trim(),
        coverGradient,
      });

      if (res?.data?.circle) {
        showToast('Circle created successfully!');
        const newId = res.data.circle._id || res.data.circle.id;
        onNavigate(`circle-${newId}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to create Circle', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-8 border-b border-[#14474B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <button
            onClick={() => onNavigate('circles')}
            className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-black/40 text-teal-200 flex items-center justify-center border border-teal-500/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
              Community Builder
            </span>
            <h1 className="text-2xl font-black text-white">Create a Raahi Circle</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              1. Circle Profile
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Circle Name *
              </label>
              <input
                type="text"
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PU Girls Hostel 4, Prestige Tech Park Tower B, Sector 15 Canteen Club"
                className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 focus:border-raahi-teal outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                About this Community *
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what members coordinate here (e.g. daily grocery runs, sharing Blinkit/Zepto delivery minimums, canteen snacks)."
                className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 focus:border-raahi-teal outline-none leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 2: Type Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              2. Select Circle Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-raahi-teal bg-teal-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-raahi-teal' : 'text-slate-500'}`} />
                      <h4 className="text-xs font-bold text-slate-900">{t.label}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Geographic Boundary */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              3. Locality & Area
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Approximate Locality / Sector / Landmark *
                </label>
                <input
                  type="text"
                  value={approximateArea}
                  onChange={(e) => setApproximateArea(e.target.value)}
                  placeholder="e.g. Sector 14, Panjab University Campus"
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 focus:border-raahi-teal outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  We never reveal members' exact residential addresses or live locations.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chandigarh"
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 focus:border-raahi-teal outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Privacy & Cover Theme */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              4. Privacy & Visual Theme
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setVisibility('PUBLIC_DISCOVERABLE')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  visibility === 'PUBLIC_DISCOVERABLE'
                    ? 'border-raahi-teal bg-teal-50/60'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-teal-700" />
                  <strong className="text-xs text-slate-900">Public & Discoverable</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  Visible in nearby search. Users can request membership; admins approve each member.
                </p>
              </div>

              <div
                onClick={() => setVisibility('PRIVATE_INVITE_ONLY')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  visibility === 'PRIVATE_INVITE_ONLY'
                    ? 'border-raahi-teal bg-teal-50/60'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <strong className="text-xs text-slate-900">Private (Invite Code Only)</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  Hidden from public discovery. Members can only join with an admin's invitation link or code.
                </p>
              </div>
            </div>

            {/* Visual Cover Color */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Header Cover Theme
              </label>
              <div className="flex items-center gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setCoverGradient(theme.id)}
                    className={`w-9 h-9 rounded-xl ${theme.class} transition-all ${
                      coverGradient === theme.id ? 'ring-3 ring-amber-400 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={theme.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('circles')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>

            <PrimaryButton
              type="submit"
              disabled={submitting}
              variant="primary"
              className="!bg-raahi-teal hover:!bg-[#072426]"
            >
              {submitting ? 'Creating Circle...' : 'Create & Launch Circle'}
            </PrimaryButton>
          </div>

        </form>
      </div>
    </div>
  );
}
