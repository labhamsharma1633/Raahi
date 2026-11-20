import React from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  Route, 
  Footprints, 
  ShieldCheck, 
  Users, 
  MapPin, 
  IndianRupee,
  Video
} from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import RaahiVideoPlayer from '../../components/video/RaahiVideoPlayer';

export default function AboutPage({ onNavigate }) {
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
              About Raahi
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              The Story Behind Raahi
            </h1>
            <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
              We believe everyday travel shouldn't just be an expense — it can be an opportunity to help someone nearby and offset your own commute.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Dedicated 60-Second Video Section */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full">
              <Video className="w-3.5 h-3.5 text-teal-700" />
              <span>OFFICIAL EXPLAINER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              See how Raahi makes everyday life easier.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Real-life problems. Simple community-powered solutions.
            </p>
          </div>

          {/* Interactive 16:9 Video Player */}
          <div className="max-w-4xl mx-auto">
            <RaahiVideoPlayer />
          </div>
        </section>

        {/* The Problem & The Insight */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-4 border-t border-slate-200/80">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>THE COMMUNITY INSIGHT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Why dispatch a special vehicle when someone is already walking that way?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In college campuses and urban neighborhoods across India, traditional delivery apps create unnecessary traffic, high minimum order values, and steep delivery fees. Sending a dedicated motorbike 3 kilometers for a pack of medicines or notes is expensive and wasteful.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              At the same time, hundreds of students and commuters are already walking past that exact shop, pharmacy, or stationery hub on their way to the library, lecture hall, or hostel.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-raahi-border shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Our Core Brand Principles
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-100">
                <strong className="text-xs font-bold text-raahi-teal block">Brand Name: Raahi (The Wayfarer)</strong>
                <span className="text-xs text-slate-600">A companion on the journey who helps a peer along their route.</span>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
                <strong className="text-xs font-bold text-amber-900 block">Tagline: "Earn on the way."</strong>
                <span className="text-xs text-slate-600">Rewards are transparently earned to help cover everyday travel costs.</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-xs font-bold text-slate-800 block">Core Message</strong>
                <span className="text-xs text-slate-600">"Going somewhere? Help someone along the way."</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Campus First */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Why Launch on a University Campus?
            </h3>
            <p className="text-sm text-slate-600">
              Delhi University North Campus has the ideal geographic and social density for community logistics:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-raahi-teal flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">High Foot-Traffic Corridors</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dense pedestrian movement connecting Kamla Nagar markets, Patel Chest stationery stores, and campus hostel clusters.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <IndianRupee className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Meaningful Commute Offsets</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Earning ₹45 - ₹75 per trip offsets everyday student expenses like metro recharge, bus passes, and evening snacks.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Inherent Peer Accountability</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                College ID verification fosters natural mutual respect, care for parcels, and timely deliveries across peers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
