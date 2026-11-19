import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useRaahi } from '../../context/RaahiContext';

export default function LoginPage({ onNavigate }) {
  const { loginUser, showToast } = useRaahi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const loggedIn = await loginUser(email.trim(), password);
      // Navigate to the user's active dashboard
      onNavigate(loggedIn.defaultRole === 'traveller' ? 'traveller-dashboard' : 'customer-dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-raahi-bg min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
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
              India-wide route delivery and commute reimbursement network
            </p>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <FormField
              label="Email Address or Mobile ID"
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              placeholder="e.g. yourname@example.com"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              placeholder="Enter your password"
            />

            <div className="pt-2">
              <PrimaryButton type="submit" variant="primary" size="lg" loading={loading}>
                Sign In to Account
              </PrimaryButton>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have a Raahi account yet?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-bold text-raahi-teal hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
