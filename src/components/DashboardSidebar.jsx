import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  ClipboardList, 
  History, 
  User, 
  Compass, 
  TrendingUp, 
  CheckCircle2, 
  Footprints,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function DashboardSidebar({ 
  currentRole, 
  activeScreen, 
  onNavigate,
  onRoleToggle
}) {
  const isCustomer = currentRole === 'customer';

  const customerNav = [
    { id: 'customer-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'buy', label: 'New Buy & Deliver', icon: ShoppingBag },
    { id: 'pickup', label: 'New Pick Up & Deliver', icon: Package },
    { id: 'customer-requests', label: 'My Requests', icon: ClipboardList },
    { id: 'customer-history', label: 'Order History', icon: History },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  const travellerNav = [
    { id: 'traveller-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'routes', label: 'Publish My Route', icon: Compass },
    { id: 'traveller-matching', label: 'Explore Matching Tasks', icon: Footprints },
    { id: 'traveller-active', label: 'Active Deliveries', icon: ClipboardList },
    { id: 'traveller-earnings', label: 'Earnings Dashboard', icon: TrendingUp },
    { id: 'traveller-completed', label: 'Completed Deliveries', icon: CheckCircle2 },
    { id: 'profile', label: 'Traveller Profile', icon: User }
  ];

  const navItems = isCustomer ? customerNav : travellerNav;

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white rounded-3xl p-5 border border-raahi-border shadow-soft space-y-6">
      {/* Role Indicator Banner */}
      <div className={`p-4 rounded-2xl border ${
        isCustomer 
          ? 'bg-teal-50/80 border-teal-200 text-raahi-teal' 
          : 'bg-amber-50/80 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-black tracking-wider">Active Workspace</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80">
            {isCustomer ? 'Customer' : 'Traveller'}
          </span>
        </div>
        <p className="text-xs leading-snug">
          {isCustomer ? 'Request errands from campus peers' : 'Offset commute costs by carrying errands'}
        </p>
        <button
          type="button"
          onClick={onRoleToggle}
          className="mt-3 text-xs font-bold flex items-center gap-1 hover:underline text-teal-800"
        >
          <span>Switch to {isCustomer ? 'Traveller View' : 'Customer View'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
          {isCustomer ? 'Customer Navigation' : 'Traveller Navigation'}
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                isActive
                  ? 'bg-raahi-teal text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Campus Trust Pill */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="text-[11px] leading-tight">Delhi University Peer-Verified Corridors</span>
      </div>
    </aside>
  );
}
