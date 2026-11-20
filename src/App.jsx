import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RaahiProvider, useRaahi } from './context/RaahiContext';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import Toast from './components/Toast';

// Lightweight Error Boundary to prevent blank screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[Raahi Runtime Error]:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-raahi-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-black text-slate-900">Something went wrong</h2>
            <p className="text-xs text-slate-500">
              An unexpected error occurred while rendering this view.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="bg-raahi-teal text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#072426] transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Public Pages
import LandingPage from './pages/public/LandingPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BuyAndDeliver from './pages/BuyAndDeliver';
import PickupAndDeliver from './pages/PickupAndDeliver';
import MyRequestsPage from './pages/customer/MyRequestsPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';

// Traveller Pages
import TravellerDashboard from './pages/traveller/TravellerDashboard';
import RouteSetup from './pages/RouteSetup';
import MatchingRequestsPage from './pages/traveller/MatchingRequestsPage';
import ActiveDeliveriesPage from './pages/traveller/ActiveDeliveriesPage';
import EarningsDashboard from './pages/traveller/EarningsDashboard';
import CompletedDeliveriesPage from './pages/traveller/CompletedDeliveriesPage';

// Shared Pages
import RequestDetails from './pages/RequestDetails';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import NotificationsPage from './pages/shared/NotificationsPage';
import ActivityPage from './pages/shared/ActivityPage';
import SettingsPage from './pages/shared/SettingsPage';
import SupportPage from './pages/shared/SupportPage';

// Raahi Circles Pages
import MyCirclesPage from './pages/circles/MyCirclesPage';
import CircleDiscoveryPage from './pages/circles/CircleDiscoveryPage';
import CreateCirclePage from './pages/circles/CreateCirclePage';
import CircleDashboardPage from './pages/circles/CircleDashboardPage';

