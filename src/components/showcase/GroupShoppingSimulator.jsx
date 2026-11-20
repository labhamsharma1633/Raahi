import React, { useState } from 'react';
import { 
  ShoppingBasket, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Info, 
  RotateCcw,
  User,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

const INITIAL_MEMBERS = [
  {
    id: 'rahul',
    name: 'Rahul',
    room: 'Room 102',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    items: [
      { id: 'r1', name: 'Toned Milk (500ml) & Brown Bread', price: 65, qty: 1 }
    ]
  },
  {
    id: 'priya',
    name: 'Priya',
    room: 'Room 204',
    avatarBg: 'bg-purple-100 text-purple-800',
    items: [
      { id: 'p1', name: 'Fresh Farm Eggs (6-pack)', price: 55, qty: 1 }
    ]
  },
  {
    id: 'aman',
    name: 'Aman',
    room: 'Room 301',
    avatarBg: 'bg-blue-100 text-blue-800',
    items: [
      { id: 'a1', name: 'Digestive Biscuits & Roasted Makhana', price: 65, qty: 1 }
    ]
  }
];

const QUICK_ADD_PRESETS = [
  { name: 'Maggi 4-Pack', price: 56, personId: 'rahul' },
  { name: 'Greek Yogurt Cup', price: 40, personId: 'priya' },
  { name: 'Lassi Bottle (200ml)', price: 30, personId: 'aman' },
];

export default function GroupShoppingSimulator() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const targetThreshold = 150;

  // Calculate live totals
  const totalBasketAmount = members.reduce((sum, member) => {
    return sum + member.items.reduce((mSum, item) => mSum + (item.price * item.qty), 0);
  }, 0);

  const percentage = Math.min(100, Math.round((totalBasketAmount / targetThreshold) * 100));
  const isTargetReached = totalBasketAmount >= targetThreshold;

  const handleUpdateQty = (memberId, itemId, delta) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      return {
        ...m,
        items: m.items.map(item => {
          if (item.id !== itemId) return item;
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        })
      };
    }));
  };

  const handleRemoveItem = (memberId, itemId) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      return {
        ...m,
        items: m.items.filter(item => item.id !== itemId)
      };
    }));
  };

  const handleQuickAdd = (preset) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== preset.personId) return m;
      const existing = m.items.find(i => i.name === preset.name);
      if (existing) {
        return {
          ...m,
          items: m.items.map(i => i.id === existing.id ? { ...i, qty: i.qty + 1 } : i)
        };
      }
      return {
        ...m,
        items: [...m.items, {
          id: `item-${Date.now()}-${Math.random()}`,
          name: preset.name,
          price: preset.price,
          qty: 1
        }]
      };
    }));
  };

  const handleReset = () => {
    setMembers(INITIAL_MEMBERS);
  };

  return (
    <section id="group-shopping-showcase" className="py-12 sm:py-16 bg-gradient-to-b from-white via-[#F8FBFC] to-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full uppercase tracking-wider">
            <ShoppingBasket className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive Feature Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Shop together. <span className="text-emerald-700">Save the hassle.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Try this interactive demonstration. Add or remove items from roommates' carts to watch how pooling items crosses quick-commerce delivery thresholds effortlessly.
          </p>
          <div className="inline-block px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-[11px] font-semibold text-amber-900">
            * Sample demonstration data: all prices, items and contributors are for interactive illustration.
          </div>
        </div>

        {/* The Interactive Simulator Board */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Top Status & Progress Bar */}
          <div className="p-6 sm:p-8 bg-slate-900 text-white space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider block">
                  Circle Shared Basket: Green Park PG #4
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  Combined Basket: ₹{totalBasketAmount}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Minimum</span>
                  <span className="text-sm font-black text-amber-300">₹{targetThreshold}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">
                  {isTargetReached ? 'Target Reached!' : `Need ₹${targetThreshold - totalBasketAmount} more to unlock free delivery`}
                </span>
                <span className={isTargetReached ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isTargetReached 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400' 
                      : 'bg-gradient-to-r from-amber-400 to-emerald-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Celebratory Banner when Target is Reached */}
            {isTargetReached ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-start gap-3 animate-fade-in text-emerald-100">
                <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 font-bold text-sm">
                  ✓
                </div>
                <div className="text-xs space-y-0.5">
                  <h4 className="font-extrabold text-white text-sm">
                    Minimum order reached! Everyone's items are ready for one combined order.
                  </h4>
                  <p className="text-emerald-200/90 leading-relaxed">
                    No small-cart fees, no extra delivery trips. In the current release, a designated circle member places this combined basket directly through the retailer app (Blinkit/Zepto/Instamart) and settles transparently.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center gap-2.5 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Add an item below to reach the ₹{targetThreshold} minimum order target.</span>
              </div>
            )}
          </div>

          {/* Member Contributor Columns */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>Roommates Contributing to this Basket</span>
                <span className="text-xs font-bold text-slate-400">({members.length} members)</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">Click + / - to adjust contributions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {members.map(member => {
                const memberTotal = member.items.reduce((s, i) => s + (i.price * i.qty), 0);

                return (
                  <div 
                    key={member.id}
                    className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <div>
                      {/* Member Info */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl ${member.avatarBg} flex items-center justify-center font-black text-xs`}>
                            {member.name[0]}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">{member.name}</h5>
                            <span className="text-[10px] text-slate-400 font-semibold">{member.room}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                          ₹{memberTotal}
                        </span>
                      </div>

                      {/* Member Items */}
                      <div className="pt-3 space-y-2.5 min-h-[90px]">
                        {member.items.length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-400 italic">
                            No items added yet
                          </div>
                        ) : (
                          member.items.map(item => (
                            <div 
                              key={item.id}
                              className="p-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5 truncate flex-1">
                                <span className="text-xs font-bold text-slate-800 block truncate" title={item.name}>
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  ₹{item.price} each
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleUpdateQty(member.id, item.id, -1)}
                                  disabled={item.qty <= 1}
                                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors disabled:opacity-40"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center text-slate-800">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => handleUpdateQty(member.id, item.id, 1)}
                                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(member.id, item.id)}
                                  className="w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors ml-1"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 text-[11px] text-slate-500 flex justify-between">
                      <span>Share of basket:</span>
                      <strong className="text-slate-800">
                        {totalBasketAmount > 0 ? Math.round((memberTotal / totalBasketAmount) * 100) : 0}%
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick-Add presets for interactive experimentation */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
              <span className="text-xs font-bold text-emerald-900 block">
                Try Adding Sample Items to the Group:
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_ADD_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAdd(preset)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Plus className="w-3 h-3 text-emerald-700" />
                    <span>{preset.name} (+₹{preset.price})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Transparency Callout */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">How Group Checkout Works in Practice:</span>
                <p className="leading-relaxed">
                  In this initial version of Raahi Circles, one designated member (e.g. Rahul) places the combined order through the quick-commerce app on their phone. When the delivery arrives at the gate or hostel lobby, roommates reimburse their exact subtotal without extra surge or minimum cart penalties.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
