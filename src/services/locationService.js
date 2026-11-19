// India-Wide Location Search & Geocoding Service for Raahi
// Supports OpenStreetMap Photon (komoot.io), Nominatim OSM, and a curated multi-state offline index.

// ---------------------------------------------------------------------------
// Environment key stubs (unused until API is wired; kept for future upgrade)
// ---------------------------------------------------------------------------
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || null; // eslint-disable-line no-unused-vars
const MAPBOX_TOKEN   = import.meta.env.VITE_MAPBOX_TOKEN         || null; // eslint-disable-line no-unused-vars

// ---------------------------------------------------------------------------
// Search cache — avoids duplicate network requests within a session
// ---------------------------------------------------------------------------
const searchCache = new Map();

// ---------------------------------------------------------------------------
// formatLocationObject — canonical location normaliser
// ---------------------------------------------------------------------------
/**
 * Normalises any raw location data into Raahi's standard location shape.
 *
 * @param {object} fields
 * @returns {{ name, formattedAddress, city, state, country, postalCode, latitude, longitude, placeId }}
 */
export function formatLocationObject({
  name            = "",
  formattedAddress = "",
  city            = "",
  state           = "",
  country         = "India",
  postalCode      = "",
  latitude        = null,
  longitude       = null,
  placeId         = ""
}) {
  return {
    name:             name || formattedAddress.split(",")[0] || "Unknown Location",
    formattedAddress: formattedAddress || name,
    city:             city  || "",
    state:            state || "",
    country:          country || "India",
    postalCode:       postalCode || "",
    latitude:         latitude  !== null ? Number(latitude)  : null,
    longitude:        longitude !== null ? Number(longitude) : null,
    placeId:          placeId  || `loc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  };
}

// ---------------------------------------------------------------------------
// INDIA_SAMPLE_LOCATIONS — curated multi-state offline index
// 10 states × 3-5 entries = 43 locations total
// ---------------------------------------------------------------------------
export const INDIA_SAMPLE_LOCATIONS = [

  // ── Punjab ────────────────────────────────────────────────────────────────
  {
    name:             "Lovely Professional University",
    formattedAddress: "Jalandhar - Delhi G.T. Road, Phagwara, Punjab 144411, India",
    city:             "Phagwara",
    state:            "Punjab",
    country:          "India",
    postalCode:       "144411",
    latitude:         31.2536,
    longitude:        75.7037,
    placeId:          "in_pb_lpu"
  },
  {
    name:             "Sector 17 Plaza",
    formattedAddress: "Sector 17, Chandigarh, 160017, India",
    city:             "Chandigarh",
    state:            "Punjab",
    country:          "India",
    postalCode:       "160017",
    latitude:         30.7408,
    longitude:        76.7827,
    placeId:          "in_ch_sec17"
  },
  {
    name:             "Golden Temple (Harmandir Sahib)",
    formattedAddress: "Golden Temple Road, Amritsar, Punjab 143001, India",
    city:             "Amritsar",
    state:            "Punjab",
    country:          "India",
    postalCode:       "143001",
    latitude:         31.6200,
    longitude:        74.8765,
    placeId:          "in_pb_golden_temple"
  },
  {
    name:             "Patiala Bus Stand & Chowk",
    formattedAddress: "Leela Bhawan, Patiala, Punjab 147001, India",
    city:             "Patiala",
    state:            "Punjab",
    country:          "India",
    postalCode:       "147001",
    latitude:         30.3398,
    longitude:        76.3869,
    placeId:          "in_pb_patiala"
  },

  // ── Delhi NCR ─────────────────────────────────────────────────────────────
  {
    name:             "Connaught Place",
    formattedAddress: "Connaught Place, New Delhi, Delhi 110001, India",
    city:             "New Delhi",
    state:            "Delhi",
    country:          "India",
    postalCode:       "110001",
    latitude:         28.6315,
    longitude:        77.2167,
    placeId:          "in_dl_cp"
  },
  {
    name:             "Delhi University — North Campus",
    formattedAddress: "University Enclave, New Delhi, Delhi 110007, India",
    city:             "Delhi",
    state:            "Delhi",
    country:          "India",
    postalCode:       "110007",
    latitude:         28.6918,
    longitude:        77.2132,
    placeId:          "in_dl_du_north"
  },
  {
    name:             "Cyber Hub Gurugram",
    formattedAddress: "DLF Cyber City, Sector 24, Gurugram, Haryana 122002, India",
    city:             "Gurugram",
    state:            "Delhi",
    country:          "India",
    postalCode:       "122002",
    latitude:         28.4986,
    longitude:        77.0889,
    placeId:          "in_hr_cyberhub"
  },
  {
    name:             "Noida Sector 18 Market",
    formattedAddress: "Sector 18, Noida, Uttar Pradesh 201301, India",
    city:             "Noida",
    state:            "Delhi",
    country:          "India",
    postalCode:       "201301",
    latitude:         28.5708,
    longitude:        77.3271,
    placeId:          "in_up_noida18"
  },
  {
    name:             "Lajpat Nagar Central Market",
    formattedAddress: "Lajpat Nagar, New Delhi, Delhi 110024, India",
    city:             "New Delhi",
    state:            "Delhi",
    country:          "India",
    postalCode:       "110024",
    latitude:         28.5665,
    longitude:        77.2432,
    placeId:          "in_dl_lajpat_nagar"
  },

  // ── Bihar ─────────────────────────────────────────────────────────────────
  {
    name:             "Boring Road",
    formattedAddress: "Boring Road, Patna, Bihar 800001, India",
    city:             "Patna",
    state:            "Bihar",
    country:          "India",
    postalCode:       "800001",
    latitude:         25.6139,
    longitude:        85.1189,
    placeId:          "in_br_boring_road"
  },
  {
    name:             "NIT Patna Campus",
    formattedAddress: "Ashok Rajpath, Patna, Bihar 800005, India",
    city:             "Patna",
    state:            "Bihar",
    country:          "India",
    postalCode:       "800005",
    latitude:         25.6207,
    longitude:        85.1723,
    placeId:          "in_br_nit_patna"
  },
  {
    name:             "Patna Junction Railway Station",
    formattedAddress: "Station Road, Patna Junction, Patna, Bihar 800001, India",
    city:             "Patna",
    state:            "Bihar",
    country:          "India",
    postalCode:       "800001",
    latitude:         25.5941,
    longitude:        85.1376,
    placeId:          "in_br_patna_junction"
  },
  {
    name:             "Bodh Gaya Mahabodhi Temple",
    formattedAddress: "Bodh Gaya, Gaya, Bihar 824231, India",
    city:             "Bodh Gaya",
    state:            "Bihar",
    country:          "India",
    postalCode:       "824231",
    latitude:         24.6963,
    longitude:        84.9910,
    placeId:          "in_br_bodh_gaya"
  },

  // ── Maharashtra ───────────────────────────────────────────────────────────
  {
    name:             "Marine Drive",
    formattedAddress: "Netaji Subhash Chandra Bose Road, Marine Lines, Mumbai, Maharashtra 400020, India",
    city:             "Mumbai",
    state:            "Maharashtra",
    country:          "India",
    postalCode:       "400020",
    latitude:         18.9438,
    longitude:        72.8232,
    placeId:          "in_mh_marine_drive"
  },
  {
    name:             "Bandra Kurla Complex (BKC)",
    formattedAddress: "Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051, India",
    city:             "Mumbai",
    state:            "Maharashtra",
    country:          "India",
    postalCode:       "400051",
    latitude:         19.0657,
    longitude:        72.8687,
    placeId:          "in_mh_bkc"
  },
  {
    name:             "FC Road Pune",
    formattedAddress: "Fergusson College Road, Shivajinagar, Pune, Maharashtra 411004, India",
    city:             "Pune",
    state:            "Maharashtra",
    country:          "India",
    postalCode:       "411004",
    latitude:         18.5236,
    longitude:        73.8415,
    placeId:          "in_mh_pune_fcroad"
  },
  {
    name:             "Nagpur Zero Mile Stone",
    formattedAddress: "Zero Mile, Sitabuldi, Nagpur, Maharashtra 440012, India",
    city:             "Nagpur",
    state:            "Maharashtra",
    country:          "India",
    postalCode:       "440012",
    latitude:         21.1497,
    longitude:        79.0806,
    placeId:          "in_mh_nagpur_zero_mile"
  },

  // ── Karnataka ─────────────────────────────────────────────────────────────
  {
    name:             "MG Road Bengaluru",
    formattedAddress: "Mahatma Gandhi Road, Bengaluru, Karnataka 560001, India",
    city:             "Bengaluru",
    state:            "Karnataka",
    country:          "India",
    postalCode:       "560001",
    latitude:         12.9756,
    longitude:        77.6066,
    placeId:          "in_ka_mg_road"
  },
  {
    name:             "Koramangala 5th Block",
    formattedAddress: "Koramangala, Bengaluru, Karnataka 560095, India",
    city:             "Bengaluru",
    state:            "Karnataka",
    country:          "India",
    postalCode:       "560095",
    latitude:         12.9352,
    longitude:        77.6245,
    placeId:          "in_ka_koramangala"
  },
  {
    name:             "Whitefield ITPL",
    formattedAddress: "ITPB Road, Whitefield, Bengaluru, Karnataka 560066, India",
    city:             "Bengaluru",
    state:            "Karnataka",
    country:          "India",
    postalCode:       "560066",
    latitude:         12.9863,
    longitude:        77.7308,
    placeId:          "in_ka_whitefield"
  },
  {
    name:             "Mysuru Palace",
    formattedAddress: "Sayyaji Rao Road, Agrahara, Mysuru, Karnataka 570001, India",
    city:             "Mysuru",
    state:            "Karnataka",
    country:          "India",
    postalCode:       "570001",
    latitude:         12.3052,
    longitude:        76.6552,
    placeId:          "in_ka_mysuru_palace"
  },

  // ── Telangana ─────────────────────────────────────────────────────────────
  {
    name:             "Hitech City Hyderabad",
    formattedAddress: "HITEC City, Madhapur, Hyderabad, Telangana 500081, India",
    city:             "Hyderabad",
    state:            "Telangana",
    country:          "India",
    postalCode:       "500081",
    latitude:         17.4474,
    longitude:        78.3762,
    placeId:          "in_tg_hitech_city"
  },
  {
    name:             "Gachibowli Financial District",
    formattedAddress: "Gachibowli, Hyderabad, Telangana 500032, India",
    city:             "Hyderabad",
    state:            "Telangana",
    country:          "India",
    postalCode:       "500032",
    latitude:         17.4401,
    longitude:        78.3489,
    placeId:          "in_tg_gachibowli"
  },
  {
    name:             "JNTU Hyderabad",
    formattedAddress: "Kukatpally, Hyderabad, Telangana 500085, India",
    city:             "Hyderabad",
    state:            "Telangana",
    country:          "India",
    postalCode:       "500085",
    latitude:         17.4942,
    longitude:        78.3891,
    placeId:          "in_tg_jntu"
  },
  {
    name:             "Charminar",
    formattedAddress: "Charminar, Old City, Hyderabad, Telangana 500002, India",
    city:             "Hyderabad",
    state:            "Telangana",
    country:          "India",
    postalCode:       "500002",
    latitude:         17.3616,
    longitude:        78.4747,
    placeId:          "in_tg_charminar"
  },

  // ── Uttar Pradesh ─────────────────────────────────────────────────────────
  {
    name:             "Gomti Nagar Lucknow",
    formattedAddress: "Gomti Nagar, Lucknow, Uttar Pradesh 226010, India",
    city:             "Lucknow",
    state:            "Uttar Pradesh",
    country:          "India",
    postalCode:       "226010",
    latitude:         26.8500,
    longitude:        80.9989,
    placeId:          "in_up_gomti_nagar"
  },
  {
    name:             "Assi Ghat Varanasi",
    formattedAddress: "Assi Ghat, Varanasi, Uttar Pradesh 221005, India",
    city:             "Varanasi",
    state:            "Uttar Pradesh",
    country:          "India",
    postalCode:       "221005",
    latitude:         25.2908,
    longitude:        83.0069,
    placeId:          "in_up_assi_ghat"
  },
  {
    name:             "Agra Taj Mahal",
    formattedAddress: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India",
    city:             "Agra",
    state:            "Uttar Pradesh",
    country:          "India",
    postalCode:       "282001",
    latitude:         27.1751,
    longitude:        78.0421,
    placeId:          "in_up_taj_mahal"
  },
  {
    name:             "Prayagraj Sangam",
    formattedAddress: "Sangam, Prayagraj, Uttar Pradesh 211001, India",
    city:             "Prayagraj",
    state:            "Uttar Pradesh",
    country:          "India",
    postalCode:       "211001",
    latitude:         25.4358,
    longitude:        81.8463,
    placeId:          "in_up_prayagraj_sangam"
  },

  // ── West Bengal ───────────────────────────────────────────────────────────
  {
    name:             "Park Street Kolkata",
    formattedAddress: "Mother Teresa Sarani, Park Street Area, Kolkata, West Bengal 700016, India",
    city:             "Kolkata",
    state:            "West Bengal",
    country:          "India",
    postalCode:       "700016",
    latitude:         22.5535,
    longitude:        88.3533,
    placeId:          "in_wb_park_street"
  },
  {
    name:             "Salt Lake Sector V",
    formattedAddress: "Sector V, Bidhannagar, Kolkata, West Bengal 700091, India",
    city:             "Kolkata",
    state:            "West Bengal",
    country:          "India",
    postalCode:       "700091",
    latitude:         22.5807,
    longitude:        88.4326,
    placeId:          "in_wb_salt_lake"
  },
  {
    name:             "Jadavpur University",
    formattedAddress: "Raja Subodh Chandra Mallick Road, Jadavpur, Kolkata, West Bengal 700032, India",
    city:             "Kolkata",
    state:            "West Bengal",
    country:          "India",
    postalCode:       "700032",
    latitude:         22.4988,
    longitude:        88.3714,
    placeId:          "in_wb_jadavpur"
  },
  {
    name:             "Howrah Railway Station",
    formattedAddress: "Howrah Station Road, Howrah, West Bengal 711101, India",
    city:             "Howrah",
    state:            "West Bengal",
    country:          "India",
    postalCode:       "711101",
    latitude:         22.5839,
    longitude:        88.3424,
    placeId:          "in_wb_howrah_station"
  },

  // ── Rajasthan ─────────────────────────────────────────────────────────────
  {
    name:             "MI Road Jaipur",
    formattedAddress: "Mirza Ismail Road, Jaipur, Rajasthan 302001, India",
    city:             "Jaipur",
    state:            "Rajasthan",
    country:          "India",
    postalCode:       "302001",
    latitude:         26.9124,
    longitude:        75.7873,
    placeId:          "in_rj_mi_road"
  },
  {
    name:             "Jodhpur Clock Tower",
    formattedAddress: "Sardar Market, Ghanta Ghar, Jodhpur, Rajasthan 342001, India",
    city:             "Jodhpur",
    state:            "Rajasthan",
    country:          "India",
    postalCode:       "342001",
    latitude:         26.2924,
    longitude:        73.0243,
    placeId:          "in_rj_jodhpur"
  },
  {
    name:             "Udaipur City Palace",
    formattedAddress: "City Palace Road, Udaipur, Rajasthan 313001, India",
    city:             "Udaipur",
    state:            "Rajasthan",
    country:          "India",
    postalCode:       "313001",
    latitude:         24.5764,
    longitude:        73.6833,
    placeId:          "in_rj_udaipur"
  },

  // ── Tamil Nadu ────────────────────────────────────────────────────────────
  {
    name:             "T Nagar Chennai",
    formattedAddress: "Thyagaraya Nagar, Chennai, Tamil Nadu 600017, India",
    city:             "Chennai",
    state:            "Tamil Nadu",
    country:          "India",
    postalCode:       "600017",
    latitude:         13.0418,
    longitude:        80.2341,
    placeId:          "in_tn_t_nagar"
  },
  {
    name:             "Anna Nagar Chennai",
    formattedAddress: "Anna Nagar, Chennai, Tamil Nadu 600040, India",
    city:             "Chennai",
    state:            "Tamil Nadu",
    country:          "India",
    postalCode:       "600040",
    latitude:         13.0891,
    longitude:        80.2101,
    placeId:          "in_tn_anna_nagar"
  },
  {
    name:             "Coimbatore RS Puram",
    formattedAddress: "Race Course Road, R.S. Puram, Coimbatore, Tamil Nadu 641002, India",
    city:             "Coimbatore",
    state:            "Tamil Nadu",
    country:          "India",
    postalCode:       "641002",
    latitude:         11.0057,
    longitude:        76.9619,
    placeId:          "in_tn_rs_puram"
  },
  {
    name:             "Madurai Meenakshi Temple",
    formattedAddress: "Madurai Main, Madurai, Tamil Nadu 625001, India",
    city:             "Madurai",
    state:            "Tamil Nadu",
    country:          "India",
    postalCode:       "625001",
    latitude:         9.9195,
    longitude:        78.1193,
    placeId:          "in_tn_madurai"
  }
];

// ---------------------------------------------------------------------------
// searchIndiaLocations — multi-tier geocoding with graceful degradation
// ---------------------------------------------------------------------------
/**
 * Searches Indian locations via a waterfall of four providers:
 *   1. Photon (komoot.io) — fast, CORS-safe, India bounding box
 *   2. Nominatim OSM       — secondary online geocoder
 *   3. Curated offline index (INDIA_SAMPLE_LOCATIONS) — fuzzy match
 *   4. Custom user-entry fallback — never returns an empty array
 *
 * @param {string}      query  — text the user typed
 * @param {AbortSignal} signal — optional AbortSignal for cancellation
 * @returns {Promise<Array>}   — array of formatLocationObject-shaped objects
 */
export async function searchIndiaLocations(query, signal) {
  const trimmed = (query || "").trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = trimmed.toLowerCase();
  if (searchCache.has(cacheKey)) return searchCache.get(cacheKey);

  // ── Tier 1: Photon (komoot.io) ──────────────────────────────────────────
  try {
    // India bounding box: lon_min, lat_min, lon_max, lat_max
    const photonUrl =
      `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}` +
      `&limit=10&bbox=68.1,6.7,97.4,37.1`;

    const res = await fetch(photonUrl, {
      signal: signal || AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      const features = (data && data.features) || [];
      const results = features
        .filter((f) => {
          const country = (f.properties?.country || "").toLowerCase();
          return !country || country === "india";
        })
        .map((f) => {
          const p      = f.properties || {};
          const coords = f.geometry?.coordinates || [0, 0];
          const name   = p.name || p.street || p.city || trimmed;
          const parts  = [
            p.street,
            p.locality || p.district,
            p.city || p.town || p.county,
            p.state,
            p.postcode,
            "India"
          ].filter(Boolean);

          return formatLocationObject({
            name,
            formattedAddress: parts.join(", ") || name,
            city:             p.city  || p.town  || p.district || "",
            state:            p.state || "",
            country:          "India",
            postalCode:       p.postcode || "",
            latitude:         coords[1],
            longitude:        coords[0],
            placeId:          `photon_${p.osm_id || Math.random()}`
          });
        });

      if (results.length > 0) {
        searchCache.set(cacheKey, results);
        return results;
      }
    }
  } catch (_) {
    // Network error / timeout / CORS — cascade to next tier
  }

  // ── Tier 2: Nominatim OSM ───────────────────────────────────────────────
  try {
    const nomUrl =
      `https://nominatim.openstreetmap.org/search` +
      `?format=json&addressdetails=1&countrycodes=in&limit=8` +
      `&q=${encodeURIComponent(trimmed)}`;

    const nomRes = await fetch(nomUrl, {
      headers: { "Accept-Language": "en" },
      signal:  signal || AbortSignal.timeout(4000)
    });

    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData) && nomData.length > 0) {
        const results = nomData.map((item) => {
          const addr = item.address || {};
          const name = (item.display_name || "").split(",")[0] || trimmed;
          return formatLocationObject({
            name,
            formattedAddress: item.display_name || name,
            city:             addr.city   || addr.town  || addr.village || addr.county || "",
            state:            addr.state  || "",
            country:          "India",
            postalCode:       addr.postcode || "",
            latitude:         item.lat,
            longitude:        item.lon,
            placeId:          `osm_${item.place_id || Math.random()}`
          });
        });

        searchCache.set(cacheKey, results);
        return results;
      }
    }
  } catch (_) {
    // Secondary geocoder failed — continue to offline index
  }

  // ── Tier 3: Curated INDIA_SAMPLE_LOCATIONS (fuzzy offline match) ─────────
  const lq = cacheKey; // already lowercased
  const matched = INDIA_SAMPLE_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(lq)             ||
    loc.formattedAddress.toLowerCase().includes(lq) ||
    loc.city.toLowerCase().includes(lq)             ||
    loc.state.toLowerCase().includes(lq)
  );

  if (matched.length > 0) {
    searchCache.set(cacheKey, matched);
    return matched;
  }

  // ── Tier 4: Custom user-entry fallback — never return empty ─────────────
  const fallback = [
    formatLocationObject({
      name:             trimmed,
      formattedAddress: `${trimmed}, India`,
      city:             "",
      state:            "",
      country:          "India",
      latitude:         null,
      longitude:        null,
      placeId:          `custom_${Date.now()}`
    })
  ];
  return fallback;
}

