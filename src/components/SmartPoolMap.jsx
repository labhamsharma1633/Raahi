import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  Compass,
  Maximize2,
  Sparkles,
  Route as RouteIcon,
} from 'lucide-react';

/**
 * SmartPoolMap
 * Interactive multi-stop route visualization using Leaflet and OpenStreetMap.
 * Renders Origin -> Pickups -> Dropoffs -> Destination with sequenced markers,
 * progressive polyline paths, and status-aware popups.
 */
export default function SmartPoolMap({
  stops = [],
  activeStopIndex = 0,
  metrics = null,
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let timerId = null;

    const initMap = () => {
      if (typeof window === 'undefined' || !window.L || !mapContainerRef.current) {
        timerId = setTimeout(initMap, 200);
        return;
      }

      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Filter valid coordinates
        const validStops = (stops || []).filter(
          (s) => s.coordinates && typeof s.coordinates.latitude === 'number' && typeof s.coordinates.longitude === 'number'
        );

        const defaultCenter =
          validStops.length > 0
            ? [validStops[0].coordinates.latitude, validStops[0].coordinates.longitude]
            : [30.7333, 76.7794]; // Default Chandigarh

        const map = window.L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 13,
          zoomControl: false,
          attributionControl: true,
        });

        window.L.control.zoom({ position: 'bottomright' }).addTo(map);

        window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        }).addTo(map);

        const createMarkerIcon = (label, bgHex, borderHex, isCurrent = false, isCompleted = false) => {
          return window.L.divIcon({
            className: 'smartpool-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                ${
                  isCurrent
                    ? `<div style="position: absolute; width: 42px; height: 42px; border-radius: 9999px; background-color: ${bgHex}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                    : ''
                }
                <div style="
                  width: 32px; 
                  height: 32px; 
                  border-radius: 12px; 
                  background-color: ${isCompleted ? '#64748B' : bgHex}; 
                  border: 2px solid ${borderHex}; 
                  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  color: white; 
                  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                  font-weight: 800; 
                  font-size: 11px;
                  cursor: pointer;
                  transition: transform 0.2s ease;
                ">
                  ${isCompleted ? '✓' : label}
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18],
          });
        };

        const boundsCoords = [];
        const polylineCoords = [];

        validStops.forEach((stop, index) => {
          const lat = stop.coordinates.latitude;
          const lng = stop.coordinates.longitude;
          boundsCoords.push([lat, lng]);
          polylineCoords.push([lat, lng]);

          const isOrigin = stop.stopType === 'ORIGIN';
          const isDest = stop.stopType === 'DESTINATION';
          const isPickup = stop.stopType === 'PICKUP';
          const isDelivery = stop.stopType === 'DELIVERY';

          const isCurrent = index === activeStopIndex;
          const isCompleted = stop.status === 'COMPLETED' || index < activeStopIndex;

          let badgeLabel = `${index}`;
          let bgHex = '#0D3B3E';
          let borderHex = '#14B8A6';

          if (isOrigin) {
            badgeLabel = 'O';
            bgHex = '#065F46'; // Forest Green
            borderHex = '#34D399';
          } else if (isDest) {
            badgeLabel = 'D';
            bgHex = '#1E1B4B'; // Midnight Indigo
            borderHex = '#818CF8';
          } else if (isPickup) {
            badgeLabel = `P${stop.sequenceOrder || index}`;
            bgHex = '#D97706'; // Amber
            borderHex = '#FBBF24';
          } else if (isDelivery) {
            badgeLabel = `D${stop.sequenceOrder || index}`;
            bgHex = '#0D9488'; // Teal
            borderHex = '#2DD4BF';
          }

          const marker = window.L.marker([lat, lng], {
            icon: createMarkerIcon(badgeLabel, bgHex, borderHex, isCurrent, isCompleted),
          }).addTo(map);

          // Rich popup
          marker.bindPopup(`
            <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; min-width: 190px; padding: 4px 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${bgHex}; background: rgba(0,0,0,0.04); padding: 2px 6px; border-radius: 6px;">
                  Stop #${index}: ${stop.stopType}
                </span>
                ${
                  stop.rewardFee
                    ? `<span style="font-size: 11px; font-weight: 800; color: #047857; background: #D1FAE5; padding: 2px 6px; border-radius: 6px;">₹${stop.rewardFee}</span>`
                    : ''
                }
              </div>
              <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.3;">
                ${stop.locationName || 'Stop Point'}
              </h4>
              <p style="margin: 0 0 6px; font-size: 11px; color: #64748B; line-height: 1.3;">
                ${stop.address || ''}
              </p>
              ${
                stop.itemSummary
                  ? `<div style="font-size: 11px; font-weight: 600; color: #334155; background: #F8FAFC; padding: 4px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
                      ${stop.itemSummary}
                    </div>`
                  : ''
              }
              <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: ${isCompleted ? '#059669' : isCurrent ? '#D97706' : '#94A3B8'};">
                ${isCompleted ? '✓ Completed' : isCurrent ? '● Active Target Stop' : 'Upcoming'}
              </div>
            </div>
          `);

          if (isCurrent) {
            marker.openPopup();
          }
        });

        // Draw multi-stop sequence polyline
        if (polylineCoords.length >= 2) {
          // Shadow / Outline polyline
          window.L.polyline(polylineCoords, {
            color: '#08282A',
            weight: 6,
            opacity: 0.25,
            smoothFactor: 1.2,
          }).addTo(map);

          // Active route polyline
          window.L.polyline(polylineCoords, {
            color: '#0D3B3E',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 6',
            smoothFactor: 1.2,
          }).addTo(map);
        }

        // Fit bounds
        if (boundsCoords.length > 0) {
          const bounds = window.L.latLngBounds(boundsCoords);
          map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 15,
          });
        }

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.warn('SmartPoolMap initialization error:', err);
      }
    };

    initMap();

    return () => {
      if (timerId) clearTimeout(timerId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops, activeStopIndex]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
  };

  const currentStop = stops[activeStopIndex] || null;

  return (
    <div
      className={`relative bg-slate-900 rounded-3xl overflow-hidden shadow-soft border border-slate-200 transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : className
      }`}
      style={{ minHeight: isFullscreen ? 'auto' : '360px', height: isFullscreen ? 'auto' : '400px' }}
    >
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Floating Badge Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-[400] pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#08282A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-white border border-teal-500/30 shadow-lg flex items-center gap-2">
            <RouteIcon className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold">
              {stops.length} Sequenced Stops
            </span>
          </div>

          {metrics && (
            <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-slate-800 border border-slate-200/80 shadow-md text-xs font-semibold">
              <span className="text-emerald-700 font-bold">
                +{(metrics.detourDistanceMeters / 1000).toFixed(1)} km detour
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700 font-bold">
                +{metrics.detourTimeMinutes} mins
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="pointer-events-auto p-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition-all hover:scale-105"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Active Stop Pill */}
      {currentStop && (
        <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between gap-3 max-w-xl mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-xs shrink-0">
                #{activeStopIndex}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block">
                  Target Stop: {currentStop.stopType}
                </span>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentStop.locationName}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              {currentStop.rewardFee > 0 && (
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  +₹{currentStop.rewardFee}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
