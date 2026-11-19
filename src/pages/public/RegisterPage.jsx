import React, { useState } from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Lock,
  ShieldCheck, 
  ShieldAlert, 
  Info 
} from 'lucide-react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useRaahi } from '../../context/RaahiContext';

// Standard Indian States & UTs
const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export default function RegisterPage({ onNavigate }) {
  const { registerUser, showToast } = useRaahi();

  // Required Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [password, setPassword] = useState('');

  // Optional Field
  const [email, setEmail] = useState('');

  // Participation Options (customer | traveller | both)
  const [role, setRolePref] = useState('both');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // If email is not entered, construct an account identifier from phone
    const registrationEmail = email.trim() || `${phone.replace(/\D/g, '')}@raahi.in`;

    try {
      const newUser = await registerUser({
        name: name.trim(),
        email: registrationEmail,
        password: password,
        phone: phone.trim(),
        city: city.trim(),
        college: `${city.trim()}, ${state}`,
        defaultRole: role === 'traveller' ? 'traveller' : 'customer',
      });

      // Redirect directly to the appropriate dashboard
      onNavigate(newUser.defaultRole === 'customer' ? 'customer-dashboard' : 'traveller-dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-raahi-bg min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-card space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-raahi-teal flex items-center justify-center mx-auto border border-teal-200">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Create Your Raahi Account</h2>
            <p className="text-xs text-slate-500">
              Join India's community delivery network.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Ramesh Kumar"
              />

              <FormField
                label="Mobile Number"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={Phone}
                required
                placeholder="+91 98765 XXXXX"
                helperText="Used for parcel handovers"
              />
            </div>

            {/* City/Village & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="City / Village"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                icon={MapPin}
                required
                placeholder="e.g. Phagwara, Patna, Jaipur"
              />

              <FormField
                label="State"
                name="state"
                type="select"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                options={INDIAN_STATES}
              />
            </div>

            {/* Email Address & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Email Address (Optional)"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                placeholder="e.g. name@example.com"
                helperText="Optional for receipt summaries"
              />

              <FormField
                label="Create Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
                placeholder="Minimum 6 characters"
                helperText="To log into your account"
              />
            </div>

            {/* Participation Options */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700 tracking-tight">
                How would you like to participate? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setRolePref('customer')}
                  className={`p-3 rounded-2xl border text-left sm:text-center transition-all ${
                    role === 'customer'
                      ? 'bg-teal-50 border-raahi-teal text-teal-900 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold block text-sm">Customer</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    I need things delivered
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRolePref('traveller')}
                  className={`p-3 rounded-2xl border text-left sm:text-center transition-all ${
                    role === 'traveller'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold block text-sm">Traveller</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    I want to carry & earn
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRolePref('both')}
                  className={`p-3 rounded-2xl border text-left sm:text-center transition-all ${
                    role === 'both'
                      ? 'bg-[#072426] text-white border-[#072426] shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold block text-sm">Both</span>
                  <span className={`text-[11px] block mt-0.5 ${role === 'both' ? 'text-teal-200' : 'text-slate-500'}`}>
                    I can do both
                  </span>
                </button>
              </div>
            </div>

            {/* Identity Verification Section */}
            <div className="rounded-2xl border border-slate-200 bg-[#F9FBFC] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-raahi-teal" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Identity Verification
                  </h3>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <ShieldAlert className="w-3 h-3 text-slate-500" />
                  <span>Status: Not Verified</span>
                </span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-normal">
                  Verification is optional during initial signup. We do not collect biometric data or Aadhaar numbers. You can verify your profile later via supported government identity methods.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <PrimaryButton type="submit" variant="primary" size="lg" loading={loading}>
                Create Raahi Account
              </PrimaryButton>
            </div>
          </form>

          {/* Footer link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-raahi-teal hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
