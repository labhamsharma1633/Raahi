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
  LogIn,
  ChevronDown,
  GraduationCap,
  Globe
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';

export default function AppHeader({ 
  activeScreen,
  onNavigate,
  campus = "India-Wide Network",
  locationName = "All States & Cities"
}) {
  const { 
    user, 
    currentRole, 
    setRole, 
    logoutUser, 
    unreadNotificationCount,
    activeNetwork,
    switchNetwork,
    enrollCampus,
    isCampusEnrolled,
    campusInfo
  } = useRaahi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [collegeInput, setCollegeInput] = useState('');
  const [instEmailInput, setInstEmailInput] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!collegeInput.trim()) return;
    setEnrolling(true);
    try {
      await enrollCampus(collegeInput.trim(), instEmailInput.trim());
      setEnrollModalOpen(false);
      setCollegeInput('');
      setInstEmailInput('');
    } catch (err) {
      // Error is handled in context toast
    } finally {
      setEnrolling(false);
    }
  };

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
  ];

  if (user) {
    navLinks.push({ 
      id: isCustomer ? 'customer-dashboard' : 'traveller-dashboard', 
      label: isCustomer ? 'Customer Hub' : 'Traveller Hub',
      highlight: true
    });
  }

  return (
    <header className="w-full bg-raahi-teal text-white sticky top-0 z-40 shadow-md border-b border-[#14474B]">
      {/* Top Utility Bar with Dual-Network Switcher */}
      <div className="bg-[#072426] border-b border-[#0F3538] text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dual Network Switcher Toggle Pill */}
            <div className="flex items-center bg-[#051C1E] p-0.5 rounded-xl border border-teal-500/30 text-[11px]">
              <button
                onClick={() => switchNetwork('community')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeNetwork === 'community'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-teal-300 hover:text-white'
                }`}
                title="Public India-Wide Network"
              >
                <Globe className="w-3 h-3" />
                <span>Community</span>
              </button>
              <button
                onClick={() => {
                  if (isCampusEnrolled) {
                    switchNetwork('campus');
                  } else {
                    setEnrollModalOpen(true);
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeNetwork === 'campus'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-teal-300 hover:text-white'
                }`}
                title={isCampusEnrolled ? `Campus Network (${campusInfo?.collegeName})` : 'Join your College Campus'}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Campus</span>
                {!isCampusEnrolled && (
                  <span className="text-[9px] bg-teal-800 text-teal-200 px-1 rounded ml-0.5">Join</span>
                )}
              </button>
            </div>

            <span className="hidden sm:inline-block text-teal-500">•</span>
            <span className="flex items-center gap-1.5 text-teal-200/90 font-medium truncate max-w-[200px] sm:max-w-none">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Network:</span>
              <strong className="text-white">
                {activeNetwork === 'campus' && campusInfo?.collegeName
                  ? `${campusInfo.collegeName} (Campus)`
                  : `${user?.city || 'India-Wide'}`}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="font-medium">Direct Peer-to-Peer</span>
            </span>
            <span className="text-teal-400/50 hidden sm:inline">|</span>
            <span className="text-[11px] text-teal-200/70 hidden sm:inline">
              Commute expense offset model • One Account, Two Networks
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
                <path d="M12 18V6l6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">Raahi</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                  India
                </span>
              </div>
              <span className="text-[11px] text-teal-200 font-medium hidden sm:block tracking-wide">
                Earn on the way.
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#093538] p-1.5 rounded-2xl border border-teal-500/20">
            {navLinks.map((link) => {
              const isActive = activeScreen === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-raahi-teal shadow-sm'
                      : link.highlight
                      ? 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30'
                      : 'text-teal-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* User Controls & Role Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Action Button */}
            {isCustomer ? (
              <button
                onClick={() => handleNavClick('buy')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Errand</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('routes')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Publish Route</span>
              </button>
            )}

            {/* Role Toggle Pill */}
            <div className="flex items-center bg-[#072426] p-1 rounded-2xl border border-teal-500/30">
              <button
                onClick={() => setRole('customer')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  isCustomer
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-teal-200 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
              <button
                onClick={() => setRole('traveller')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  !isCustomer
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-teal-200 hover:text-white'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Traveller</span>
              </button>
            </div>

            {/* User Profile Avatar / Sign In */}
            {user ? (
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
                        onClick={() => handleNavClick('profile')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4 text-teal-600" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('support')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4 text-teal-600" />
                        <span>Help & Support</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logoutUser();
                          handleNavClick('home');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-xs font-bold px-3 py-2 text-teal-200 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="bg-white text-raahi-teal hover:bg-teal-50 text-xs font-black py-2 px-3.5 rounded-xl transition-all shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setRole(isCustomer ? 'traveller' : 'customer')}
              className={`p-2 rounded-xl text-xs font-bold border border-teal-500/30 ${
                isCustomer ? 'bg-teal-600 text-white' : 'bg-amber-400 text-slate-900'
              }`}
            >
              {isCustomer ? 'Customer' : 'Traveller'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#08282A] border border-teal-500/30 text-teal-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Join Campus Network Modal (One Account, Two Networks) */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Join Raahi Campus</h3>
                  <p className="text-xs text-slate-500">Connect with peers at your college</p>
                </div>
              </div>
              <button
                onClick={() => setEnrollModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!user ? (
              <div className="space-y-4 text-center py-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  You need a Raahi account to access your campus network. One account gives you access to both Campus and Community!
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setEnrollModalOpen(false);
                      handleNavClick('login');
                    }}
                    className="text-xs font-bold px-4 py-2 text-raahi-teal hover:underline"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setEnrollModalOpen(false);
                      handleNavClick('register');
                    }}
                    className="bg-raahi-teal text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-[#072426]"
                  >
                    Register Account
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700">College / University Name</label>
                  <input
                    type="text"
                    value={collegeInput}
                    onChange={(e) => setCollegeInput(e.target.value)}
                    required
                    placeholder="e.g. St. Stephen's College, DU"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-[10px] text-slate-400">Enter your institution's name to discover campus peers.</p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700">
                    Institutional Email <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={instEmailInput}
                    onChange={(e) => setInstEmailInput(e.target.value)}
                    placeholder="e.g. yourname@college.edu.in"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-[10px] text-slate-400">Used for optional institutional eligibility verification.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(false)}
                    className="text-xs font-bold px-4 py-2 text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={enrolling || !collegeInput.trim()}
                    className="bg-raahi-teal hover:bg-[#072426] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'Join Campus Network'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
