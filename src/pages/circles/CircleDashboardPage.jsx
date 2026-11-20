import React, { useState, useEffect } from 'react';
import {
  Users,
  Layers,
  ShoppingBag,
  ShoppingBasket,
  KeyRound,
  Shield,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Coffee,
  Sparkles,
  Settings,
  Activity,
  UserCheck,
  UserMinus,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useRaahi } from '../../context/RaahiContext';
import PrimaryButton from '../../components/PrimaryButton';
import { CreateErrandModal } from '../../components/circles/CreateErrandModal';
import { QuickErrandCard } from '../../components/circles/QuickErrandCard';

export default function CircleDashboardPage({ circleId, onNavigate }) {
  const { user, showToast } = useRaahi();
  const [circle, setCircle] = useState(null);
  const [membership, setMembership] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview | errands | shopping | members | settings
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [breakModeActive, setBreakModeActive] = useState(false);
  const [updatingBreak, setUpdatingBreak] = useState(false);

  // Quick Errands State (Phase 2)
  const [errands, setErrands] = useState([]);
  const [loadingErrands, setLoadingErrands] = useState(false);
  const [isCreateErrandOpen, setIsCreateErrandOpen] = useState(false);
  const [errandFilter, setErrandFilter] = useState('ALL');

  const fetchErrands = async () => {
    try {
      setLoadingErrands(true);
      const res = await apiClient.getCircleErrands(circleId);
      if (res?.data?.errands) {
        setErrands(res.data.errands);
      }
    } catch (err) {
      console.warn('Failed to load circle errands:', err);
    } finally {
      setLoadingErrands(false);
    }
  };

  const fetchCircleData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getCircleById(circleId);
      if (res?.data?.circle) {
        setCircle(res.data.circle);
        setMembership(res.data.membership);
        setBreakModeActive(Boolean(res.data.membership?.breakMode?.enabled));
      }

      // If active member, load members
      if (res?.data?.isMember) {
        const memRes = await apiClient.getCircleMembers(circleId).catch(() => ({ data: { members: [] } }));
        setMembers(memRes?.data?.members || []);

        // If admin, load pending requests
        if (res.data.isAdmin) {
          const reqRes = await apiClient.getPendingCircleRequests(circleId).catch(() => ({ data: { requests: [] } }));
          setPendingRequests(reqRes?.data?.requests || []);
        }
      }
    } catch (err) {
      console.warn('Failed to load circle data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (circleId) {
      fetchCircleData();
      fetchErrands();
    }
  }, [circleId]);

  useEffect(() => {
    if (activeTab === 'errands' && circleId) {
      fetchErrands();
    }
  }, [activeTab, circleId]);

  const handleCopyInvite = () => {
    if (circle?.inviteCode) {
      navigator.clipboard.writeText(circle.inviteCode);
      setCopiedCode(true);
      showToast('Invite code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleRegenerateCode = async () => {
    try {
      const res = await apiClient.regenerateCircleInvite(circleId);
      if (res?.data?.inviteCode) {
        showToast('Fresh invitation code generated!');
        fetchCircleData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to regenerate invite', 'error');
    }
  };

  const handleToggleBreakMode = async () => {
    setUpdatingBreak(true);
    try {
      const newStatus = !breakModeActive;
      const res = await apiClient.toggleCircleBreakMode(circleId, {
        enabled: newStatus,
        durationHours: 3,
        note: newStatus ? 'Available for quick peer pickups nearby' : '',
      });
      setBreakModeActive(newStatus);
      showToast(res.message || 'Break Mode updated');
      fetchCircleData();
    } catch (err) {
      showToast(err.message || 'Failed to update Break Mode', 'error');
    } finally {
      setUpdatingBreak(false);
    }
  };

  const handleMembershipAction = async (membershipId, action) => {
    try {
      const res = await apiClient.handleCircleMembershipRequest(circleId, membershipId, action);
      showToast(res.message || 'Action executed successfully');
      fetchCircleData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleRoleChange = async (memberUserId, newRole) => {
    try {
      await apiClient.updateCircleMemberRole(circleId, memberUserId, newRole);
      showToast(`Member role updated to ${newRole}`);
      fetchCircleData();
    } catch (err) {
      showToast(err.message || 'Failed to update role', 'error');
    }
  };

  const handleRemoveMember = async (memberUserId) => {
    if (!window.confirm('Are you sure you want to remove this member from the Circle?')) return;
    try {
      await apiClient.removeCircleMember(circleId, memberUserId);
      showToast('Member removed from Circle');
      fetchCircleData();
    } catch (err) {
      showToast(err.message || 'Failed to remove member', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-raahi-bg flex items-center justify-center p-8">
        <div className="w-8 h-8 border-3 border-raahi-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-raahi-bg p-8 text-center">
        <p className="text-sm font-bold text-slate-700">Circle not found or inactive.</p>
        <button onClick={() => onNavigate('circles')} className="mt-3 text-xs font-bold text-teal-800 underline">
          Return to My Circles
        </button>
      </div>
    );
  }

  const isMember = membership?.status === 'ACTIVE';
  const isAdmin = isMember && ['OWNER', 'ADMIN'].includes(membership?.role);

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      {/* Circle Header */}
      <div className="bg-gradient-to-r from-[#072426] via-raahi-teal to-[#093538] text-white py-8 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('circles')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Circles</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {circle.type}
                </span>
                {isMember && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    {membership.role}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{circle.name}</h1>
              <div className="flex items-center gap-2 text-xs text-teal-200">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{circle.approximateArea}, {circle.city}</span>
                <span>•</span>
                <span>{circle.memberCount || 1} Members</span>
              </div>
            </div>

            {/* Top Action Pill for Break Mode */}
            {isMember && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleBreakMode}
                  disabled={updatingBreak}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                    breakModeActive
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-white/10 text-teal-100 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Coffee className={`w-4 h-4 ${breakModeActive ? 'text-slate-950' : 'text-amber-300'}`} />
                  <span>
                    {breakModeActive ? 'Break Mode: ON (Available to Help)' : 'Turn On Break Mode'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Circle Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs py-2">
          {[
            { id: 'overview', label: 'Overview & Activity', icon: Layers },
            { id: 'errands', label: 'Quick Errands', icon: ShoppingBag, badge: 'Phase 2' },
            { id: 'shopping', label: 'Group Shopping', icon: ShoppingBasket, badge: 'Phase 3' },
            { id: 'members', label: `Members (${members.length})`, icon: Users, alertCount: pendingRequests.length },
            ...(isAdmin ? [{ id: 'settings', label: 'Settings & Invites', icon: Settings }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-raahi-teal text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.alertCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                    {tab.alertCount}
                  </span>
                )}
                {tab.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${isActive ? 'bg-teal-900 text-teal-200' : 'bg-slate-200 text-slate-600'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              
              {/* Break Mode Active Alert */}
              {breakModeActive && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3.5 shadow-soft">
                  <Coffee className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 space-y-1">
                    <strong className="block text-sm">Your Break Mode is Active</strong>
                    <p className="leading-relaxed">
                      You are marked as available for nearby grocery runs and small canteen errands. Circle members will see that you can help!
                    </p>
                  </div>
                </div>
              )}

              {/* Circle Description */}
              <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  About this Circle
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {circle.description}
                </p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Coverage Area: <strong>{circle.approximateArea}</strong></span>
                  <span>Created: <strong>{new Date(circle.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Circle Community Guidelines */}
              <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Community Rules & Etiquette
                  </h3>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                  {circle.membershipRules}
                </div>
              </div>

            </div>

            {/* Right Column: Invite Widget & Stats */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Invite Code Widget */}
              <div className="bg-gradient-to-br from-[#0D3B3E] to-[#08282A] text-white rounded-3xl p-6 border border-teal-500/20 shadow-soft space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-300" />
                  <h3 className="text-sm font-extrabold">Invite Circle Members</h3>
                </div>

                <p className="text-xs text-teal-200/90 leading-relaxed">
                  Share this verified invitation code with your floor or team members for instant joining.
                </p>

                {circle.inviteCode ? (
                  <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-2">
                    <span className="font-mono text-lg font-black tracking-widest text-amber-300">
                      {circle.inviteCode}
                    </span>
                    <button
                      onClick={handleCopyInvite}
                      className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Invite code available to Circle Admins only.</p>
                )}

                {isAdmin && (
                  <button
                    onClick={handleRegenerateCode}
                    className="text-[11px] font-bold text-teal-300 hover:text-white underline block"
                  >
                    Regenerate Fresh Code
                  </button>
                )}
              </div>

              {/* Circle Health Stats */}
              <div className="bg-white rounded-3xl p-5 border border-raahi-border shadow-soft space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Circle Overview
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Members</span>
                    <span className="text-xl font-black text-slate-900">{members.length || circle.memberCount || 1}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">On Break Mode</span>
                    <span className="text-xl font-black text-emerald-700">
                      {members.filter((m) => m.breakMode?.enabled).length}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: QUICK ERRANDS HUB (PHASE 2) */}
        {activeTab === 'errands' && (
          <div className="space-y-6">
            {/* Errands Controls & Action Bar */}
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-teal-700" />
                  Quick Errands & Peer Pickups
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Small grocery runs, cafeteria orders, and parcel pickups fulfilled by trusted circle peers.
                </p>
              </div>

              {isMember && (
                <button
                  onClick={() => setIsCreateErrandOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#0D3B3E] hover:bg-[#124e52] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4 text-emerald-300" />
                  Post Quick Errand
                </button>
              )}
            </div>

            {/* Break Mode Helpers Banner */}
            {members.filter(m => m.breakMode?.enabled).length > 0 && (
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4" />
                </div>
                <div className="text-xs text-emerald-950 flex-1">
                  <span className="font-bold">Neighbours currently on a Break:</span>{' '}
                  {members
                    .filter(m => m.breakMode?.enabled)
                    .map(m => m.user?.name || 'Peer')
                    .join(', ')}{' '}
                  are ready to pick up items on their way!
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'ALL', label: 'All Errands', count: errands.length },
                { id: 'OPEN', label: 'Open Requests', count: errands.filter(e => e.status === 'OPEN').length },
                { 
                  id: 'MY_REQUESTS', 
                  label: 'My Requests', 
                  count: errands.filter(e => (typeof e.requester === 'object' ? e.requester?._id : e.requester) === user?._id).length 
                },
                { 
                  id: 'HELPING', 
                  label: "I'm Helping", 
                  count: errands.filter(e => (typeof e.helper === 'object' ? e.helper?._id : e.helper) === user?._id).length 
                },
                { id: 'COMPLETED', label: 'Completed', count: errands.filter(e => e.status === 'COMPLETED').length },
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setErrandFilter(filter.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    errandFilter === filter.id
                      ? 'bg-[#0D3B3E] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    errandFilter === filter.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Errands Grid */}
            {loadingErrands ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Loading circle errands...</span>
              </div>
            ) : (() => {
              const currentUserId = user?._id;
              const filteredErrands = errands.filter(e => {
                const reqId = typeof e.requester === 'object' ? e.requester?._id : e.requester;
                const hlpId = typeof e.helper === 'object' ? e.helper?._id : e.helper;
                if (errandFilter === 'OPEN') return e.status === 'OPEN';
                if (errandFilter === 'MY_REQUESTS') return reqId === currentUserId;
                if (errandFilter === 'HELPING') return hlpId === currentUserId;
                if (errandFilter === 'COMPLETED') return e.status === 'COMPLETED';
                return true;
              });

              if (filteredErrands.length === 0) {
                return (
                  <div className="bg-white rounded-3xl p-10 border border-raahi-border shadow-soft text-center max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No errands found</h4>
                    <p className="text-xs text-slate-500">
                      {errandFilter === 'ALL'
                        ? 'There are no quick errands posted in this Circle yet.'
                        : `No errands match the selected filter.`}
                    </p>
                    {isMember && (
                      <button
                        onClick={() => setIsCreateErrandOpen(true)}
                        className="mt-2 px-4 py-2 bg-[#0D3B3E] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#124e52] transition-colors"
                      >
                        Post the First Errand
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredErrands.map(errand => (
                    <QuickErrandCard
                      key={errand._id}
                      errand={errand}
                      currentUserId={user?._id}
                      onUpdated={(updated) => {
                        setErrands(prev => prev.map(item => item._id === updated._id ? updated : item));
                        showToast('Errand status updated!');
                      }}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: GROUP SHOPPING PLACEHOLDER */}
        {activeTab === 'shopping' && (
          <div className="bg-white rounded-3xl p-10 border border-raahi-border shadow-soft text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Phase 3 Ready
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                Group Shopping Baskets
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Shared carts to collectively reach retailer minimum order thresholds (Blinkit, Zepto, Instamart) with transparent cost reconciliation and designated purchaser checkout.
              </p>
            </div>
            <div className="pt-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 inline-block">
                Ready for Phase 3 Implementation
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: MEMBERS & PENDING APPROVALS */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Admin Pending Requests Box */}
            {isAdmin && pendingRequests.length > 0 && (
              <div className="bg-amber-50/90 border border-amber-300 rounded-3xl p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-800" />
                    <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                      Membership Requests Awaiting Approval ({pendingRequests.length})
                    </h3>
                  </div>
                  <span className="text-xs text-amber-800 font-medium">Verify peer identity</span>
                </div>

                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.membershipId}
                      className="bg-white p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <strong className="text-xs text-slate-900 block">{req.user?.name}</strong>
                        <span className="text-[11px] text-slate-500">
                          {req.user?.college || req.user?.city} • Requested {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleMembershipAction(req.membershipId, 'REJECT')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleMembershipAction(req.membershipId, 'APPROVE')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                        >
                          Approve Member
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Members Table */}
            <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Active Circle Members ({members.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {members.map((m) => (
                  <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-raahi-teal font-black text-xs flex items-center justify-center">
                        {m.user?.name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-slate-900">{m.user?.name}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                            m.role === 'OWNER' ? 'bg-amber-100 text-amber-900 font-black' :
                            m.role === 'ADMIN' ? 'bg-teal-100 text-teal-900' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {m.role}
                          </span>
                          {m.breakMode?.enabled && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <Coffee className="w-3 h-3" />
                              <span>On Break</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {m.user?.college || m.user?.city} • Joined {new Date(m.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Admin Actions on Members */}
                    {isAdmin && m.role !== 'OWNER' && m.user?.id !== user?._id && (
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleRoleChange(m.user?.id, m.role === 'ADMIN' ? 'MEMBER' : 'ADMIN')}
                          className="text-[11px] font-bold text-teal-800 hover:underline"
                        >
                          {m.role === 'ADMIN' ? 'Demote to Member' : 'Make Admin'}
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          onClick={() => handleRemoveMember(m.user?.id)}
                          className="text-[11px] font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && isAdmin && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-6 max-w-2xl">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              Circle Administration Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Circle Name</label>
                <input
                  type="text"
                  defaultValue={circle.name}
                  id="settings-name"
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Locality / Landmark</label>
                <input
                  type="text"
                  defaultValue={circle.approximateArea}
                  id="settings-area"
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Community Rules</label>
                <textarea
                  rows={3}
                  defaultValue={circle.membershipRules}
                  id="settings-rules"
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={async () => {
                    const newName = document.getElementById('settings-name')?.value;
                    const newArea = document.getElementById('settings-area')?.value;
                    const newRules = document.getElementById('settings-rules')?.value;
                    try {
                      await apiClient.updateCircleSettings(circleId, {
                        name: newName,
                        approximateArea: newArea,
                        membershipRules: newRules,
                      });
                      showToast('Circle settings updated!');
                      fetchCircleData();
                    } catch (err) {
                      showToast(err.message || 'Update failed', 'error');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-raahi-teal hover:bg-[#072426] text-white font-bold text-xs transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Create Errand Modal */}
      {circle && (
        <CreateErrandModal
          isOpen={isCreateErrandOpen}
          onClose={() => setIsCreateErrandOpen(false)}
          circleId={circleId}
          circleName={circle.name}
          onCreated={(newErrand) => {
            setErrands((prev) => [newErrand, ...prev]);
            showToast('Quick errand posted to Circle!');
          }}
        />
      )}
    </div>
  );
}
