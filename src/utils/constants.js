// Campus Constants and Location Coordinates for Route Matching Engine
// Target Launch Context: Delhi University North Campus & Kamla Nagar

export const CAMPUS_LOCATIONS = [
  {
    id: "loc-kn-market",
    name: "Kamla Nagar Market (Bunglow Rd)",
    zone: "Commercial",
    type: "Market",
    coords: { lat: 28.6812, lng: 77.2025 }
  },
  {
    id: "loc-patel-chest",
    name: "Patel Chest Marg (Chemist & Xerox)",
    zone: "Services",
    type: "Service Hub",
    coords: { lat: 28.6885, lng: 77.2090 }
  },
  {
    id: "loc-sudama-hub",
    name: "Sudama Stall / Arts Nescafe Hub",
    zone: "Campus Central",
    type: "Food & Canteen",
    coords: { lat: 28.6905, lng: 77.2115 }
  },
  {
    id: "loc-arts-library",
    name: "Arts Faculty & Central Library",
    zone: "Academic Core",
    type: "Academic",
    coords: { lat: 28.6918, lng: 77.2132 }
  },
  {
    id: "loc-vv-metro",
    name: "Vishwa Vidyalaya Metro Station",
    zone: "Transit Hub",
    type: "Transit",
    coords: { lat: 28.6975, lng: 77.2185 }
  },
  {
    id: "loc-miranda",
    name: "Miranda House / St. Stephen's Gate",
    zone: "Colleges West",
    type: "College",
    coords: { lat: 28.6935, lng: 77.2105 }
  },
  {
    id: "loc-srcc-ramjas",
    name: "SRCC & Ramjas College Complex",
    zone: "Colleges North",
    type: "College",
    coords: { lat: 28.6948, lng: 77.2140 }
  },
  {
    id: "loc-gwyer-jubilee",
    name: "Gwyer Hall & Jubilee Hall Hostels",
    zone: "Residential",
    type: "Hostels",
    coords: { lat: 28.6900, lng: 77.2160 }
  },
  {
    id: "loc-law-faculty",
    name: "Faculty of Law & Maurice Nagar",
    zone: "Academic East",
    type: "Academic",
    coords: { lat: 28.6960, lng: 77.2120 }
  },
  {
    id: "loc-chhatra-marg",
    name: "Chhatra Marg Student Centre",
    zone: "Campus Central",
    type: "Food & Activity",
    coords: { lat: 28.6922, lng: 77.2120 }
  }
];

export const POPULAR_SHOPS = [
  { name: "Sudama Tea Point & Cafe", location: "Arts Faculty Complex", category: "Food & Chai" },
  { name: "Patel Chest Xerox & Stationery Hub", location: "Patel Chest Marg", category: "Printing & Notes" },
  { name: "Apollo Pharmacy & Chemist", location: "Kamla Nagar Market", category: "Medicines & Care" },
  { name: "Book Land & Art Station", location: "Bunglow Rd, Kamla Nagar", category: "Stationery" },
  { name: "Sparkle Laundry & Dry Cleaners", location: "Roop Nagar", category: "Laundry" },
  { name: "Chache Di Hatti", location: "Kamla Nagar Market", category: "Food" },
  { name: "Central Canteen Fresh Juice", location: "Arts Library Lawn", category: "Beverages" }
];

export const TRANSPORT_MODES = [
  { id: "walking", label: "Walking", speedKmh: 4.5, icon: "Footprints", defaultCapacity: "Backpack (up to 3 kg)" },
  { id: "bicycle", label: "Bicycle", speedKmh: 14, icon: "Bike", defaultCapacity: "Tote / Medium Basket" },
  { id: "erickshaw", label: "E-Rickshaw", speedKmh: 18, icon: "Car", defaultCapacity: "Comfortable Parcel Space" },
  { id: "auto", label: "Shared Auto", speedKmh: 25, icon: "Bus", defaultCapacity: "Multiple Parcels" }
];

export const PACKAGE_SIZES = [
  { id: "small", label: "Small / Documents (< 500g)", description: "Letters, prescriptions, notes, USB drives", rewardModifier: 0 },
  { id: "medium", label: "Medium / Backpack (1 - 2 kg)", description: "Food containers, books, small boxes", rewardModifier: 10 },
  { id: "large", label: "Laundry / Clothing (2 - 4 kg)", description: "Ironed blazers, laundry bag, drawing board", rewardModifier: 25 },
  { id: "bulky", label: "Bulky / Two Hands", description: "Heavy cartons or fragile equipment", rewardModifier: 40 }
];

export const REQUEST_STATUS = {
  OPEN: "OPEN",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  DISPUTED: "DISPUTED"
};

export const STATUS_LABELS = {
  OPEN: { label: "Awaiting Traveller", color: "bg-teal-50 text-teal-800 border-teal-200" },
  ACCEPTED: { label: "Traveller Assigned", color: "bg-blue-50 text-blue-800 border-blue-200" },
  PICKED_UP: { label: "Item Collected", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  IN_TRANSIT: { label: "In Transit Along Route", color: "bg-amber-50 text-amber-900 border-amber-200" },
  DELIVERED: { label: "Delivered & Verified", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-50 text-rose-800 border-rose-200" },
  DISPUTED: { label: "Under Review", color: "bg-purple-50 text-purple-800 border-purple-200" }
};
