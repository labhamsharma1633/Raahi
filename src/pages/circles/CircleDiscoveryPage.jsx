import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Building2,
  Home,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useRaahi } from '../../context/RaahiContext';
import CircleCard from '../../components/circles/CircleCard';

const CIRCLE_TYPES = [
  { id: 'ALL', label: 'All Circles', icon: Compass },
  { id: 'HOSTEL_PG', label: 'Hostel / PG', icon: Home },
  { id: 'COLLEGE', label: 'College Campus', icon: GraduationCap },
  { id: 'SOCIETY_APARTMENT', label: 'Apartment / Society', icon: Building2 },
  { id: 'OFFICE', label: 'Office Workspace', icon: Briefcase },
  { id: 'NEIGHBOURHOOD', label: 'Neighbourhood', icon: Sparkles },
];

export default function CircleDiscoveryPage({ onNavigate }) {
  const { user, showToast } = useRaahi();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [joiningId, setJoiningId] = useState(null);

  const loadCircles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedType !== 'ALL') params.type = selectedType;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (cityFilter.trim()) params.city = cityFilter.trim();

      const res = await apiClient.getDiscoverableCircles(params);
      if (res?.data?.circles) {
        setCircles(res.data.circles);
      }
    } catch (err) {
      console.warn('Failed to load discoverable circles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadCircles, 200);
    return () => clearTimeout(timer);
  }, [selectedType, searchQuery, cityFilter]);

  const handleRequestJoin = async (circleId) => {
    if (!user) {
      showToast('Please sign in to request Circle membership', 'error');
      onNavigate('login');
      return;
    }

    setJoiningId(circleId);
    try {
      const res = await apiClient.requestJoinCircle(circleId);
      showToast(res.message || 'Join request sent to Circle admins!');
      loadCircles();
    } catch (err) {
      showToast(err.message || 'Failed to submit join request', 'error');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-8 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('circles')}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-black/40 text-teal-200 flex items-center justify-center border border-teal-500/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                Directory
              </span>
              <h1 className="text-2xl font-black text-white">
                Discover Nearby Circles
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('circles-create')}
              className="text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-xl border border-amber-300 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Create New Circle</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-5 border border-raahi-border shadow-soft space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by circle name, hostel block, society, or locality..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-raahi-teal focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="City (e.g. Chandigarh, Bengaluru)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-raahi-teal focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {CIRCLE_TYPES.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-raahi-teal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Circles Grid */}
        {loading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-raahi-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Searching discoverable circles...</p>
          </div>
        ) : circles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">No matching Circles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to create a trusted Circle for your hostel, society, or office community!
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('circles-create')}
                className="px-4 py-2 rounded-xl bg-raahi-teal text-white font-bold text-xs"
              >
                Create Circle in this Locality
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circles.map((circle) => (
              <CircleCard
                key={circle.id || circle._id}
                circle={circle}
                joining={joiningId === (circle.id || circle._id)}
                onOpen={() => onNavigate(`circle-${circle.id || circle._id}`)}
                onRequestJoin={() => handleRequestJoin(circle.id || circle._id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
