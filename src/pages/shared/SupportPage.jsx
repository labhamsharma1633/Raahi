import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Phone, MessageSquare, ShieldCheck, Mail, Send } from 'lucide-react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useRaahi } from '../../context/RaahiContext';

export default function SupportPage({ onNavigate }) {
  const { showToast } = useRaahi();
  const [topic, setTopic] = useState('General Query');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been received by the DU campus student coordinator.');
  };

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
                Help Centre
              </span>
              <h1 className="text-2xl font-black text-white">Campus Support & Trust</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Direct */}
          <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              Campus Support Desk
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an errand is delayed, or you need assistance verifying a drop-off at a campus hostel gate, reach out to the campus coordinator team.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-xs">
                <Phone className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-bold text-slate-900 block">Delhi University Campus Desk</span>
                  <span className="text-slate-500">+91 11 2766 7788 (10 AM - 6 PM)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-xs">
                <Mail className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-bold text-slate-900 block">Email Assistance</span>
                  <span className="text-slate-500">support@raahi.campus.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              Send a Query
            </h3>

            {submitted ? (
              <div className="p-6 bg-teal-50 rounded-2xl text-center space-y-2 border border-teal-200">
                <ShieldCheck className="w-8 h-8 text-teal-700 mx-auto" />
                <h4 className="text-sm font-bold text-teal-900">Message Received</h4>
                <p className="text-xs text-teal-700">
                  A campus representative will respond to your registered college email within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <FormField
                  label="Topic"
                  name="topic"
                  type="select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  options={[
                    "General Query",
                    "Order Delay / Peer Unreachable",
                    "OTP Handover Assistance",
                    "Disputed Delivery",
                    "Feedback & Suggestions"
                  ]}
                />

                <FormField
                  label="Message / Description"
                  name="message"
                  type="textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or errand reference..."
                  rows={3}
                  required
                />

                <PrimaryButton type="submit" variant="primary" size="md" icon={Send}>
                  Submit Inquiry
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
