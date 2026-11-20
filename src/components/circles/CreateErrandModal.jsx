import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  IndianRupee, 
  AlertTriangle, 
  Sparkles, 
  Info,
  Loader2 
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

const CATEGORIES = [
  { id: 'grocery', label: 'Grocery & Essentials', icon: '🛒' },
  { id: 'food_beverage', label: 'Food & Beverage', icon: '☕' },
  { id: 'pharmacy', label: 'Pharmacy & OTC Meds', icon: '💊' },
  { id: 'stationery', label: 'Stationery & Printing', icon: '📝' },
  { id: 'parcel', label: 'Parcel / Gate Pickup', icon: '📦' },
  { id: 'other', label: 'Other Errand', icon: '✨' },
];

export function CreateErrandModal({ isOpen, onClose, circleId, circleName, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'grocery',
    itemBudget: '',
    rewardFee: '20',
    pickupLocationName: '',
    handoverLocationName: '',
    deadlineMinutes: 60,
    instructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide what item or errand you need help with.');
      return;
    }
    if (!formData.itemBudget || Number(formData.itemBudget) <= 0) {
      setError('Please provide a valid estimated budget (₹).');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const deadline = new Date(Date.now() + Number(formData.deadlineMinutes) * 60 * 1000).toISOString();

      const payload = {
        circleId,
        title: formData.title.trim(),
        category: formData.category.toUpperCase(),
        itemBudget: Number(formData.itemBudget),
        rewardFee: Number(formData.rewardFee) || 0,
        pickupLocationName: formData.pickupLocationName.trim(),
        handoverLocationName: formData.handoverLocationName.trim(),
        deadline: deadline,
        instructions: formData.instructions.trim(),
      };

      const res = await apiClient.createCircleErrand(payload);
      if (res && res.status === 'success') {
        if (onCreated) onCreated(res.data.errand);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create errand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#0D3B3E] to-[#124e52] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Post a Quick Errand</h3>
              <p className="text-xs text-emerald-200">Request help inside {circleName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Prohibited items warning */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-800">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Community Safety Policy:</span> Tobacco, alcohol, prescription narcotics, illegal goods, or weapons are strictly prohibited. Violators are removed immediately.
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              What do you need? *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., 2 bottles of Cold Coffee from Cafeteria, Paracetamol strips"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D3B3E]/20 focus:border-[#0D3B3E] text-sm"
              required
            />
          </div>

          {/* Category Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center gap-2 transition-all ${
                    formData.category === cat.id
                      ? 'bg-emerald-50 border-[#0D3B3E] text-[#0D3B3E] font-bold shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Reward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimated Item Cost (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  name="itemBudget"
                  value={formData.itemBudget}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  min="5"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D3B3E]/20 focus:border-[#0D3B3E] text-sm"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">You will reimburse this exact item cost.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Helper Tip / Gratitude (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  name="rewardFee"
                  value={formData.rewardFee}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D3B3E]/20 focus:border-[#0D3B3E] text-sm"
                />
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Paid to the neighbour who helps you.</span>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Pickup Spot
              </label>
              <input
                type="text"
                name="pickupLocationName"
                value={formData.pickupLocationName}
                onChange={handleChange}
                placeholder="e.g. Campus Cafeteria / Chemist"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D3B3E]/20 focus:border-[#0D3B3E] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Handover Spot
              </label>
              <input
                type="text"
                name="handoverLocationName"
                value={formData.handoverLocationName}
                onChange={handleChange}
                placeholder="e.g. Hostel 3 Lobby / Flat 402"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D3B3E]/20 focus:border-[#0D3B3E] text-sm"
              />
            </div>
          </div>

          {/* Urgency / Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Needed Within
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { mins: 30, label: '30 mins' },
                { mins: 60, label: '1 hour' },
                { mins: 120, label: '2 hours' },
                { mins: 240, label: '4 hours' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.mins}
                  onClick={() => setFormData(prev => ({ ...prev, deadlineMinutes: opt.mins }))}
                  className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    formData.deadlineMinutes === opt.mins
                      ? 'bg-emerald-500 text-white border-emerald-500 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Instructions / Brand
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Please pick the sugar-free option if available; call when at the lobby."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D3B3E]/20 focus:border-[#0D3B3E] text-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0D3B3E] hover:bg-[#124e52] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  Post Errand Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
