import React, { useState } from 'react';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { 
  ArrowLeft, 
  Store, 
  Navigation,
  MapPin, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';

export default function BuyAndDeliver({ 
  onBack, 
  onNavigate 
}) {
  const { createRequest } = useRaahi();
  const [title, setTitle] = useState('');
  const [storeName, setStoreName] = useState('');
  const [pickupLocationObj, setPickupLocationObj] = useState(null);
  const [destinationLocationObj, setDestinationLocationObj] = useState(null);
  const [items, setItems] = useState([
    { name: 'Iced Cold Coffee', qty: '1', note: 'Less sugar' },
    { name: 'Cheese Grilled Sandwich', qty: '1', note: 'Brown bread' }
  ]);
  const [estimatedBudget, setEstimatedBudget] = useState('140');
  const [rewardFee, setRewardFee] = useState('45');
  const [timeWindow, setTimeWindow] = useState('Within 45 mins');
  const [notes, setNotes] = useState('Please call when reaching hostel gate, will come down immediately.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);

  const handleAddItem = () => {
    setItems([...items, { name: '', qty: '1', note: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newReq = createRequest({
        type: 'buy',
        title: title || `${items[0]?.name || 'Items'} from ${storeName}`,
        storeOrPickup: storeName,
        pickupArea: pickupLocationObj?.formattedAddress || pickupLocationObj?.name || storeName,
        pickupLocationObj: pickupLocationObj,
        destination: destinationLocationObj?.name || '',
        dropArea: destinationLocationObj?.formattedAddress || destinationLocationObj?.city || "Campus Corridor",
        destinationLocationObj: destinationLocationObj,
        items: items.filter(it => it.name.trim() !== ''),
        itemBudget: Number(estimatedBudget) || 100,
        rewardFee: Number(rewardFee) || 45,
        detourMeters: 250,
        detourTimeMinutes: 6,
        neededBy: timeWindow,
        notes: notes
      });
      setCreatedRequest(newReq);
    }, 600);
  };

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* Web Page Title Bar */}
      <div className="bg-gradient-to-r from-raahi-teal to-[#093538] text-white py-6 border-b border-[#14474B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={onBack}
              className="w-10 h-10 rounded-2xl bg-[#08282A] hover:bg-[#061F20] flex items-center justify-center text-teal-200 transition-colors border border-teal-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Customer Request Flow
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                New Buy &amp; Deliver Errand
              </h2>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-teal-200 bg-[#08282A] px-3 py-1.5 rounded-full border border-teal-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>India-Wide Delivery</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {createdRequest ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 text-center shadow-card border border-teal-200 animate-fade-in space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Request Broadcasted to Commuters!</h3>
            <p className="text-sm text-slate-600">
              Your request for <strong>{createdRequest.title}</strong> has been shared with students walking past <strong>{createdRequest.storeOrPickup}</strong> towards <strong>{createdRequest.destination}</strong>.
            </p>

            <div className="bg-teal-50 rounded-2xl p-5 text-left text-sm space-y-2 border border-teal-100">
              <div className="flex justify-between text-slate-600">
                <span>Estimated Items Cost (Paid to Shop):</span>
                <span className="font-bold text-slate-800">₹{createdRequest.itemBudget}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Commute Travel Reward (Paid to Student):</span>
                <span className="font-bold text-teal-800">₹{createdRequest.rewardFee}</span>
              </div>
              <div className="flex justify-between border-t border-teal-200 pt-2 font-bold text-slate-900 text-base">
                <span>Handover Verification Code:</span>
                <span className="font-mono text-raahi-teal font-black text-lg">{createdRequest.otp}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <PrimaryButton 
                onClick={() => onNavigate(`tracking-${createdRequest.id}`)} 
                variant="primary" 
                size="md"
              >
                Track Live Progress
              </PrimaryButton>
              <button
                type="button"
                onClick={() => onNavigate('customer-dashboard')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Main Form Fields */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                    1. Request Overview
                  </h3>

                  <FormField
                    label="Request Title / Brief Description"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Cold Coffee &amp; Sandwich from Nearby Café, or Medicines from Apollo"
                    required
                    helperText="A clear summary so nearby commuters recognize the errand quickly"
                  />
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                    2. Shop &amp; Delivery Locations
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Purchase From (Shop / Stall Name)"
                      name="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Sudama Tea Stall, Apollo Chemist, Any Shop Name"
                      icon={Store}
                      required
                    />

                    <LocationAutocomplete
                      label="Pickup Area / Market Location"
                      value={pickupLocationObj}
                      onChange={setPickupLocationObj}
                      placeholder="Search market, locality, sector, campus across India..."
                      icon={MapPin}
                      helperText="The broader market / area where the shop is located"
                    />
                  </div>

                  <LocationAutocomplete
                    label="Deliver To (Full Location)"
                    value={destinationLocationObj}
                    onChange={setDestinationLocationObj}
                    required
                    placeholder="Search hostel, faculty, gate, metro station..."
                    icon={Navigation}
                    helperText="Where you want the items delivered"
                  />
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">
                      3. Items &amp; Quantities
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-xs font-bold text-raahi-teal hover:text-teal-900 flex items-center gap-1 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {items.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Item #{idx + 1}</span>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-3">
                            <input
                              type="text"
                              placeholder="Item name (e.g. Iced Cold Coffee, Notebook)"
                              value={item.name}
                              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                              required
                              className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-raahi-teal"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={item.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                              className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-raahi-teal text-center"
                            />
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Special preference (e.g. less sugar, specific brand, ruled paper)"
                          value={item.note}
                          onChange={(e) => handleItemChange(idx, 'note', e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-raahi-teal text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                    4. Timing &amp; Delivery Instructions
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Delivery Urgency"
                      name="timeWindow"
                      type="select"
                      value={timeWindow}
                      onChange={(e) => setTimeWindow(e.target.value)}
                      icon={Clock}
                      options={[
                        "Urgent (Within 30 mins)",
                        "Within 45 mins",
                        "Within 1-2 hours",
                        "Flexible by end of day"
                      ]}
                    />

                    <FormField
                      label="Instructions for Traveller"
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Call upon reaching gate"
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar: Financial Breakdown */}
              <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
                <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-5">
                  <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
                    Payment &amp; Travel Reward
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      label="Est. Items Cost (₹)"
                      name="estimatedBudget"
                      type="number"
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(e.target.value)}
                      icon={IndianRupee}
                      required
                      helperText="Reimbursed to traveller on receipt"
                    />

                    <FormField
                      label="Commute Reward for Student (₹)"
                      name="rewardFee"
                      type="number"
                      value={rewardFee}
                      onChange={(e) => setRewardFee(e.target.value)}
                      icon={IndianRupee}
                      required
                      helperText="Suggested: ₹35 - ₹75 (offsets bus/metro/chai)"
                    />
                  </div>

                  <div className="bg-[#EBF3F8] rounded-2xl p-4 border border-teal-200 text-xs space-y-2.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Store Items Cost:</span>
                      <strong className="text-slate-800">₹{estimatedBudget || 0}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Commute Reward:</span>
                      <strong className="text-teal-800">₹{rewardFee || 0}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-2 font-bold text-base text-slate-900">
                      <span>Estimated Total:</span>
                      <span className="text-raahi-teal">₹{Number(estimatedBudget || 0) + Number(rewardFee || 0)}</span>
                    </div>
                  </div>

                  <PrimaryButton 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    loading={isSubmitting}
                  >
                    Broadcast Errand to Travellers
                  </PrimaryButton>
                </div>
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
}
