import React, { useState } from 'react';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  Tag 
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';

export default function PickupAndDeliver({
  onBack,
  onNavigate
}) {
  const { createRequest } = useRaahi();
  const [title, setTitle] = useState('');
  const [pickupLocationObj, setPickupLocationObj] = useState(null);
  const [pickupCode, setPickupCode] = useState('');
  const [destinationLocationObj, setDestinationLocationObj] = useState(null);
  const [packageSize, setPackageSize] = useState('Small / Document Envelope (< 500g)');
  const [rewardFee, setRewardFee] = useState('50');
  const [timeWindow, setTimeWindow] = useState('Within 45 mins');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdRequest, setCreatedRequest] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const newReq = await createRequest({
        type: 'pickup',
        title: title.trim() || `Collect Package from ${pickupLocationObj?.name || 'Collection Point'}`,
        storeOrPickup: pickupLocationObj?.name || 'Collection Point',
        pickupArea: pickupLocationObj?.formattedAddress || '',
        pickupLocation: pickupLocationObj,
        destination: destinationLocationObj?.name || destinationLocationObj?.formattedAddress || 'Delivery Destination',
        dropArea: destinationLocationObj?.formattedAddress || '',
        destinationLocation: destinationLocationObj,
        items: [
          { name: title.trim() || "Pre-packaged parcel/document", qty: 1, note: pickupCode }
        ],
        itemBudget: 0,
        rewardFee: Number(rewardFee) || 50,
        detourMeters: 300,
        detourTimeMinutes: 7,
        neededBy: timeWindow,
        notes: notes,
      });

      if (newReq) {
        setCreatedRequest(newReq);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to broadcast pickup request. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20 bg-raahi-bg min-h-screen">
      {/* Title Bar */}
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
                New Pick Up &amp; Deliver Errand
              </h2>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-teal-200 bg-[#08282A] px-3 py-1.5 rounded-full border border-teal-500/30">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Pre-packed / Pre-paid Items</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {createdRequest ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 text-center shadow-card border border-teal-200 animate-fade-in space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Pickup Broadcasted!</h3>
            <p className="text-sm text-slate-600">
              Commuters moving past <strong>{createdRequest.storeOrPickup}</strong> have received your request to transport it to <strong>{createdRequest.destination}</strong>.
            </p>

            <div className="bg-teal-50 rounded-2xl p-5 text-left text-sm space-y-2 border border-teal-100">
              <div className="flex justify-between text-slate-600">
                <span>Item State:</span>
                <span className="font-bold text-emerald-700">Pre-paid / Prepared</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Commute Travel Reward:</span>
                <span className="font-bold text-teal-800">₹{createdRequest.rewardFee}</span>
              </div>
              <div className="flex justify-between border-t border-teal-200 pt-2 font-bold text-slate-900 text-base">
                <span>Handover Verification Code:</span>
                <span className="font-mono text-raahi-teal font-black text-lg">{createdRequest.otp}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <PrimaryButton 
                onClick={() => onNavigate(`tracking-${createdRequest._id || createdRequest.id}`)} 
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-medium">
                {errorMessage}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                    1. Package Description
                  </h3>

                  <FormField
                    label="Package Name / Description"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Econometrics Spiral Notes &amp; Lab Assignment"
                    required
                  />

                  <FormField
                    label="Approximate Size &amp; Weight"
                    name="packageSize"
                    type="select"
                    value={packageSize}
                    onChange={(e) => setPackageSize(e.target.value)}
                    options={[
                      "Small / Document Envelope (< 500g)",
                      "Medium / Backpack Friendly (1 - 2 kg)",
                      "Laundry Bag / Clothes (2 - 3 kg)",
                      "Bulky / Requires Two Hands"
                    ]}
                  />
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                    2. Collection Point &amp; Delivery Spot
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LocationAutocomplete
                      label="Collection Point (Full Address)"
                      value={pickupLocationObj}
                      onChange={setPickupLocationObj}
                      required
                      placeholder="Search shop, xerox, chemist, hostel..."
                      icon={MapPin}
                    />

                    <FormField
                      label="Pickup Token / Order Code / Name"
                      name="pickupCode"
                      value={pickupCode}
                      onChange={(e) => setPickupCode(e.target.value)}
                      placeholder="e.g. Order #144 / Under name 'Rohan'"
                      icon={Tag}
                      required
                    />
                  </div>

                  <LocationAutocomplete
                    label="Drop-off Destination"
                    value={destinationLocationObj}
                    onChange={setDestinationLocationObj}
                    required
                    placeholder="Search hostel, faculty, gate, metro station..."
                    icon={MapPin}
                  />
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                    3. Delivery Window &amp; Handling
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Needed By"
                      name="timeWindow"
                      type="select"
                      value={timeWindow}
                      onChange={(e) => setTimeWindow(e.target.value)}
                      icon={Clock}
                      options={[
                        "Urgent (Within 30 mins)",
                        "Within 45 mins",
                        "Within 2 hours",
                        "Before evening class (by 4 PM)"
                      ]}
                    />

                    <FormField
                      label="Special Handling Instructions"
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Handle with care, keep upright..."
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
                <div className="bg-white rounded-3xl p-6 border border-raahi-border shadow-soft space-y-5">
                  <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
                    Commute Travel Reward
                  </h3>

                  <FormField
                    label="Reward for Travelling Student (₹)"
                    name="rewardFee"
                    type="number"
                    value={rewardFee}
                    onChange={(e) => setRewardFee(e.target.value)}
                    icon={IndianRupee}
                    required
                    helperText="Suggested: ₹40 - ₹80 to help cover travel fares"
                  />

                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Item Status:</span>
                      <strong className="text-emerald-700">Pre-paid (₹0 due at shop)</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Commute Reward:</span>
                      <strong className="text-teal-900">₹{rewardFee || 0}</strong>
                    </div>
                    <div className="flex justify-between border-t border-emerald-300 pt-2 font-bold text-base text-slate-900">
                      <span>Total Paid by You:</span>
                      <span className="text-emerald-800">₹{rewardFee || 0}</span>
                    </div>
                  </div>

                  <PrimaryButton 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    loading={isSubmitting}
                  >
                    Broadcast Pickup Errand
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
