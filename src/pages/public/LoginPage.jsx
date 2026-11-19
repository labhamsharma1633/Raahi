import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck, Footprints, ShoppingBag } from 'lucide-react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useRaahi } from '../../context/RaahiContext';

export default function LoginPage({ onNavigate }) {
  const { setUser, setRole, showToast } = useRaahi();
  const [email, setEmail] = useState('sameer.gautam@kmc.du.ac.in');
  const [password, setPassword] = useState('password123');
  const [preferredRole, setPreferredRole] = useState('customer');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const loggedInUser = {
        id: 'USR-' + Math.floor(100 + Math.random() * 900),
        name: email.includes('aarav') ? 'Aarav Gupta' : 'Sameer Gautam',
        email: email,
        college: 'Kirori Mal College, Delhi University',
        rollNo: '22/ECO/104',
        role: preferredRole,
        verified: true,
        rating: 4.92,
        completedDeliveries: 11,
        requestedErrands: 7
      };

      setUser(loggedInUser);
      setRole(preferredRole);
      showToast(`Welcome back, ${loggedInUser.name}!`);
      onNavigate(preferredRole === 'customer' ? 'customer-dashboard' : 'traveller-dashboard');
    }, 600);
  };

  const handleQuickDemo = (role, demoEmail, demoName) => {
    setEmail(demoEmail);
    setPreferredRole(role);
    const demoUser = {
      id: 'USR-DEMO-' + role.toUpperCase(),
      name: demoName,
      email: demoEmail,
      college: 'Delhi University — North Campus',
      rollNo: '22/DU/401',
      role: role,
      verified: true,
      rating: 4.95,
      completedDeliveries: role === 'traveller' ? 14 : 2,
      requestedErrands: role === 'customer' ? 9 : 1
    };
    setUser(demoUser);
    setRole(role);
    showToast(`Logged in as ${demoName} (${role.toUpperCase()})`);
    onNavigate(role === 'customer' ? 'customer-dashboard' : 'traveller-dashboard');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-raahi-bg min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-raahi-teal text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 text-teal-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Sign in to Raahi</h2>
            <p className="text-xs text-slate-500">
              Campus community delivery and commute reimbursement network
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <FormField
              label="Campus Institutional Email / Username"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              placeholder="name@college.du.ac.in"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              placeholder="••••••••"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Default Mode Upon Login
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredRole('customer')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    preferredRole === 'customer'
                      ? 'bg-teal-50 border-raahi-teal text-raahi-teal'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredRole('traveller')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    preferredRole === 'traveller'
                      ? 'bg-amber-50 border-amber-500 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  <span>Traveller</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <PrimaryButton type="submit" variant="primary" size="lg" loading={loading}>
                Sign In to Account
              </PrimaryButton>
            </div>
          </form>

          {/* Quick Demo Presets */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick 1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer', 'sameer.gautam@kmc.du.ac.in', 'Sameer Gautam')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 text-left transition-colors"
              >
                <strong>Sameer (Customer)</strong>
                <span className="block text-slate-400 text-[10px]">Hostel Errand Requester</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('traveller', 'aarav.gupta@physics.du.ac.in', 'Aarav Gupta')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 text-left transition-colors"
              >
                <strong>Aarav (Traveller)</strong>
                <span className="block text-slate-400 text-[10px]">Daily Campus Commuter</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have a verified campus profile?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-bold text-raahi-teal hover:underline"
              >
                Register Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
