import React from 'react';
import { ShoppingBag, Footprints } from 'lucide-react';

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  return (
    <div className="w-full px-4 sm:px-6 pt-3 pb-1">
      <div className="bg-[#092B2D] p-1 rounded-2xl flex items-center border border-[#16494C] shadow-inner relative">
        {/* Customer Button */}
        <button
          type="button"
          onClick={() => onRoleChange('customer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 relative ${
            currentRole === 'customer'
              ? 'bg-white text-raahi-teal shadow-md shadow-black/20 font-bold scale-[1.01]'
              : 'text-teal-200/80 hover:text-white hover:bg-teal-900/30'
          }`}
        >
          <ShoppingBag className={`w-4 h-4 ${currentRole === 'customer' ? 'text-raahi-teal' : 'text-teal-300'}`} />
          <span>Customer</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
            currentRole === 'customer' ? 'bg-teal-100 text-teal-800' : 'bg-teal-900/60 text-teal-300'
          }`}>
            Get items
          </span>
        </button>

        {/* Traveller Button */}
        <button
          type="button"
          onClick={() => onRoleChange('traveller')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 relative ${
            currentRole === 'traveller'
              ? 'bg-white text-raahi-teal shadow-md shadow-black/20 font-bold scale-[1.01]'
              : 'text-teal-200/80 hover:text-white hover:bg-teal-900/30'
          }`}
        >
          <Footprints className={`w-4 h-4 ${currentRole === 'traveller' ? 'text-raahi-teal' : 'text-teal-300'}`} />
          <span>Traveller</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
            currentRole === 'traveller' ? 'bg-amber-100 text-amber-800' : 'bg-amber-950/60 text-amber-300'
          }`}>
            Earn ₹
          </span>
        </button>
      </div>
    </div>
  );
}
