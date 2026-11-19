import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Mail, Phone, BookOpen, ShieldCheck } from 'lucide-react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useRaahi } from '../../context/RaahiContext';

export default function RegisterPage({ onNavigate }) {
  const { setUser, setRole, showToast } = useRaahi();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('Kirori Mal College');
  const [rollNo, setRollNo] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRolePref] = useState('both');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const newUser = {
        id: 'USR-' + Math.floor(100 + Math.random() * 900),
        name,
        email,
        college: `${college}, Delhi University`,
        rollNo,
        phone,
        role: role === 'traveller' ? 'traveller' : 'customer',
        verified: true,
        rating: 5.0,
        completedDeliveries: 0,
        requestedErrands: 0
      };

      setUser(newUser);
      setRole(newUser.role);
      showToast('Registration successful! Campus profile verified.');
      onNavigate(newUser.role === 'customer' ? 'customer-dashboard' : 'traveller-dashboard');
    }, 700);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-raahi-bg min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-raahi-teal flex items-center justify-center mx-auto border border-teal-200">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Create Verified Student Profile</h2>
            <p className="text-xs text-slate-500">
              Join the Delhi University North Campus route delivery network
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Ananya Roy"
              />

              <FormField
                label="College / Department"
                name="college"
                type="select"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
                options={[
                  "Kirori Mal College",
                  "Miranda House",
                  "St. Stephen's College",
                  "SRCC",
                  "Hindu College",
                  "Ramjas College",
                  "Faculty of Arts",
                  "Faculty of Law",
                  "Gwyer / Jubilee Hostels"
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Institutional Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
                placeholder="rollno@college.du.ac.in"
                helperText="Used for peer trust verification"
              />

              <FormField
                label="College Roll / ID Number"
                name="rollNo"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                icon={BookOpen}
                required
                placeholder="e.g. 23/HIST/089"
              />
            </div>

            <FormField
              label="Mobile Number (For Handover Calls & WhatsApp)"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              required
              placeholder="+91 98765 XXXXX"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Participation Interest
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRolePref('customer')}
                  className={`p-3 rounded-xl border font-bold text-center transition-all ${
                    role === 'customer'
                      ? 'bg-teal-50 border-raahi-teal text-raahi-teal'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  I need errands delivered
                </button>
                <button
                  type="button"
                  onClick={() => setRolePref('traveller')}
                  className={`p-3 rounded-xl border font-bold text-center transition-all ${
                    role === 'traveller'
                      ? 'bg-amber-50 border-amber-500 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  I want to carry & earn
                </button>
                <button
                  type="button"
                  onClick={() => setRolePref('both')}
                  className={`p-3 rounded-xl border font-bold text-center transition-all ${
                    role === 'both'
                      ? 'bg-teal-900 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Both (Flexible)
                </button>
              </div>
            </div>

            <div className="pt-2">
              <PrimaryButton type="submit" variant="primary" size="lg" loading={loading}>
                Complete Campus Registration
              </PrimaryButton>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have a profile?{' '}
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
