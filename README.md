# 🛺 Raahi — Route-Based Community Delivery Platform

<div align="center">

> **"Going somewhere? Help someone along the way."**
> *Tagline: Earn on the way.*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 What is Raahi?

**Raahi** is a community-powered, route-based delivery platform for India. Instead of sending dedicated delivery fleets, Raahi connects people who need errands done with everyday commuters already traveling in that direction.

- 🛒 **Customers** post Buy & Deliver or Pickup & Deliver requests
- 🚶 **Travellers** publish their daily commute route and pick up matching errands along the way
- 💰 **Everyone wins** — customers get fast local delivery, travellers offset their travel costs

**Works across all of India** — universities, metro stations, markets, hostels, pharmacies, and transit hubs in every city.

---

## 🚀 Live Demo

```
npm install
npm run dev
```
Open → **http://localhost:5173/**

---

## 📸 Features

### 👤 Customer Side
| Feature | Description |
|---|---|
| **Buy & Deliver** | Request items from nearby shops — share item list, budget, and reward |
| **Pickup & Deliver** | Send pre-paid parcels, laundry, documents via a passing traveller |
| **Order Tracking** | Real-time 5-step lifecycle: OPEN → ACCEPTED → PICKED_UP → IN_TRANSIT → DELIVERED |
| **My Requests** | Filterable dashboard of all active and past requests |
| **OTP Handover** | 4-digit one-time password for secure item handover verification |

### 🧳 Traveller Side
| Feature | Description |
|---|---|
| **Publish Commute Route** | Set origin, destination, travel mode, and max detour tolerance |
| **Smart Route Matching** | AI-powered engine finds errands that fit within your detour budget |
| **Accept & Deliver** | 1-click acceptance, full lifecycle status management |
| **Earnings Dashboard** | Track cumulative commute offset rewards earned |
| **Completed History** | Archive of all past deliveries |

### 🤝 Shared
- Notifications inbox with unread badge counts
- Activity audit timeline
- Settings — reset sample data or clear storage
- Support & help desk

---

## 🧭 Route Matching Engine

Located at `src/utils/routeMatchingEngine.js` — the core of Raahi.

**Algorithm:**
1. Resolves origin, destination, pickup, and drop-off coordinates
2. Computes the baseline direct trip distance using **Haversine formula × 1.35 road factor**
3. Calculates extra detour:

$$\text{Detour} = \text{dist}(\text{origin}, \text{pickup}) + \text{dist}(\text{pickup}, \text{drop}) + \text{dist}(\text{drop}, \text{dest}) - \text{dist}(\text{origin}, \text{dest})$$

4. Estimates extra travel time based on transport speed (Walking: 4.5 km/h, Bicycle: 14, E-Rickshaw: 18, Auto: 25) + 3 min handover buffer
5. Filters out requests exceeding `maxDetourMeters` and `maxDetourMinutes`
6. Ranks by **reward-per-extra-minute efficiency** (highest value per time cost)
7. City-aware filtering — won't match errands across different Indian cities >40km apart

---

## 🗺️ Location Service

Located at `src/services/locationService.js` — 4-tier geocoding waterfall:

| Tier | Provider | Description |
|---|---|---|
| 1 | **Photon (Komoot)** | Fast, CORS-safe, India bounding box |
| 2 | **Nominatim OSM** | Comprehensive OpenStreetMap geocoder |
| 3 | **Offline Index** | 43 curated Indian landmarks (10 states) |
| 4 | **Custom Fallback** | User-typed location as-is — never returns empty |

---

## 🏗️ Project Structure