function AppContent() {
  const getInitialScreen = () => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      const path = window.location.pathname;
      if (path.startsWith('/tracking/')) {
        const id = path.replace('/tracking/', '');
        return id && id !== 'undefined' ? `tracking-${id}` : 'home';
      }
      if (path.startsWith('/request-details/')) {
        const id = path.replace('/request-details/', '');
        return id && id !== 'undefined' ? `request-details-${id}` : 'home';
      }
      const clean = path.replace(/^\//, '');
      if (clean) return clean;
    }
    return 'home';
  };

  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const { user, authLoading, toast, setToast } = useRaahi();

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/tracking/')) {
        const id = path.replace('/tracking/', '');
        setCurrentScreen(id && id !== 'undefined' ? `tracking-${id}` : 'home');
      } else if (path.startsWith('/request-details/')) {
        const id = path.replace('/request-details/', '');
        setCurrentScreen(id && id !== 'undefined' ? `request-details-${id}` : 'home');
      } else {
        const clean = path.replace(/^\//, '');
        setCurrentScreen(clean || 'home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof window !== 'undefined' && window.history?.pushState) {
      if (screenId.startsWith('tracking-')) {
        const id = screenId.replace('tracking-', '');
        if (id && id !== 'undefined') {
          window.history.pushState({}, '', `/tracking/${id}`);
        }
      } else if (screenId.startsWith('request-details-')) {
        const id = screenId.replace('request-details-', '');
        if (id && id !== 'undefined') {
          window.history.pushState({}, '', `/request-details/${id}`);
        }
      } else if (screenId === 'home') {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', `/${screenId}`);
      }
    }
  };

  // Route resolver helper
  const renderScreen = () => {
    // Protected dashboard routes: if not logged in and not loading, redirect to login
    const isProtected = ['customer-dashboard', 'traveller-dashboard', 'customer-requests', 'customer-history', 'traveller-matching', 'traveller-active', 'traveller-earnings', 'traveller-completed', 'profile'].includes(currentScreen);
    if (isProtected && !user && !authLoading) {
      return <LoginPage onNavigate={handleNavigate} />;
    }
    // Dynamic Request Details Route
    if (currentScreen.startsWith('request-details-')) {
      const reqId = currentScreen.replace('request-details-', '');
      const cleanReqId = (reqId === 'undefined' || reqId === 'null') ? '' : reqId;
      return (
        <RequestDetails
          requestId={cleanReqId}
          onBack={() => handleNavigate('home')}
          onNavigate={handleNavigate}
        />
      );
    }

    // Dynamic Live Tracking Route (supports both tracking-ID and tracking/ID)
    if (currentScreen.startsWith('tracking-') || currentScreen.startsWith('tracking/')) {
      const rawId = currentScreen.replace(/^tracking[-/]/, '');
      const cleanId = (rawId === 'undefined' || rawId === 'null') ? '' : rawId;
      return (
        <OrderTracking
          orderId={cleanId}
          id={cleanId}
          requestId={cleanId}
          onBack={() => handleNavigate('customer-dashboard')}
          onNavigate={handleNavigate}
        />
      );
    }

    // Dynamic Circle Dashboard Route
    if (currentScreen.startsWith('circle-') && !currentScreen.startsWith('circles-')) {
      const circleId = currentScreen.replace('circle-', '');
      return (
        <CircleDashboardPage
          circleId={circleId}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (currentScreen) {
      // Raahi Circles Screens
      case 'circles':
        return <MyCirclesPage onNavigate={handleNavigate} />;
      case 'circles-discover':
        return <CircleDiscoveryPage onNavigate={handleNavigate} />;
      case 'circles-create':
        return <CreateCirclePage onNavigate={handleNavigate} />;
      // Public
      case 'home':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'how-it-works':
        return <HowItWorksPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;

      // Customer
      case 'customer-dashboard':
        return <CustomerDashboard onNavigate={handleNavigate} />;
      case 'buy':
        return (
          <BuyAndDeliver
            onBack={() => handleNavigate('customer-dashboard')}
            onNavigate={handleNavigate}
          />
        );
      case 'pickup':
        return (
          <PickupAndDeliver
            onBack={() => handleNavigate('customer-dashboard')}
            onNavigate={handleNavigate}
          />
        );
      case 'customer-requests':
        return <MyRequestsPage onNavigate={handleNavigate} />;
      case 'customer-history':
        return <OrderHistoryPage onNavigate={handleNavigate} />;

      // Traveller
      case 'traveller-dashboard':
        return <TravellerDashboard onNavigate={handleNavigate} />;
      case 'routes':
        return (
          <RouteSetup
            onBack={() => handleNavigate('traveller-dashboard')}
            onNavigate={handleNavigate}
          />
        );
      case 'traveller-matching':
        return <MatchingRequestsPage onNavigate={handleNavigate} />;
      case 'traveller-active':
        return <ActiveDeliveriesPage onNavigate={handleNavigate} />;
      case 'traveller-earnings':
        return <EarningsDashboard onNavigate={handleNavigate} />;
      case 'traveller-completed':
        return <CompletedDeliveriesPage onNavigate={handleNavigate} />;

      // Shared
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;
      case 'activity':
        return <ActivityPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      case 'support':
        return <SupportPage onNavigate={handleNavigate} />;

      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-raahi-bg flex flex-col font-sans text-raahi-text-main antialiased selection:bg-raahi-teal selection:text-white">
      {/* Full-width Responsive Navbar */}
      <AppHeader
        activeScreen={currentScreen}
        onNavigate={handleNavigate}
        campus="India-Wide Network"
        locationName="All States & Cities"
      />

      {/* Screen Router Body */}
      <main className="flex-1">
        <ErrorBoundary>
          {renderScreen()}
        </ErrorBoundary>
      </main>

      {/* Global Interactive Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast && setToast(null)} />

      {/* Full Website Footer */}
      <AppFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RaahiProvider>
        <AppContent />
      </RaahiProvider>
    </BrowserRouter>
  );
}
