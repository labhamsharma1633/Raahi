import React from 'react';
import {
  Users,
  MapPin,
  Shield,
  ArrowRight,
  Clock,
  Sparkles,
  Building2,
  Home,
  GraduationCap,
  Briefcase,
  Compass,
} from 'lucide-react';

const GRADIENTS = {
  teal: 'from-[#0D3B3E] to-[#14474B]',
  amber: 'from-amber-700 to-amber-900',
  indigo: 'from-indigo-800 to-indigo-950',
  rose: 'from-rose-700 to-rose-900',
  emerald: 'from-emerald-700 to-emerald-900',
  violet: 'from-purple-800 to-purple-950',
};

const TYPE_ICONS = {
  HOSTEL_PG: Home,
  OFFICE: Briefcase,
  SOCIETY_APARTMENT: Building2,
  COLLEGE: GraduationCap,
  NEIGHBOURHOOD: Compass,
  CUSTOM: Sparkles,
};

const TYPE_LABELS = {
  HOSTEL_PG: 'Hostel / PG',
  OFFICE: 'Office Workspace',
  SOCIETY_APARTMENT: 'Society / Apartment',
  COLLEGE: 'College Campus',
  NEIGHBOURHOOD: 'Neighbourhood',
  CUSTOM: 'Custom Circle',
};

export default function CircleCard({
  circle,
  membership = null,
  onOpen,
  onRequestJoin,
  joining = false,
}) {
  const gradientClass = GRADIENTS[circle.coverGradient] || GRADIENTS.teal;
  const TypeIcon = TYPE_ICONS[circle.type] || Sparkles;
  const typeLabel = TYPE_LABELS[circle.type] || circle.type;

  const isMember = membership?.status === 'ACTIVE' || circle.myStatus === 'ACTIVE';
  const isPending = membership?.status === 'PENDING_APPROVAL' || circle.myStatus === 'PENDING_APPROVAL';
  const role = membership?.role || (circle.myStatus === 'ACTIVE' ? 'MEMBER' : null);

  return (
    <div className="bg-white rounded-3xl border border-raahi-border shadow-soft overflow-hidden hover:shadow-card transition-all flex flex-col justify-between group">
      <div>
        {/* Card Header Gradient */}
        <div className={`bg-gradient-to-r ${gradientClass} p-5 text-white relative`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-md text-[11px] font-bold text-teal-100 border border-white/10">
              <TypeIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>{typeLabel}</span>
            </span>

            {isMember ? (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                {role || 'Joined'}
              </span>
            ) : isPending ? (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Approval Pending
              </span>
            ) : (
              <span className="text-[10px] font-bold text-teal-200">
                {circle.visibility === 'PRIVATE_INVITE_ONLY' ? 'Private' : 'Discoverable'}
              </span>
            )}
          </div>

          <h3 className="text-base font-extrabold text-white leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
            {circle.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-teal-100/90 mt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{circle.approximateArea}, {circle.city}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {circle.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Users className="w-4 h-4 text-teal-600" />
              <span>{circle.memberCount || 1} trusted member{circle.memberCount === 1 ? '' : 's'}</span>
            </div>

            {circle.visibility === 'PRIVATE_INVITE_ONLY' && (
              <span className="text-[10px] font-bold text-slate-400">Invite Only</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 pb-5 pt-0">
        {isMember ? (
          <button
            onClick={() => onOpen(circle._id || circle.id)}
            className="w-full py-2.5 px-4 rounded-xl bg-raahi-teal hover:bg-[#072426] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Enter Circle Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : isPending ? (
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Join Request Pending</span>
          </button>
        ) : (
          <button
            onClick={() => onRequestJoin(circle._id || circle.id)}
            disabled={joining}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-raahi-teal text-teal-800 hover:text-white border border-teal-200 hover:border-raahi-teal font-bold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            {joining ? 'Submitting...' : 'Request to Join'}
          </button>
        )}
      </div>
    </div>
  );
}
