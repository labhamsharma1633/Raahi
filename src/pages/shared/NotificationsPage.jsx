import React from 'react';
import { ArrowLeft, Bell, Check, Sparkles, IndianRupee, ShieldCheck } from 'lucide-react';
import { useRaahi } from '../../context/RaahiContext';

export default function NotificationsPage({ onNavigate }) {
  const { notifications, markNotificationsRead } = useRaahi();

  return (
    <div className="pb-16 bg-raahi-bg min-h-screen">
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Inbox
              </span>
              <h1 className="text-2xl font-black text-white">Campus Notifications</h1>
            </div>
          </div>

          <button
            onClick={markNotificationsRead}
            className="text-xs font-bold text-teal-200 hover:text-white bg-[#08282A] px-3.5 py-2 rounded-xl border border-teal-500/30 transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                notif.unread
                  ? 'bg-white border-teal-300 shadow-soft'
                  : 'bg-white/80 border-slate-200'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-raahi-teal flex items-center justify-center shrink-0 border border-teal-100">
                {notif.type === 'reward' ? (
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Bell className="w-4 h-4 text-raahi-teal" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400">{notif.date}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>

              {notif.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 self-center" />
              )}
            </div>
          ))
        ) : (
          <div className="py-16 bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No notifications right now</h4>
          </div>
        )}
      </div>
    </div>
  );
}
