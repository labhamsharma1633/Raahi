import React, { useState, useEffect } from 'react';
import {
  Users,
  PlusCircle,
  Compass,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useRaahi } from '../../context/RaahiContext';
import CircleCard from '../../components/circles/CircleCard';
import PrimaryButton from '../../components/PrimaryButton';

export default function MyCirclesPage({ onNavigate }) {
  const { user, showToast } = useRaahi();
  const [activeCircles, setActiveCircles] = useState([]);
  const [pendingCircles, setPendingCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joiningCode, setJoiningCode] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchMyCircles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getMyCircles();
      if (res?.data) {
        setActiveCircles(res.data.activeCircles || []);
        setPendingCircles(res.data.pendingCircles || []);
      }
    } catch (err) {
      console.warn('Failed to fetch user circles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCircles();
  }, []);

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    setJoiningCode(true);
    try {
      const res = await apiClient.joinCircleByInvite(inviteCodeInput.trim());
      if (res?.data) {
        showToast(res.message || 'Joined Circle successfully!');
        setInviteCodeInput('');
        setShowInviteModal(false);
        fetchMyCircles();
        if (res.data.circle?.id) {
          onNavigate(`circle-${res.data.circle.id}`);
        }
      }
    } catch (err) {
      showToast(err.message || 'Invalid or expired invite code', 'error');
    } finally {
      setJoiningCode(false);
    }
  };

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-8 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                Raahi Circles
              </span>
              <span className="text-teal-400">•</span>
              <span className="text-xs text-teal-200">Trusted Community Mesh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              My Circles
            </h1>
            <p className="text-xs text-teal-200/90 mt-1 max-w-xl">
              Collaborative local spaces for group grocery shopping, minimum order threshold pooling, and quick peer errands.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowInviteModal(true)}
              className="text-xs font-bold bg-[#08282A] hover:bg-black/40 text-teal-200 px-4 py-2.5 rounded-xl border border-teal-500/30 transition-all flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Join with Code</span>
            </button>

            <button
              onClick={() => onNavigate('circles-discover')}
              className="text-xs font-bold bg-teal-500/20 hover:bg-teal-500/30 text-teal-100 px-4 py-2.5 rounded-xl border border-teal-400/40 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-200" />
              <span>Discover Circles</span>
            </button>

            <PrimaryButton
              onClick={() => onNavigate('circles-create')}
              variant="primary"
              size="sm"
              className="!bg-amber-400 !text-slate-950 hover:!bg-amber-300 border border-amber-300 font-extrabold"
            >
              <PlusCircle className="w-4 h-4 mr-1 text-slate-950" />
              <span>Create Circle</span>
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Pending Requests Banner */}
        {pendingCircles.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 shadow-soft">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">
                Join Requests Under Admin Review ({pendingCircles.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingCircles.map(({ circle, membership }) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  membership={membership}
                  onOpen={() => onNavigate(`circle-${circle.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Circles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Active Circles ({activeCircles.length})
              </h2>
              <p className="text-xs text-slate-500">Communities you are an approved member or administrator of.</p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-raahi-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading your communities...</p>
            </div>
          ) : activeCircles.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-raahi-teal flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">You haven't joined any Circles yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect with your hostel floor, college department, society block, or office peers to share grocery delivery minimums and quick errands.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('circles-discover')}
                  className="px-4 py-2 rounded-xl bg-raahi-teal text-white font-bold text-xs hover:bg-[#072426] transition-colors"
                >
                  Explore Nearby Circles
                </button>
                <button
                  onClick={() => onNavigate('circles-create')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Start a New Circle
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCircles.map(({ circle, membership }) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  membership={membership}
                  onOpen={() => onNavigate(`circle-${circle.id}`)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Join with Invite Code Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Join Circle via Invite</h3>
                  <p className="text-[11px] text-slate-500">Enter the 6-character code from your admin</p>
                </div>
              </div>

              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Invitation Code
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. KSFN69"
                  className="w-full text-center text-lg font-black tracking-widest px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-raahi-teal outline-none uppercase"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  Invite codes grant immediate verified membership without waiting for approval.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <PrimaryButton
                  type="submit"
                  disabled={joiningCode || !inviteCodeInput.trim()}
                  variant="primary"
                  size="sm"
                >
                  {joiningCode ? 'Validating...' : 'Join Circle Now'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
