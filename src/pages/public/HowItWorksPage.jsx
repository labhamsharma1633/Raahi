import React from 'react';
import { 
  ArrowLeft, 
  Route, 
  MapPin, 
  Compass, 
  Footprints, 
  ShieldCheck, 
  CheckCircle2, 
  IndianRupee, 
  HeartHandshake, 
  Lock,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';

export default function HowItWorksPage({ onNavigate }) {
  const faqs = [
    {
      q: "How does Raahi differ from food and courier delivery apps?",
      a: "Commercial delivery apps deploy dedicated drivers who take special trips just for you, resulting in high delivery fees and surge pricing. Raahi matches you with students and commuters who are already travelling along that exact path anyway, making errands affordable and sustainable."
    },
    {
      q: "How are travel rewards calculated?",
      a: "Rewards are designed to help cover real transportation costs (such as metro tokens, bus fare, or auto share). Suggested rewards range between ₹35 and ₹85 based on parcel size, store waiting time, and estimated detour distance."
    },
    {
      q: "How do you ensure campus safety and trust?",
      a: "Every student profile is verified via university email and college roll numbers. Deliveries are protected with a mandatory 4-digit verification code exchanged upon handover."
    },
    {
      q: "What happens if a traveller cannot find my item?",
      a: "Travellers can message or call you through the in-app interface to check for substitute brands or cancel the errand before purchase without penalties."
    }
  ];

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-raahi-teal via-[#093538] to-[#072426] text-white py-12 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-200 hover:text-white bg-[#08282A] px-3 py-1.5 rounded-xl border border-teal-500/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
              The Peer Commute Model
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              How Raahi Works on Campus
            </h1>
            <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
              Every day, thousands of students walk between Kamla Nagar, Vishwa Vidyalaya Metro, and college hostels. Raahi turns those existing journeys into a mutual help network.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Visual 4-Step Lifecycle */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-raahi-text-main">
              Four Simple Steps to Move Anything
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              No extra commercial delivery vehicles. Zero unnecessary carbon emissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-raahi-teal flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Post an Errand</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A customer creates a <strong>Buy & Deliver</strong> (snacks, notes, medicines) or <strong>Pick Up & Deliver</strong> request with their pickup and campus destination.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Route Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Route Matching Engine compares the request against published commuter routes. Only tasks with a minor detour (average +200m to +350m) are surfaced.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Carry & Verify</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The traveller picks up the item along their walk. At the drop point, the customer provides a 4-digit handover verification code to complete the transfer safely.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-raahi-border shadow-soft space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900">Offset Travel Costs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The reward (₹35 - ₹80) is immediately credited to the traveller's earnings ledger, directly offsetting their daily metro recharge, bus fare, or auto commute.
              </p>
            </div>
          </div>
        </section>

        {/* Safety & Trust Architecture */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft">
          <div className="max-w-2xl mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SAFETY ARCHITECTURE</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Built on Campus Peer Verification
            </h3>
            <p className="text-sm text-slate-600">
              Safety and mutual accountability are the core foundations of the Raahi community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Institutional Verification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All users verify with college institutional email domains (@kmc.du.ac.in, @srcc.du.ac.in, etc.) and college roll numbers.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>4-Digit Handover OTP</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deliveries cannot be marked complete without the recipient sharing their secret 4-digit code in person.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>Receipt Transparency</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For Buy & Deliver tasks, shop paper receipts or UPI payment screenshots are shared upon handover for 100% honesty.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Everything you need to know about peer-powered errands</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-raahi-teal shrink-0" />
                  <span>{f.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-teal-900 to-[#072426] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-hero">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Experience Raahi?
          </h3>
          <p className="text-xs sm:text-sm text-teal-200 max-w-lg mx-auto leading-relaxed">
            Going somewhere across campus today? Help someone along the way and earn rewards to help cover your travel costs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <PrimaryButton 
              onClick={() => onNavigate('buy')} 
              variant="accent" 
              size="md"
              fullWidth={false}
            >
              Post an Errand as Customer
            </PrimaryButton>
            <PrimaryButton 
              onClick={() => onNavigate('routes')} 
              variant="outline" 
              size="md"
              fullWidth={false}
              className="text-white border-teal-400/40 hover:bg-teal-900/60"
            >
              Publish Commute as Traveller
            </PrimaryButton>
          </div>
        </section>
      </div>
    </div>
  );
}