// ---------------------------------------------------------------------------
// resolveLocationCoords — fuzzy string → { lat, lng, city, state }
// ---------------------------------------------------------------------------
/**
 * Resolves a free-text location string to coordinate data via fuzzy matching
 * against the curated INDIA_SAMPLE_LOCATIONS index.
 *
 * @param  {string} locationString
 * @returns {{ lat: number, lng: number, city: string, state: string } | null}
 */
export function resolveLocationCoords(locationString) {
  if (!locationString) return null;
  const lower = locationString.toLowerCase().trim();

  const match = INDIA_SAMPLE_LOCATIONS.find(
    (loc) =>
      loc.name.toLowerCase().includes(lower)             ||
      lower.includes(loc.name.toLowerCase())             ||
      loc.formattedAddress.toLowerCase().includes(lower) ||
      loc.city.toLowerCase() === lower                   ||
      loc.state.toLowerCase() === lower
  );

  if (match && match.latitude !== null && match.longitude !== null) {
    return {
      lat:   match.latitude,
      lng:   match.longitude,
      city:  match.city,
      state: match.state
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// createManualLocation — user-typed string → standard location object
// ---------------------------------------------------------------------------
/**
 * Converts an arbitrary user-typed string (e.g. "Kamla Nagar, Delhi") into a
 * valid, normalised location object.  No network call is made.
 *
 * @param  {string} locationString
 * @returns {object} — formatLocationObject-shaped
 */
export function createManualLocation(locationString) {
  const parts = (locationString || "").split(",").map((s) => s.trim());
  const name  = parts[0] || "Custom Location";
  const city  = parts[1] || "";
  const state = parts[2] || "";

  return formatLocationObject({
    name,
    formattedAddress: locationString || name,
    city,
    state,
    country: "India"
  });
}

// ---------------------------------------------------------------------------
// calculateEstimatedRoadDistanceKm — haversine × 1.35 road factor
// ---------------------------------------------------------------------------
/**
 * Calculates an estimated road distance between two WGS-84 coordinates.
 *
 * Uses the Haversine formula for the aerial ("as the crow flies") distance,
 * then multiplies by 1.35 — a tortuosity factor calibrated to typical Indian
 * urban and national highway networks.
 *
 * @param  {number|null} lat1
 * @param  {number|null} lon1
 * @param  {number|null} lat2
 * @param  {number|null} lon2
 * @returns {number|null} — road distance in km, rounded to 1 dp; null if any coord is missing
 */
export function calculateEstimatedRoadDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return null;
  }

  const R     = 6371; // Earth's mean radius in km
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const aerialDistanceKm = R * c;
  const roadDistanceKm   = aerialDistanceKm * 1.35; // road tortuosity factor

  return Math.round(roadDistanceKm * 10) / 10;
}
