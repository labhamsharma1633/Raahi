import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { MapPin, Search, Loader2, X, Check, Navigation, AlertCircle, Clock } from 'lucide-react';
import { searchIndiaLocations, formatLocationObject } from '../services/locationService';

// ─── Recent Selections Helpers ───────────────────────────────────────────────
const RECENTS_KEY = 'raahi_recent_locs';
const MAX_RECENTS = 5;

function getRecents() {
  try {
    return JSON.parse(sessionStorage.getItem(RECENTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecent(loc) {
  try {
    const existing = getRecents().filter(r => r.placeId !== loc.placeId && r.name !== loc.name);
    const updated = [loc, ...existing].slice(0, MAX_RECENTS);
    sessionStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
  } catch {}
}

function removeRecent(placeId, name) {
  try {
    const updated = getRecents().filter(r => r.placeId !== placeId && r.name !== name);
    sessionStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
  } catch {}
}

// ─── Provider badge helper ────────────────────────────────────────────────────
function getProviderBadge(suggestions) {
  if (!suggestions.length) return null;
  // Check first few results to determine source
  const firstId = suggestions[0]?.placeId || '';
  if (firstId.startsWith('photon_') || firstId.startsWith('osm_')) {
    return { emoji: '🌐', label: 'Powered by OpenStreetMap' };
  }
  if (firstId.startsWith('custom_') || firstId.startsWith('loc_')) {
    return { emoji: '📍', label: 'Offline Index' };
  }
  // Mixed: check if any photon/osm present
  const hasOnline = suggestions.some(s => {
    const id = s.placeId || '';
    return id.startsWith('photon_') || id.startsWith('osm_');
  });
  return hasOnline
    ? { emoji: '🌐', label: 'Powered by OpenStreetMap' }
    : { emoji: '📍', label: 'Offline Index' };
}

// ─── State grouping helper ────────────────────────────────────────────────────
function isOfflineResult(loc) {
  const id = loc.placeId || '';
  return id.startsWith('custom_') || id.startsWith('loc_');
}

function groupByState(suggestions) {
  // Returns array of { type: 'header', state } | { type: 'item', loc, originalIdx }
  const groups = [];
  let seenStates = [];
  suggestions.forEach((loc, idx) => {
    if (isOfflineResult(loc) && loc.state) {
      if (!seenStates.includes(loc.state)) {
        seenStates.push(loc.state);
        groups.push({ type: 'header', state: loc.state });
      }
    }
    groups.push({ type: 'item', loc, originalIdx: idx });
  });
  return groups;
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="px-4 py-2.5 flex items-start gap-3 animate-pulse">
      <div className="w-7 h-7 rounded-lg bg-slate-100 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-2.5 bg-slate-100 rounded w-3/5" />
        <div className="h-2 bg-slate-100 rounded w-4/5" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LocationAutocomplete({
  label,
  value,          // String or Location Object
  onChange,       // Returns standardized Location Object
  placeholder = "Search area, market, campus, metro station across India...",
  required = false,
  helperText,
  error,
  icon: CustomIcon,
  className = ""
}) {
  const uid = useId();
  const listboxId = `loc-listbox-${uid}`;

  const [inputValue, setInputValue] = useState(() => {
    if (typeof value === 'object' && value !== null) {
      return value.name || value.formattedAddress || '';
    }
    return value || '';
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (typeof value === 'object' && value !== null) return value;
    return null;
  });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recents, setRecents] = useState([]);
  const [showRecents, setShowRecents] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    if (typeof value === 'object' && value !== null) {
      setInputValue(value.name || value.formattedAddress || '');
      setSelectedLocation(value);
    } else if (typeof value === 'string' && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowRecents(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-idx="${activeIndex}"]`);
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // ── Debounced search ────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    setSelectedLocation(null);
    setActiveIndex(-1);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    if (!text.trim() || text.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    setShowRecents(false);

    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();
      try {
        const results = await searchIndiaLocations(text, abortControllerRef.current.signal);
        setSuggestions(results);
        setIsLoading(false);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setIsLoading(false);
        }
      }
    }, 300);
  };

  // ── Select a suggestion ─────────────────────────────────────────────────────
  const handleSelectSuggestion = (loc) => {
    setInputValue(loc.name);
    setSelectedLocation(loc);
    setIsOpen(false);
    setShowRecents(false);
    setSuggestions([]);
    setActiveIndex(-1);
    saveRecent(loc);
    if (onChange) onChange(loc);
  };

  // ── Clear ───────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setInputValue('');
    setSelectedLocation(null);
    setSuggestions([]);
    setIsOpen(false);
    setShowRecents(false);
    setActiveIndex(-1);
    if (onChange) onChange(formatLocationObject({ name: '', formattedAddress: '' }));
  };

  // ── Focus: show recents if input empty ─────────────────────────────────────
  const handleFocus = () => {
    if (!inputValue.trim()) {
      const r = getRecents();
      setRecents(r);
      if (r.length > 0) {
        setShowRecents(true);
        setIsOpen(true);
      } else if (suggestions.length > 0) {
        setIsOpen(true);
      }
    } else if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // ── Manual blur ─────────────────────────────────────────────────────────────
  const handleManualBlur = () => {
    if (inputValue.trim() && (!selectedLocation || selectedLocation.name !== inputValue)) {
      const customLoc = formatLocationObject({
        name: inputValue.trim(),
        formattedAddress: `${inputValue.trim()}, India`,
        city: "",
        state: ""
      });
      setSelectedLocation(customLoc);
      if (onChange) onChange(customLoc);
    }
  };

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    // Determine navigable items count
    const itemsCount = showRecents ? recents.length : suggestions.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % (itemsCount || 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev <= 0 ? itemsCount - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          const list = showRecents ? recents : suggestions;
          if (list[activeIndex]) handleSelectSuggestion(list[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setShowRecents(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // ── Remove a recent entry ───────────────────────────────────────────────────
  const handleRemoveRecent = (e, loc) => {
    e.stopPropagation();
    removeRecent(loc.placeId, loc.name);
    const updated = getRecents();
    setRecents(updated);
    if (updated.length === 0) {
      setShowRecents(false);
      setIsOpen(false);
    }
  };

  // ── Derived display values ──────────────────────────────────────────────────
  const hasCoords = selectedLocation && selectedLocation.latitude != null && selectedLocation.longitude != null;
  const providerBadge = isOpen && !showRecents && suggestions.length > 0 && !isLoading
    ? getProviderBadge(suggestions)
    : null;
  const shouldGroup = isOpen && !showRecents && suggestions.length > 0
    && suggestions.every(s => isOfflineResult(s));
  const groupedItems = shouldGroup ? groupByState(suggestions) : null;

  const activeDescendant = activeIndex >= 0 ? `${listboxId}-item-${activeIndex}` : undefined;

  const IconToRender = CustomIcon || MapPin;

  return (
    <div ref={wrapperRef} className={`relative space-y-1.5 ${className}`}>
      {/* ── Label row with city chip and coordinate chip ── */}
      {label && (
        <div className="flex items-center justify-between flex-wrap gap-1">
          <label className="block text-xs font-bold text-slate-700 tracking-tight">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>

          <div className="flex items-center gap-1.5">
            {selectedLocation?.city && (
              <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md font-semibold border border-teal-200">
                {selectedLocation.city}{selectedLocation.state ? `, ${selectedLocation.state}` : ''}
              </span>
            )}

            {/* Coordinate confirmation chip */}
            {selectedLocation && selectedLocation.name && (
              hasCoords ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-full font-semibold">
                  <Check className="w-2.5 h-2.5" /> Coordinates
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">
                  <MapPin className="w-2.5 h-2.5" /> Address only
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Input wrapper ── */}
      <div className="relative rounded-2xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-raahi-teal animate-spin" />
          ) : (
            <IconToRender className="w-4 h-4 text-teal-600" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleManualBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl sm:rounded-2xl border bg-white text-slate-900 text-sm placeholder:text-slate-400 py-3 pl-10 pr-9 ${
            error
              ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-200 focus:ring-2 focus:ring-teal-200 focus:border-raahi-teal'
          } outline-none transition-all`}
        />

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Provider badge (below input, above dropdown) ── */}
      {providerBadge && (
        <div className="flex items-center gap-1 pl-1">
          <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <span>{providerBadge.emoji}</span>
            <span>{providerBadge.label}</span>
          </span>
        </div>
      )}

      {/* ── Dropdown ── */}
      {isOpen && (
        <div
          id={listboxId}
          ref={listRef}
          role="listbox"
          aria-label={label || 'Location suggestions'}
          className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 z-50 max-h-72 overflow-y-auto divide-y divide-slate-100 animate-fade-in"
        >
          {/* Loading skeletons */}
          {isLoading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {/* Recent selections panel */}
          {!isLoading && showRecents && recents.length > 0 && (
            <>
              <div className="px-4 py-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Recent
                </span>
                <button
                  type="button"
                  onClick={() => {
                    try { sessionStorage.removeItem(RECENTS_KEY); } catch {}
                    setRecents([]);
                    setShowRecents(false);
                    setIsOpen(false);
                  }}
                  className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              {recents.map((loc, idx) => (
                <button
                  key={loc.placeId || idx}
                  id={`${listboxId}-item-${idx}`}
                  role="option"
                  aria-selected={activeIndex === idx}
                  data-idx={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(loc)}
                  className={`w-full text-left px-4 py-2.5 transition-colors flex items-start gap-3 group ${
                    activeIndex === idx ? 'bg-teal-50' : 'hover:bg-teal-50/80'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    activeIndex === idx ? 'bg-teal-100 text-teal-700' : 'bg-slate-50 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-700'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold text-xs sm:text-sm truncate block ${
                      activeIndex === idx ? 'text-teal-700' : 'text-slate-900 group-hover:text-raahi-teal'
                    }`}>
                      {loc.name}
                    </span>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-snug">
                      {loc.formattedAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveRecent(e, loc)}
                    className="ml-auto text-slate-300 hover:text-rose-400 transition-colors shrink-0 self-center"
                    aria-label="Remove from recents"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))}
            </>
          )}

          {/* Regular search results */}
          {!isLoading && !showRecents && suggestions.length > 0 && (
            shouldGroup
              ? groupedItems.map((entry, renderIdx) => {
                  if (entry.type === 'header') {
                    return (
                      <div
                        key={`header-${entry.state}`}
                        className="px-4 py-1 flex items-center gap-2"
                      >
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase whitespace-nowrap">
                          {entry.state}
                        </span>
                        <div className="flex-1 h-px bg-slate-100" />
                      </div>
                    );
                  }
                  const { loc, originalIdx } = entry;
                  return (
                    <SuggestionRow
                      key={loc.placeId || originalIdx}
                      loc={loc}
                      idx={originalIdx}
                      listboxId={listboxId}
                      activeIndex={activeIndex}
                      onSelect={handleSelectSuggestion}
                    />
                  );
                })
              : suggestions.map((loc, idx) => (
                  <SuggestionRow
                    key={loc.placeId || idx}
                    loc={loc}
                    idx={idx}
                    listboxId={listboxId}
                    activeIndex={activeIndex}
                    onSelect={handleSelectSuggestion}
                  />
                ))
          )}

          {/* No results */}
          {!isLoading && !showRecents && suggestions.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              <p>No exact match found in India search.</p>
              <button
                type="button"
                onClick={() => handleSelectSuggestion(formatLocationObject({ name: inputValue, formattedAddress: `${inputValue}, India` }))}
                className="mt-1.5 font-bold text-raahi-teal hover:underline text-xs"
              >
                Use "{inputValue}" as custom location
              </button>
            </div>
          )}
        </div>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] text-rose-500 font-semibold">{error}</p>
      )}
    </div>
  );
}

// ─── Extracted suggestion row ─────────────────────────────────────────────────
function SuggestionRow({ loc, idx, listboxId, activeIndex, onSelect }) {
  const isActive = activeIndex === idx;
  return (
    <button
      id={`${listboxId}-item-${idx}`}
      role="option"
      aria-selected={isActive}
      data-idx={idx}
      type="button"
      onClick={() => onSelect(loc)}
      className={`w-full text-left px-4 py-2.5 transition-colors flex items-start gap-3 group ${
        isActive ? 'bg-teal-50' : 'hover:bg-teal-50/80'
      }`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isActive ? 'bg-teal-100 text-teal-700' : 'bg-teal-50 text-teal-700 group-hover:bg-teal-100'
      }`}>
        <MapPin className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold text-xs sm:text-sm truncate ${
            isActive ? 'text-teal-700' : 'text-slate-900 group-hover:text-raahi-teal'
          }`}>
            {loc.name}
          </span>
          {loc.city && (
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium shrink-0">
              {loc.city}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-snug">
          {loc.formattedAddress}
        </p>
      </div>
    </button>
  );
}
