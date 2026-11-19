import React, { useState } from 'react';
import { 
  MapPin, 
  Bell, 
  ShieldCheck, 
  ShoppingBag, 
  Footprints, 
  PlusCircle, 
  Compass, 
  ClipboardList, 
  User, 
  Menu, 
  X,
  Settings,
  HelpCircle,
  Activity,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';

export default function AppHeader({ 
  activeScreen,
  onNavigate,
  campus = "India-Wide Network",
  locationName = "All States & Cities"
}) {
  const { user, currentRole, setRole, unreadNotificationCount } = useRaahi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isCustomer = currentRole === 'customer';

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Explore' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About Raahi' },
    { 
      id: isCustomer ? 'customer-dashboard' : 'traveller-dashboard', 
      label: isCustomer ? 'Customer Hub' : 'Traveller Hub',
      highlight: true
    }
  ];

  return (
    <header className="w-full bg-raahi-teal text-white sticky top-0 z-40 shadow-md border-b border-[#14474B]">
      {/* Top Campus Zone Utility Bar */}
      <div className="bg-[#072426] border-b border-[#0F3538] text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-teal-200/90 font-medium">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Campus:</span>
              <strong className="text-white">{campus}</strong>
            </span>
            <span className="hidden md:inline-block text-teal-500">•</span>
            <span className="hidden md:inline-block text-teal-300/80">Active Zone: <strong>{locationName}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="font-medium">Student Verified Network</span>
            </span>
            <span className="text-teal-400/50 hidden sm:inline">|</span>
            <span className="text-[11px] text-teal-200/70 hidden sm:inline">
              Commute expense offset model • Zero surge pricing
            </span>
          </div>
        </div>
      </div>

      {/* Main Website Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-teal-200 flex items-center justify-center text-raahi-teal shadow-lg shadow-teal-950/50 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="6" r="3" />
                <path d="M8.5 16.5L15.5 8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                  Raahi
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-800 text-teal-200 px-1.5 py-0.5 rounded">
                  Web MVP
                </span>
              </div>
              <p className="text-xs font-medium text-teal-200/90 tracking-wide mt-0.5">
                Earn on the way<span className="text-teal-400 font-bold">.</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeScreen === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#08282A] text-white shadow-inner font-bold border border-teal-500/30'
                      : link.highlight
                        ? 'bg-teal-900/40 text-teal-100 hover:bg-teal-900/80 border border-teal-500/20'
                        : 'text-teal-100/80 hover:text-white hover:bg-teal-900/40'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Hub: Role Switcher, Notifications & User Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Role Switcher Pill */}
            <div className="bg-[#08282A] p-1 rounded-2xl flex items-center border border-teal-500/30 shadow-inner">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  isCustomer
                    ? 'bg-white text-raahi-teal shadow-md'
                    : 'text-teal-200 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('traveller')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  !isCustomer
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-teal-200 hover:text-white'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Traveller</span>
                <span className="text-[10px] bg-amber-950 text-amber-200 px-1 rounded-full font-bold">
                  ₹
                </span>
              </button>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => handleNavClick('notifications')}
              aria-label="Notifications"
              className="w-10 h-10 rounded-xl bg-[#08282A] hover:bg-[#061F21] border border-teal-500/30 flex items-center justify-center relative text-teal-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#0D3B3E]" />
              )}
            </button>

            {/* User Profile Avatar & Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-[#08282A] hover:bg-[#061F21] border border-teal-500/30 text-xs font-bold text-white transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5">
                  <div className="w-full h-full rounded-[6px] bg-raahi-teal flex items-center justify-center font-bold text-[10px] text-white">
                    {user?.name?.[0] || 'U'}
                  </div>
                </div>
                <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-teal-300" />
              </button>

              {/* Flyout Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 text-xs text-slate-700 z-50 animate-fade-in divide-y divide-slate-100">
                  <div className="p-3">
                    <strong className="block text-slate-900 font-bold">{user?.name}</strong>
                    <span className="text-[11px] text-slate-400 block truncate">{user?.email}</span>
                    <span className="inline-block mt-1 text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                      Mode: {currentRole.toUpperCase()}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleNavClick(isCustomer ? 'customer-dashboard' : 'traveller-dashboard')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-teal-600" />
                      <span>{isCustomer ? 'Customer Dashboard' : 'Traveller Dashboard'}</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('activity')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-2"
                    >
                      <Activity className="w-4 h-4 text-teal-600" />
                      <span>System Activity Log</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('settings')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-teal-600" />
                      <span>Settings & Sample Data</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('support')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-teal-600" />
                      <span>Help & Campus Desk</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => handleNavClick('login')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign In / Switch Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setRole(isCustomer ? 'traveller' : 'customer')}
              className="text-xs font-bold bg-[#08282A] px-2.5 py-1.5 rounded-xl border border-teal-500/30 text-teal-200"
            >
              {isCustomer ? 'Switch to Traveller' : 'Switch to Customer'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#08282A] text-teal-200 hover:text-white border border-teal-500/30"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#08282A] border-t border-teal-500/30 px-4 pt-3 pb-5 space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className="p-2.5 bg-[#0B3538] text-teal-100 rounded-xl text-left text-xs font-bold"
            >
              Explore Errands
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="p-2.5 bg-[#0B3538] text-teal-100 rounded-xl text-left text-xs font-bold"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick(isCustomer ? 'customer-dashboard' : 'traveller-dashboard')}
              className="p-2.5 bg-raahi-teal text-white rounded-xl text-left text-xs font-bold border border-teal-400"
            >
              {isCustomer ? 'Customer Hub' : 'Traveller Hub'}
            </button>
            <button
              onClick={() => handleNavClick('settings')}
              className="p-2.5 bg-[#0B3538] text-teal-100 rounded-xl text-left text-xs font-bold"
            >
              Settings & Data
            </button>
          </div>

          <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between text-xs text-teal-200">
            <button
              onClick={() => handleNavClick('notifications')}
              className="flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              <span>Notifications ({unreadNotificationCount})</span>
            </button>
            <button
              onClick={() => handleNavClick('support')}
              className="flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Support Desk</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
