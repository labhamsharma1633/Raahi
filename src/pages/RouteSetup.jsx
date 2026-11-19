import React, { useState } from 'react';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { 
  ArrowLeft, 
  MapPin, 
  Compass, 
  Clock, 
  Footprints, 
  Bike, 
  Car, 
  Briefcase, 
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { useRaahi } from '../context/RaahiContext';

export default function RouteSetup({
  onBack,
  onNavigate
}) {
  const { activeRoute, publishRoute } = useRaahi();
  const [originLocationObj, setOriginLocationObj] = useState(activeRoute?.originLocationObj || null);
  const [destinationLocationObj, setDestinationLocationObj] = useState(activeRoute?.destinationLocationObj || null);
  const [departureTime, setDepartureTime] = useState(activeRoute?.departureTime || 'In 15 mins (1:45 PM)');
  const [travelMode, setTravelMode] = useState(activeRoute?.travelMode || 'Walking');
  const [maxDetour, setMaxDetour] = useState(activeRoute?.maxDetourMeters ? String(activeRoute.maxDetourMeters) : '600');
  const [capacity, setCapacity] = useState(activeRoute?.availableCapacity || 'Backpack (up to 3 kg)');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      publishRoute({
        id: activeRoute?.id || `ROUTE-${Math.floor(10 + Math.random() * 90)}`,
        origin: originLocationObj?.name || originLocationObj?.formattedAddress || '',
        originLocationObj: originLocationObj,
        destination: destinationLocationObj?.name || destinationLocationObj?.formattedAddress || '',
        destinationLocationObj: destinationLocationObj,
        distanceKm: (originLocationObj?.latitude && destinationLocationObj?.latitude) ? null : 1.4,
        departureTime,
        travelMode,
        maxDetourMeters: Number(maxDetour),
        maxDetourMinutes: Math.round(Number(maxDetour) / 50),
        availableCapacity: capacity
      });

      if (onNavigate) {
        onNavigate('traveller-matching');
      }
    }, 500);
  };

  const travelModes = [
    { label: "Walking", icon: Footprints },
    { label: "Bicycle", icon: Bike },
    { label: "E-Rickshaw", icon: Car }
  ];

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
                Traveller Commute Configuration
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Publish or Edit Your Commute Route
              </h2>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-teal-200 bg-[#08282A] px-3 py-1.5 rounded-full border border-teal-500/30">
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>Zero-Detour Optimization</span>
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              1. Commute Segment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LocationAutocomplete
                label="Starting Location (Origin)"
                value={originLocationObj}
                onChange={setOriginLocationObj}
                required
                placeholder="Where does your commute begin? Search city, campus, metro..."
                helperText="Where your walk or trip begins"
              />

              <LocationAutocomplete
                label="Destination"
                value={destinationLocationObj}
                onChange={setDestinationLocationObj}
                required
                placeholder="Where are you heading? Search hostel, faculty, station..."
                helperText="Where you are heading"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              2. Timing &amp; Transport Mode
            </h3>

            <FormField
              label="Departure Time Window"
              name="departureTime"
              type="select"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              icon={Clock}
              options={[
                "Right now / In 5 mins",
                "In 15 mins (1:45 PM)",
                "In 30 mins (2:00 PM)",
                "In 1 hour (2:30 PM)",
                "This evening (after 5:00 PM)"
              ]}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Travel Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {travelModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = travelMode === mode.label;
                  return (
                    <button
                      key={mode.label}
                      type="button"
                      onClick={() => setTravelMode(mode.label)}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-teal-50 border-raahi-teal text-raahi-teal font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs sm:text-sm">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-raahi-border shadow-soft space-y-5">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              3. Maximum Detour &amp; Carrying Space
            </h3>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700">
                  Maximum Detour Tolerance
                </label>
                <span className="text-xs font-bold text-raahi-teal bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                  +{maxDetour} meters (~{Math.round(Number(maxDetour) / 50)} mins extra)
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={maxDetour}
                onChange={(e) => setMaxDetour(e.target.value)}
                className="w-full accent-raahi-teal cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>100m (Minimal)</span>
                <span>1000m (Standard)</span>
                <span>2000m (High flex)</span>
              </div>
            </div>

            <FormField
              label="Available Carrying Space"
              name="capacity"
              type="select"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              icon={Briefcase}
              options={[
                "Pocket / Hands only (Small items, medicines)",
                "Backpack (up to 3 kg - books, snacks, notes)",
                "Tote / Canvas Bag (Medium items)",
                "Spacious (Parcels, laundry, multiple packets)"
              ]}
            />
          </div>

          <div className="pt-2">
            <PrimaryButton type="submit" variant="primary" size="lg" loading={saving}>
              Publish Route &amp; Explore Matching Errands
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
