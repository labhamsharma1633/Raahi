import React from 'react';
import { Home, Compass, ClipboardList, User, PlusCircle } from 'lucide-react';

export default function BottomNav({ 
  activeTab, 
  onTabChange, 
  currentRole,
  activeOrderCount = 1
}) {
  const isTraveller = currentRole === 'traveller';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-raahi-border/80 px-2 py-1.5 max-w-[440px] mx-auto shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-raahi-teal font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>

        {/* Route / Match for Traveller, or Create for Customer */}
        {isTraveller ? (
          <button
            type="button"
            onClick={() => onTabChange('routes')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'routes'
                ? 'text-raahi-teal font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'routes' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5">My Route</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange('new-request')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'new-request'
                ? 'text-raahi-teal font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-raahi-teal text-white flex items-center justify-center -mt-1 shadow-sm">
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] mt-0.5 text-raahi-teal font-bold">New Errand</span>
          </button>
        )}

        {/* Activity / Tracking */}
        <button
          type="button"
          onClick={() => onTabChange('activity')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'activity'
              ? 'text-raahi-teal font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ClipboardList className={`w-5 h-5 ${activeTab === 'activity' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Activity</span>
          {activeOrderCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-raahi-teal font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
}