```
raahi/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Root router (screen-based SPA)
    ├── styles/
    │   └── tokens.css                  # Design tokens & Tailwind base
    ├── context/
    │   └── RaahiContext.jsx            # Global state (user, requests, routes, earnings)
    ├── services/
    │   ├── storageService.js           # localStorage CRUD + seed data
    │   └── locationService.js          # India-wide geocoding + search
    ├── utils/
    │   ├── constants.js                # Status enums, transport modes, package sizes
    │   └── routeMatchingEngine.js      # Core route ↔ request matching algorithm
    ├── data/
    │   └── mockRequests.js             # Display seed requests & India location types
    ├── components/
    │   ├── AppHeader.jsx               # Full-width responsive navbar
    │   ├── AppFooter.jsx               # Site footer with links
    │   ├── BottomNav.jsx               # Mobile bottom navigation bar
    │   ├── DashboardSidebar.jsx        # Desktop sidebar (customer/traveller)
    │   ├── RequestCard.jsx             # Errand card (customer & traveller views)
    │   ├── StatusStepper.jsx           # Delivery lifecycle stepper
    │   ├── RouteMapPreview.jsx         # Visual route summary card
    │   ├── LocationAutocomplete.jsx    # India-wide location search input
    │   ├── FormField.jsx               # Reusable labelled form field
    │   ├── PrimaryButton.jsx           # Design system button (variants + sizes)
    │   ├── ActionCard.jsx              # Homepage service action tiles
    │   ├── HeroSection.jsx             # Landing page hero
    │   ├── RoleSwitcher.jsx            # Customer ↔ Traveller toggle
    │   ├── ConfirmModal.jsx            # Confirmation dialog
    │   └── Toast.jsx                   # Global toast notification
    └── pages/
        ├── public/
        │   ├── LandingPage.jsx
        │   ├── HowItWorksPage.jsx
        │   ├── AboutPage.jsx
        │   ├── LoginPage.jsx
        │   └── RegisterPage.jsx
        ├── customer/
        │   ├── CustomerDashboard.jsx
        │   ├── MyRequestsPage.jsx
        │   └── OrderHistoryPage.jsx
        ├── traveller/
        │   ├── TravellerDashboard.jsx
        │   ├── MatchingRequestsPage.jsx
        │   ├── ActiveDeliveriesPage.jsx
        │   ├── EarningsDashboard.jsx
        │   └── CompletedDeliveriesPage.jsx
        ├── shared/
        │   ├── NotificationsPage.jsx
        │   ├── ActivityPage.jsx
        │   ├── SettingsPage.jsx
        │   └── SupportPage.jsx
        ├── BuyAndDeliver.jsx
        ├── PickupAndDeliver.jsx
        ├── RouteSetup.jsx
        ├── RequestDetails.jsx
        ├── OrderTracking.jsx
        └── Profile.jsx
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3 | UI framework |
| **Vite** | 6.0 | Build tool & dev server |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Lucide React** | 1.16 | Icon library |
| **OpenStreetMap Photon** | — | Primary geocoding (free, no API key) |
| **Nominatim OSM** | — | Secondary geocoding fallback |
| **localStorage** | Browser | Client-side data persistence |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/labhamsharma1633/Raahi.git
cd Raahi

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173/** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📦 Data Model

### Request
```js
{
  id: "REQ-301",
  type: "buy" | "pickup",
  title: "Engineering Drawing Sheet & Micron Pen",
  customer: { name, dept, location, rating, phone },
  storeOrPickup: "UniMall Stationery Hub",
  pickupLocationObj: { name, formattedAddress, city, state, latitude, longitude },
  destination: "Boys Hostel 4 Gate, LPU",
  destinationLocationObj: { ... },
  items: [{ name, qty, note }],
  itemBudget: 180,
  rewardFee: 50,
  neededBy: "Within 45 mins",
  status: "OPEN" | "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED" | "DISPUTED",
  otp: "4821",
  notes: "Please call when at gate"
}
```

### Route
```js
{
  id: "ROUTE-201",
  origin: "LPU Main Gate",
  originLocationObj: { ..., latitude, longitude },
  destination: "Phagwara Railway Station",
  destinationLocationObj: { ..., latitude, longitude },
  travelMode: "E-Rickshaw" | "Walking" | "Bicycle" | "Shared Auto",
  departureTime: "In 20 mins (2:15 PM)",
  maxDetourMeters: 1000,
  maxDetourMinutes: 15,
  availableCapacity: "Backpack (up to 3 kg)",
  active: true
}
```

---

## 🔐 Delivery Security

- **4-digit OTP** generated per request at creation time
- OTP is revealed only to the customer in the Order Tracking screen
- Traveller must enter correct OTP to mark delivery as `DELIVERED`
- Incorrect OTP shows an error and blocks completion

---

## 🗺️ India Coverage

Seed data covers **10 Indian states** with real coordinates:

| State | Cities |
|---|---|
| Punjab | Phagwara (LPU), Chandigarh, Amritsar, Patiala |
| Delhi NCR | Connaught Place, North Campus, Gurugram, Noida, Lajpat Nagar |
| Bihar | Patna (Boring Road, NIT), Bodh Gaya |
| Maharashtra | Mumbai (Marine Drive, BKC), Pune, Nagpur |
| Karnataka | Bengaluru (MG Road, Koramangala, Whitefield), Mysuru |
| Telangana | Hyderabad (HiTech City, JNTU, Charminar) |
| Uttar Pradesh | Lucknow, Varanasi, Agra, Prayagraj |
| West Bengal | Kolkata (Park Street, Salt Lake, Jadavpur, Howrah) |
| Rajasthan | Jaipur, Jodhpur, Udaipur |
| Tamil Nadu | Chennai, Coimbatore, Madurai |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Labham Sharma**
- GitHub: [@labhamsharma1633](https://github.com/labhamsharma1633)

---

<div align="center">
  <strong>Built with ❤️ for Indian commuters</strong><br/>
  <em>Raahi — Earn on the way.</em>
</div>
