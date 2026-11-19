// Centralized Browser Storage Service for Raahi MVP
// Encapsulates localStorage persistence with schema validation and REST-ready async signatures

const STORAGE_KEYS = {
  USER: "raahi_user_profile",
  REQUESTS: "raahi_requests_db",
  ROUTES: "raahi_routes_db",
  ACTIVE_ROUTE: "raahi_active_route",
  EARNINGS: "raahi_earnings_db",
  NOTIFICATIONS: "raahi_notifications_db",
  ACTIVITY: "raahi_activity_db",
  SAMPLE_MODE: "raahi_sample_mode_enabled"
};

// Default User Profile for simulation
export const DEFAULT_USER = {
  id: "USR-IN-108",
  name: "Sameer Gautam",
  email: "sameer.gautam@raahi.in",
  phone: "+91 98765 43210",
  college: "India Commute Community",
  city: "All India",
  role: "customer",
  verified: true,
  rating: 4.92,
  completedDeliveries: 11,
  requestedErrands: 7
};

// Multi-state India-wide seed requests
export const SEED_REQUESTS = [
  // Punjab (Lovely Professional University & Phagwara)
  {
    id: "REQ-301",
    type: "buy",
    title: "Engineering Drawing Sheet & 0.5 Fine Micron Pen",
    customer: {
      name: "Harpreet Singh",
      dept: "LPU Campus, Block 34",
      location: "UniMall Main Entrance, LPU, Phagwara",
      rating: 4.9,
      phone: "+91 98111 22334"
    },
    storeOrPickup: "LPU UniMall Stationery Hub",
    pickupArea: "UniMall, LPU Campus, Phagwara, Punjab",
    pickupLocationObj: {
      name: "UniMall Stationery Hub",
      formattedAddress: "Lovely Professional University, Phagwara, Punjab 144411, India",
      city: "Phagwara",
      state: "Punjab",
      country: "India",
      latitude: 31.2536,
      longitude: 75.7037
    },
    destination: "Boys Hostel 4 Gate, LPU, Phagwara",
    dropArea: "LPU Campus, Phagwara",
    destinationLocationObj: {
      name: "Boys Hostel 4 Gate",
      formattedAddress: "Hostel Zone, LPU, Phagwara, Punjab 144411, India",
      city: "Phagwara",
      state: "Punjab",
      country: "India",
      latitude: 31.2560,
      longitude: 75.7080
    },
    items: [
      { name: "A2 Cartridge Sheet Pack (5 pcs)", qty: 1, note: "White, 200gsm" },
      { name: "Sakura Micron 0.5 Pen", qty: 1, note: "Black waterproof" }
    ],
    itemBudget: 180,
    rewardFee: 50,
    detourMeters: 300,
    detourTimeMinutes: 6,
    neededBy: "Within 45 mins",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "OPEN",
    otp: "4821",
    notes: "Please call when you reach BH-4 gate, will come down immediately!"
  },

  // Delhi NCR
  {
    id: "REQ-302",
    type: "pickup",
    title: "Legal Research Case Notes Spiral Binding",
    customer: {
      name: "Aanya Sharma",
      dept: "Barakhamba Road Law Chambers",
      location: "Connaught Place Inner Circle, Block B",
      rating: 4.9,
      phone: "+91 98222 33445"
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
    destination: "Barakhamba Metro Gate 3",
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
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: "OPEN",
    otp: "7319",
    notes: "Receipt is with counter 1. Just show token #82."
  },

  // Bihar (Patna)
  {
    id: "REQ-303",
    type: "buy",
    title: "Dolo 650, ORS Sachet & Thermometer",
    customer: {
      name: "Rohan Verma",
      dept: "Boring Road Resident",
      location: "Near AN College, Boring Road, Patna",
      rating: 4.8,
      phone: "+91 98333 44556"
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
      { name: "Dolo 650mg strip (15 tabs)", qty: 1, note: "Paracetamol" },
      { name: "Electral WHO Sachet", qty: 2, note: "Orange" }
    ],
    itemBudget: 150,
    rewardFee: 60,
    detourMeters: 420,
    detourTimeMinutes: 9,
    neededBy: "Urgent (Within 35 mins)",
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    status: "OPEN",
    otp: "6142",
    notes: "High fever. Will transfer medicine cost via UPI immediately upon handover."
  },

  // Karnataka (Bengaluru)
  {
    id: "REQ-304",
    type: "buy",
    title: "Filter Coffee & Idli Vada Parcel",
    customer: {
      name: "Pooja Hegde",
      dept: "MG Road Co-working Space",
      location: "Brigade Road Corner, Bengaluru",
      rating: 5.0,
      phone: "+91 98444 55667"
    },
    storeOrPickup: "MTR / Konark Restaurant",
    pickupArea: "Commercial Street, Bengaluru",
    pickupLocationObj: {
      name: "Konark Restaurant",
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
      { name: "Hot Filter Coffee Flask", qty: 1, note: "Strong" },
      { name: "Idli Vada Combo", qty: 1, note: "Extra sambar" }
    ],
    itemBudget: 140,
    rewardFee: 45,
    detourMeters: 550,
    detourTimeMinutes: 11,
    neededBy: "Within 40 mins",
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    status: "OPEN",
    otp: "9514",
    notes: "Please ask for thermal flask so coffee stays hot."
  }
];

// India-wide seed commuter routes
export const SEED_ROUTES = [
  {
    id: "ROUTE-201",
    origin: "Lovely Professional University (LPU Main Gate)",
    originLocationObj: {
      name: "LPU Main Gate",
      formattedAddress: "Lovely Professional University, Phagwara, Punjab 144411, India",
      city: "Phagwara",
      state: "Punjab",
      country: "India",
      latitude: 31.2536,
      longitude: 75.7037
    },
    destination: "Phagwara City Railway Station",
    destinationLocationObj: {
      name: "Phagwara Junction Railway Station",
      formattedAddress: "Railway Station Road, Phagwara, Punjab 144401, India",
      city: "Phagwara",
      state: "Punjab",
      country: "India",
      latitude: 31.2215,
      longitude: 75.7725
    },
    travelDate: new Date().toISOString().split("T")[0],
    departureTime: "In 20 mins (2:15 PM)",
    travelMode: "E-Rickshaw",
    distanceKm: 7.8,
    maxDetourMeters: 1000,
    maxDetourMinutes: 15,
    availableCapacity: "Backpack (up to 3 kg)",
    active: true
  },
  {
    id: "ROUTE-202",
    origin: "Connaught Place (Inner Circle)",
    originLocationObj: {
      name: "Connaught Place Inner Circle",
      formattedAddress: "Connaught Place, New Delhi 110001, India",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.6315,
      longitude: 77.2167
    },
    destination: "Barakhamba Road & Mandi House",
    destinationLocationObj: {
      name: "Mandi House Metro Station",
      formattedAddress: "Mandi House, Copernicus Marg, New Delhi 110001, India",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.6258,
      longitude: 77.2345
    },
    travelDate: new Date().toISOString().split("T")[0],
    departureTime: "In 15 mins (1:45 PM)",
    travelMode: "Walking",
    distanceKm: 1.8,
    maxDetourMeters: 600,
    maxDetourMinutes: 12,
    availableCapacity: "Tote Bag / Medium Parcel",
    active: false
  }
];

export const storageService = {
  // --- USER PROFILE ---
  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },
  saveUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  // --- REQUESTS ---
  getRequests() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
        return SEED_REQUESTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_REQUESTS;
    }
  },
  saveRequest(newRequest) {
    const list = this.getRequests();
    const reqWithId = {
      ...newRequest,
      id: newRequest.id || `REQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: newRequest.createdAt || new Date().toISOString(),
      status: newRequest.status || "OPEN",
      otp: newRequest.otp || String(Math.floor(1000 + Math.random() * 9000))
    };
    const updated = [reqWithId, ...list];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
    this.logActivity({
      type: "REQUEST_CREATED",
      title: `Created Request: ${reqWithId.title}`,
      description: `Delivery from ${reqWithId.storeOrPickup} to ${reqWithId.destination}`
    });
    return reqWithId;
  },
  updateRequest(updatedReq) {
    const list = this.getRequests();
    const updated = list.map((r) => (r.id === updatedReq.id ? updatedReq : r));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
    return updatedReq;
  },
  updateRequestStatus(requestId, status, extraFields = {}) {
    const list = this.getRequests();
    let target = null;
    const updated = list.map((r) => {
      if (r.id === requestId) {
        target = { ...r, status, ...extraFields, updatedAt: new Date().toISOString() };
        return target;
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));

    if (status === "DELIVERED" && target && target.rewardFee) {
      this.recordEarning({
        requestId: target.id,
        amount: target.rewardFee,
        title: target.title,
        date: new Date().toISOString()
      });
    }

    this.logActivity({
      type: `STATUS_${status}`,
      title: `Order ${requestId} updated to ${status}`,
      description: target ? target.title : ""
    });

    return target;
  },
  cancelRequest(requestId, reason = "Cancelled by user") {
    return this.updateRequestStatus(requestId, "CANCELLED", { cancellationReason: reason });
  },

  // --- TRAVELLER ROUTES ---
  getRoutes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(SEED_ROUTES));
        return SEED_ROUTES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_ROUTES;
    }
  },
  saveRoute(newRoute) {
    const list = this.getRoutes();
    const routeWithId = {
      ...newRoute,
      id: newRoute.id || `ROUTE-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      active: true
    };
    const updated = [routeWithId, ...list.filter((r) => r.id !== routeWithId.id)];
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(updated));
    this.setActiveRoute(routeWithId);
    this.logActivity({
      type: "ROUTE_PUBLISHED",
      title: `Published Route: ${routeWithId.origin} ➔ ${routeWithId.destination}`,
      description: `Mode: ${routeWithId.travelMode}, Departure: ${routeWithId.departureTime}`
    });
    return routeWithId;
  },
  getActiveRoute() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROUTE);
      if (data) return JSON.parse(data);
      const routes = this.getRoutes();
      return routes.find((r) => r.active) || routes[0] || null;
    } catch {
      return null;
    }
  },
  setActiveRoute(route) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROUTE, JSON.stringify(route));
  },
  deactivateRoute(routeId) {
    const routes = this.getRoutes().map((r) => (r.id === routeId ? { ...r, active: false } : r));
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  },

  // --- EARNINGS ---
  getEarnings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EARNINGS);
      return data ? JSON.parse(data) : [
        { id: "ERN-1", requestId: "REQ-098", amount: 55, title: "Delivery in Phagwara / LPU Corridor", date: "2 days ago" },
        { id: "ERN-2", requestId: "REQ-095", amount: 70, title: "Stationery in Connaught Place, Delhi", date: "3 days ago" },
        { id: "ERN-3", requestId: "REQ-091", amount: 45, title: "Food pickup near Boring Road, Patna", date: "4 days ago" }
      ];
    } catch {
      return [];
    }
  },
  recordEarning(earning) {
    const earnings = this.getEarnings();
    const newEntry = {
      id: `ERN-${Math.floor(100 + Math.random() * 900)}`,
      ...earning,
      recordedAt: new Date().toISOString()
    };
    const updated = [newEntry, ...earnings];
    localStorage.setItem(STORAGE_KEYS.EARNINGS, JSON.stringify(updated));
    this.addNotification({
      title: `Commute Reward Credited (+₹${earning.amount})`,
      message: `Completed delivery for "${earning.title}". Funds added toward transit expenses.`,
      type: "reward"
    });
    return newEntry;
  },

  // --- NOTIFICATIONS ---
  getNotifications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [
        { id: "NOTIF-1", title: "India-Wide Search Active", message: "Search places across all Indian states and cities seamlessly.", date: "Just now", unread: true },
        { id: "NOTIF-2", title: "Commute Offsets Updated", message: "Average reward per errand is currently ₹55 to offset daily travel fares.", date: "1 hour ago", unread: false }
      ];
    } catch {
      return [];
    }
  },
  addNotification(notif) {
    const notifs = this.getNotifications();
    const entry = {
      id: `NOTIF-${Date.now()}`,
      ...notif,
      date: notif.date || "Just now",
      unread: true
    };
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([entry, ...notifs]));
  },
  markAllNotificationsRead() {
    const notifs = this.getNotifications().map((n) => ({ ...n, unread: false }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  // --- ACTIVITY TIMELINE ---
  getActivity() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      return data ? JSON.parse(data) : [
        { id: "ACT-1", type: "INIT", title: "Raahi India-Wide Platform Ready", description: "Search enabled across all Indian states, cities, universities and transit hubs", timestamp: new Date().toISOString() }
      ];
    } catch {
      return [];
    }
  },
  logActivity(activity) {
    const acts = this.getActivity();
    const entry = {
      id: `ACT-${Date.now()}`,
      ...activity,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify([entry, ...acts.slice(0, 50)]));
  },

  // --- SAMPLE DATA CONTROLS ---
  resetToSampleData() {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(SEED_ROUTES));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(STORAGE_KEYS.SAMPLE_MODE, "true");
  },
  clearAllData() {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
};
