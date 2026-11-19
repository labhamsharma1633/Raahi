import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Route as RouteIcon, Info, Compass, Maximize2 } from 'lucide-react';
import { calculateEstimatedRoadDistanceKm } from '../services/locationService';

/**
 * OrderTrackingMap
 * An interactive map component using Leaflet and OpenStreetMap tiles (free, zero API keys).
 * Plots pickup and drop-off markers, draws the connecting delivery route, and auto-fits bounds.
 */
export default function OrderTrackingMap({
  pickup,
  destination,
  travellerLocation = null,
  status = 'OPEN',
  className = ""
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Extract names and coordinates
  const pickupName = typeof pickup === 'object' ? (pickup?.name || pickup?.formattedAddress || 'Pickup Spot') : (pickup || 'Pickup Spot');
  const pickupAddress = typeof pickup === 'object' ? (pickup?.formattedAddress || pickup?.name || '') : '';
  const pickupLat = typeof pickup === 'object' && pickup?.latitude ? Number(pickup.latitude) : null;
  const pickupLng = typeof pickup === 'object' && pickup?.longitude ? Number(pickup.longitude) : null;

  const destName = typeof destination === 'object' ? (destination?.name || destination?.formattedAddress || 'Delivery Destination') : (destination || 'Delivery Destination');
  const destAddress = typeof destination === 'object' ? (destination?.formattedAddress || destination?.name || '') : '';
  const destLat = typeof destination === 'object' && destination?.latitude ? Number(destination.latitude) : null;
  const destLng = typeof destination === 'object' && destination?.longitude ? Number(destination.longitude) : null;

  // Calculate road distance if coordinates exist
  const estimatedKm = (pickupLat && pickupLng && destLat && destLng)
    ? calculateEstimatedRoadDistanceKm(pickupLat, pickupLng, destLat, destLng)
    : null;

  useEffect(() => {
    // Check if Leaflet window.L is available
    let isMounted = true;
    let timerId = null;

    const checkAndInitMap = () => {
      if (typeof window !== 'undefined' && window.L && mapContainerRef.current) {
        try {
          // If map already initialized, clear it first
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          }

          // Determine initial center
          const hasPickup = pickupLat !== null && pickupLng !== null;
          const hasDest = destLat !== null && destLng !== null;

          const defaultCenter = hasPickup 
            ? [pickupLat, pickupLng] 
            : hasDest 
              ? [destLat, destLng] 
              : [28.6139, 77.2090]; // Default New Delhi

          const map = window.L.map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 13,
            zoomControl: false,
            attributionControl: true
          });

          // Add clean zoom control at bottom-right
          window.L.control.zoom({ position: 'bottomright' }).addTo(map);

          // Add OpenStreetMap standard tiles
          window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          }).addTo(map);

          // Define custom HTML markers
          const createCustomPin = (letter, colorBg, borderColor, pulse = false) => {
            return window.L.divIcon({
              className: 'custom-leaflet-marker',
              html: `
                <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                  ${pulse ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background-color: ${colorBg}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
                  <div style="
                    width: 32px; 
                    height: 32px; 
                    border-radius: 12px; 
                    background-color: ${colorBg}; 
                    border: 2px solid ${borderColor}; 
                    color: white; 
                    font-weight: 800; 
                    font-size: 13px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                  ">
                    ${letter}
                  </div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -18]
            });
          };

          const pickupIcon = createCustomPin('P', '#0D9488', '#2DD4BF'); // Teal
          const destIcon = createCustomPin('D', '#4338CA', '#818CF8'); // Indigo
          const travellerIcon = createCustomPin('T', '#D97706', '#FCD34D', true); // Amber traveller

          const boundsPoints = [];

          // Add Pickup Marker
          if (hasPickup) {
            const pMarker = window.L.marker([pickupLat, pickupLng], { icon: pickupIcon }).addTo(map);
            pMarker.bindPopup(`
              <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #0f172a; padding: 2px;">
                <b style="color: #0D9488;">● Community Pickup Point</b><br/>
                <strong>${pickupName}</strong>
                ${pickupAddress ? `<div style="color: #64748b; font-size: 11px; margin-top: 2px;">${pickupAddress}</div>` : ''}
              </div>
            `);
            boundsPoints.push([pickupLat, pickupLng]);
          }

          // Add Destination Marker
          if (hasDest) {
            const dMarker = window.L.marker([destLat, destLng], { icon: destIcon }).addTo(map);
            dMarker.bindPopup(`
              <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #0f172a; padding: 2px;">
                <b style="color: #4338CA;">● Delivery Destination</b><br/>
                <strong>${destName}</strong>
                ${destAddress ? `<div style="color: #64748b; font-size: 11px; margin-top: 2px;">${destAddress}</div>` : ''}
              </div>
            `);
            boundsPoints.push([destLat, destLng]);
          }

          // Add active Traveller marker if assigned and coords available
          if (travellerLocation && travellerLocation.latitude && travellerLocation.longitude) {
            const tMarker = window.L.marker(
              [Number(travellerLocation.latitude), Number(travellerLocation.longitude)], 
              { icon: travellerIcon }
            ).addTo(map);
            tMarker.bindPopup(`
              <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #0f172a;">
                <b style="color: #D97706;">● Verified Traveller</b><br/>
                <span>En route to destination</span>
              </div>
            `);
            boundsPoints.push([Number(travellerLocation.latitude), Number(travellerLocation.longitude)]);
          }

          // Draw route Polyline between pickup and destination
          if (hasPickup && hasDest) {
            const routeLine = window.L.polyline([[pickupLat, pickupLng], [destLat, destLng]], {
              color: '#0D9488',
              weight: 5,
              opacity: 0.85,
              dashArray: '8, 8',
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);

            // Fit bounds with comfortable padding
            map.fitBounds(boundsPoints, { padding: [45, 45], maxZoom: 16 });
          } else if (boundsPoints.length > 0) {
            map.setView(boundsPoints[0], 14);
          }

          mapInstanceRef.current = map;
          if (isMounted) {
            setMapLoaded(true);
            setMapError(false);
          }
        } catch (err) {
          console.warn('Leaflet map initialization warning:', err);
          if (isMounted) setMapError(true);
        }
      } else {
        // Retry shortly if window.L script is still downloading
        timerId = setTimeout(checkAndInitMap, 250);
      }
    };

    checkAndInitMap();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickupLat, pickupLng, destLat, destLng, travellerLocation]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-teal-500/20 shadow-soft bg-slate-900 ${className}`}>
      {/* Top Banner overlay info */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
        <div className="bg-[#08282A]/90 backdrop-blur-md border border-teal-500/30 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg pointer-events-auto">
          <RouteIcon className="w-3.5 h-3.5 text-teal-400" />
          <span>Live Route Geometry</span>
        </div>

        {estimatedKm !== null && (
          <div className="bg-teal-900/90 backdrop-blur-md border border-teal-400/40 text-teal-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg pointer-events-auto">
            ~{estimatedKm} km estimated road distance
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[320px] sm:h-[380px] bg-slate-900 z-10"
        style={{ minHeight: '300px' }}
      />

      {/* Fallback & Loading Overlay if Leaflet hasn't initialized or offline */}
      {(!mapLoaded || mapError) && (
        <div className="absolute inset-0 bg-[#08282A] text-white flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mb-3 animate-pulse">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Loading Interactive Route Map...</h4>
          <p className="text-xs text-teal-200/80 max-w-sm mb-4">
            Connecting OpenStreetMap waypoints between {pickupName} and {destName}.
          </p>

          {/* Clean schematic fallback diagram */}
          <div className="flex items-center gap-3 bg-[#0B3538] px-4 py-3 rounded-2xl border border-teal-500/30 max-w-md w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center">P</span>
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">{pickupName}</span>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-teal-400/50 mx-2" />
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white font-black text-xs flex items-center justify-center">D</span>
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">{destName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Route Legend Bar */}
      <div className="bg-[#051C1E] border-t border-teal-500/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-500 border border-teal-300" />
            <span className="text-teal-200/90 font-medium">Pickup: <strong className="text-white">{pickupName}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-300" />
            <span className="text-teal-200/90 font-medium">Destination: <strong className="text-white">{destName}</strong></span>
          </div>
          {travellerLocation && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300 animate-pulse" />
              <span className="text-amber-200 font-medium">Traveller En Route</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-teal-400/70">
          OpenStreetMap • Zero API Key
        </div>
      </div>
    </div>
  );
}
