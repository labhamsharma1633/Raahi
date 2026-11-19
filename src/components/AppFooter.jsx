import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AppFooter({ onNavigate }) {
  return (
    <footer className="w-full bg-[#072426] text-white border-t border-[#103E42] pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-teal-900/60">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-300 flex items-center justify-center text-raahi-teal font-black text-sm">
                R
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Raahi</span>
            </div>
            <p className="text-xs text-teal-200/80 leading-relaxed">
              Earn on the way. Community-powered, route-based delivery application designed for college campuses and everyday commuters in India.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus ID Verified Network</span>
            </div>
          </div>

          {/* Customer Flows */}
          <div className="space-y-2.5 text-xs text-teal-200/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Customer Hub</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('customer-dashboard')} className="hover:text-white transition-colors">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('buy')} className="hover:text-white transition-colors">
                  Post Buy & Deliver
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pickup')} className="hover:text-white transition-colors">
                  Post Pick Up & Deliver
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer-requests')} className="hover:text-white transition-colors">
                  My Requests & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer-history')} className="hover:text-white transition-colors">
                  Order Receipts & History
                </button>
              </li>
            </ul>
          </div>

          {/* Traveller Flows */}
          <div className="space-y-2.5 text-xs text-teal-200/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Traveller Hub</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('traveller-dashboard')} className="hover:text-white transition-colors">
                  Traveller Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('routes')} className="hover:text-white transition-colors">
                  Publish Commute Route
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('traveller-matching')} className="hover:text-white transition-colors">
                  Explore Matching Tasks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('traveller-active')} className="hover:text-white transition-colors">
                  Active Tasks & Handover OTP
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('traveller-earnings')} className="hover:text-white transition-colors">
                  Earnings & Travel Offsets
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Community Disclaimer */}
          <div className="space-y-2.5 text-xs text-teal-200/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Community Principle</h5>
            <p className="text-[11px] leading-relaxed text-teal-300/80">
              Raahi connects campus peers along their existing travel paths. Rewards are designed to help cover daily travel expenses (metro, bus, auto share). We do not promise guaranteed earnings or employment.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <button onClick={() => onNavigate('settings')} className="text-teal-300 hover:underline">
                Settings & Sample Data
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('support')} className="text-teal-300 hover:underline">
                Campus Support
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-teal-400/70">
          <p>© {new Date().getFullYear()} Raahi. Built for University Campus Communities.</p>
          <p>
            <span>Going somewhere? Help someone along the way.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
