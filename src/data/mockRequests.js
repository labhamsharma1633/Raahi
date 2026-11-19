// Raahi Mock / Seed Data — India-Wide
// These are display-only references; the live data layer uses SEED_REQUESTS in storageService.js
// CAMPUS_LOCATIONS is kept as a named export to avoid breaking any importing components,
// but it no longer restricts the app — the LocationAutocomplete component searches all of India.

export const MOCK_REQUESTS = [
  {
    id: "REQ-101",
    type: "buy",
    title: "Filter Coffee & Idli Vada from Darshini",
    customer: {
      name: "Pooja Hegde",
      dept: "MG Road Co-working Space",
      location: "Brigade Road, Bengaluru",
      rating: 5.0,
      ordersCompleted: 22,
    },
    storeOrPickup: "Darshini Fast Food, Commercial Street",
    pickupArea: "Commercial Street, Bengaluru",
    pickupLocationObj: {
      name: "Darshini Fast Food",
      formattedAddress: "Commercial Street, Tasker Town, Bengaluru, Karnataka 560001, India",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9822,
      longitude: 77.6083
    },
    destination: "MG Road Metro Station, Gate 2",
    dropArea: "MG Road, Bengaluru",
    destinationLocationObj: {
      name: "MG Road Metro Station",
      formattedAddress: "Mahatma Gandhi Road, Bengaluru, Karnataka 560001, India",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9756,
      longitude: 77.6066
    },
    items: [
      { name: "Filter Coffee (strong)", qty: 2, note: "Less sugar" },
      { name: "Idli Vada Combo", qty: 1, note: "Extra sambar on the side" }
    ],
    itemBudget: 140,
    rewardFee: 45,
    detourMeters: 320,
    detourTimeMinutes: 7,
    neededBy: "Within 40 mins",
    createdAt: "10 mins ago",
    status: "OPEN",
    tags: ["Food & Beverages", "Quick Detour", "South Indian"],
    notes: "Call when at MG Road station gate."
  },
  {
    id: "REQ-102",
    type: "pickup",
    title: "Legal Research Spiral Binder from Print Point",
    customer: {
      name: "Aanya Sharma",
      dept: "Barakhamba Road Law Chambers",
      location: "Connaught Place Inner Circle, Block B",
      rating: 4.9,
      ordersCompleted: 14,
    },
    storeOrPickup: "Print Point, Shankar Market",
    pickupArea: "Connaught Place, New Delhi",
    pickupLocationObj: {
      name: "Shankar Market Print Point",
      formattedAddress: "Shankar Market, Connaught Place, New Delhi 110001, India",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.6325,
      longitude: 77.2210
    },
    destination: "Barakhamba Metro Station Gate 3",
    dropArea: "Connaught Place Outer Circle",
    destinationLocationObj: {
      name: "Barakhamba Metro Station",
      formattedAddress: "Barakhamba Road, Connaught Place, New Delhi 110001, India",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.6295,
      longitude: 77.2255
    },
    items: [
      { name: "High Court Case Brief Binder (Order #82)", qty: 1, note: "Pre-paid online" }
    ],
    itemBudget: 0,
    rewardFee: 65,
    detourMeters: 380,
    detourTimeMinutes: 8,
    neededBy: "Before 3:00 PM",
    createdAt: "18 mins ago",
    status: "OPEN",
    tags: ["Study Material", "Pre-paid", "Low Weight"],
    notes: "Show token #82 at counter 1. Already packed."
  },
  {
    id: "REQ-103",
    type: "buy",
    title: "Dolo 650, Electral ORS & Thermometer",
    customer: {
      name: "Rohan Verma",
      dept: "Boring Road Resident",
      location: "Near AN College, Boring Road, Patna",
      rating: 4.8,
      ordersCompleted: 9,
    },
    storeOrPickup: "Sanjivani Chemist, Boring Canal Road",
    pickupArea: "Boring Canal Road, Patna",
    pickupLocationObj: {
      name: "Sanjivani Chemist",
      formattedAddress: "Boring Canal Road, Patna, Bihar 800001, India",
      city: "Patna",
      state: "Bihar",
      country: "India",
      latitude: 25.6145,
      longitude: 85.1205
    },
    destination: "AN College Main Gate, Boring Road",
    dropArea: "Boring Road, Patna",
    destinationLocationObj: {
      name: "AN College Main Gate",
      formattedAddress: "Boring Road, Patna, Bihar 800013, India",
      city: "Patna",
      state: "Bihar",
      country: "India",
      latitude: 25.6160,
      longitude: 85.1140
    },
    items: [
      { name: "Dolo 650mg strip (15 tabs)", qty: 1, note: "OTC paracetamol" },
      { name: "Electral ORS Sachet", qty: 2, note: "Orange flavour" }
    ],
    itemBudget: 150,
    rewardFee: 60,
    detourMeters: 420,
    detourTimeMinutes: 9,
    neededBy: "Urgent (Within 35 mins)",
    createdAt: "5 mins ago",
    status: "OPEN",
    tags: ["Pharmacy", "Urgent", "High Reward"],
    notes: "High fever. Will pay via UPI on handover."
  },
  {
    id: "REQ-104",
    type: "pickup",
    title: "Dry-Cleaned Formal Blazers (2 items)",
    customer: {
      name: "Kabir Mehta",
      dept: "JNTU Campus, Kukatpally",
      location: "JNTU Boys Hostel C, Hyderabad",
      rating: 4.7,
      ordersCompleted: 7,
    },
    storeOrPickup: "FreshKlean Laundry, Kukatpally",
    pickupArea: "Kukatpally Housing Board, Hyderabad",
    pickupLocationObj: {
      name: "FreshKlean Laundry",
      formattedAddress: "Kukatpally Housing Board Colony, Hyderabad, Telangana 500085, India",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      latitude: 17.4942,
      longitude: 78.3891
    },
    destination: "JNTU Metro Station Exit Gate",
    dropArea: "JNTU, Hyderabad",
    destinationLocationObj: {
      name: "JNTU Metro Station",
      formattedAddress: "Kukatpally, Hyderabad, Telangana 500085, India",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      latitude: 17.4942,
      longitude: 78.3891
    },
    items: [
      { name: "Navy Blue Blazer + Formal Shirt (hanger bag)", qty: 1, note: "Pre-paid, tag #714" }
    ],
    itemBudget: 0,
    rewardFee: 75,
    detourMeters: 650,
    detourTimeMinutes: 13,
    neededBy: "By 4:30 PM",
    createdAt: "25 mins ago",
    status: "OPEN",
    tags: ["Laundry", "Handle with Care"],
    notes: "Keep on hanger, do not fold please!"
  },
  {
    id: "REQ-105",
    type: "buy",
    title: "A3 Sketch Book & Micron Fine-liner Pen",
    customer: {
      name: "Meera Sen",
      dept: "Fine Arts, Jadavpur University",
      location: "Jadavpur Campus, Kolkata",
      rating: 4.9,
      ordersCompleted: 11,
    },
    storeOrPickup: "Art Corner, Gariahat Market",
    pickupArea: "Gariahat, Kolkata",
    pickupLocationObj: {
      name: "Art Corner Stationery",
      formattedAddress: "Gariahat Road, Dhakuria, Kolkata, West Bengal 700031, India",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      latitude: 22.5174,
      longitude: 88.3658
    },
    destination: "Jadavpur University South Gate",
    dropArea: "Jadavpur, Kolkata",
    destinationLocationObj: {
      name: "Jadavpur University South Gate",
      formattedAddress: "Raja Subodh Chandra Mallick Road, Jadavpur, Kolkata, West Bengal 700032, India",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      latitude: 22.4988,
      longitude: 88.3714
    },
    items: [
      { name: "Brustro A3 200gsm Sketch Pad", qty: 1, note: "Plain cartridge" },
      { name: "Sakura Micron 0.5 Black", qty: 1, note: "Waterproof" }
    ],
    itemBudget: 340,
    rewardFee: 60,
    detourMeters: 450,
    detourTimeMinutes: 10,
    neededBy: "Before 3:00 PM session",
    createdAt: "30 mins ago",
    status: "OPEN",
    tags: ["Art Supplies", "Quick Buy"],
    notes: "Receipt required from shopkeeper."
  }
];

export const MOCK_TRAVELLER_ROUTES = [
  {
    id: "ROUTE-01",
    origin: "LPU Main Gate, Phagwara",
    originLocationObj: {
      name: "LPU Main Gate",
      formattedAddress: "Lovely Professional University, Phagwara, Punjab 144411, India",
      city: "Phagwara",
      state: "Punjab",
      country: "India",
      latitude: 31.2536,
      longitude: 75.7037
    },
    destination: "Phagwara Railway Station",
    destinationLocationObj: {
      name: "Phagwara Junction Railway Station",
      formattedAddress: "Railway Station Road, Phagwara, Punjab 144401, India",
      city: "Phagwara",
      state: "Punjab",
      country: "India",
      latitude: 31.2215,
      longitude: 75.7725
    },
    departureTime: "In 20 mins",
    travelMode: "E-Rickshaw",
    distanceKm: 7.8,
    availableCapacity: "Backpack (up to 3 kg)"
  },
  {
    id: "ROUTE-02",
    origin: "Connaught Place Inner Circle",
    originLocationObj: {
      name: "Connaught Place Inner Circle",
      formattedAddress: "Connaught Place, New Delhi 110001, India",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.6315,
      longitude: 77.2167
    },
    destination: "Mandi House Metro Station",
    destinationLocationObj: {
      name: "Mandi House Metro Station",
      formattedAddress: "Mandi House, Copernicus Marg, New Delhi 110001, India",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.6258,
      longitude: 77.2345
    },
    departureTime: "In 15 mins",
    travelMode: "Walking",
    distanceKm: 1.8,
    availableCapacity: "Tote Bag / Medium Parcel"
  }
];

/**
 * INDIA_LOCATION_TYPES — replaces the former CAMPUS_LOCATIONS constant.
 * This is a list of location *categories* Raahi supports, not a fixed location list.
 * The actual location search uses the LocationAutocomplete component (OpenStreetMap / Photon)
 * which covers all of India.
 */
export const INDIA_LOCATION_TYPES = [
  { id: "type-1", name: "Universities & Colleges", type: "Academic" },
  { id: "type-2", name: "Markets & Shopping Areas", type: "Market" },
  { id: "type-3", name: "Xerox, Print & Stationery", type: "Service" },
  { id: "type-4", name: "Metro & Railway Stations", type: "Transit" },
  { id: "type-5", name: "Hostels & PG Accommodations", type: "Residential" },
  { id: "type-6", name: "Pharmacies & Medical Stores", type: "Pharmacy" },
  { id: "type-7", name: "Food Stalls, Canteens & Cafes", type: "Food" },
  { id: "type-8", name: "Bus Stands & Auto Stands", type: "Transit" },
  { id: "type-9", name: "Airports & Inter-city Hubs", type: "Transport" }
];

// Keep backward-compatible alias so any existing import of CAMPUS_LOCATIONS doesn't break
export const CAMPUS_LOCATIONS = INDIA_LOCATION_TYPES;
