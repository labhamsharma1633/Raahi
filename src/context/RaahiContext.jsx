import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { findMatchingRequests } from '../utils/routeMatchingEngine';
import { REQUEST_STATUS } from '../utils/constants';

const RaahiContext = createContext(null);

export function RaahiProvider({ children }) {
  // Real authenticated user state (null when not logged in)
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('customer');
  // Dual-Network state: 'community' | 'campus'
  const [activeNetwork, setActiveNetwork] = useState('community');

  // Requests: public open requests for feed, and user-specific requests
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  // Traveller data
  const [myRoutes, setMyRoutes] = useState([]);
  const [activeRoute, setActiveRouteState] = useState(null);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [earningsData, setEarningsData] = useState({ totalEarned: 0, transactions: [] });

  // Notifications & Toast
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // --- 1. INITIALIZE & RESTORE AUTHENTICATED SESSION ---
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiClient.getToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await apiClient.getMe();
        if (res?.data?.user) {
          const u = res.data.user;
          setUser(u);
          setCurrentRole(u.defaultRole || 'customer');
          setActiveNetwork(u.activeNetworkPreference || 'community');
        } else {
          apiClient.setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        apiClient.setToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // --- 2. LOAD DATA ACCORDING TO USER AUTHENTICATION ---
  const refreshOpenRequests = useCallback(async (scopeOverride) => {
    try {
      const scope = (scopeOverride || activeNetwork).toUpperCase();
      const res = await apiClient.getOpenRequests({ networkScope: scope });
      if (res?.data?.requests) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.warn('Failed to fetch open requests:', err.message);
    }
  }, [activeNetwork]);

  const refreshUserData = useCallback(async () => {
    if (!user) {
      setMyRequests([]);
      setMyRoutes([]);
      setActiveRouteState(null);
      setActiveDeliveries([]);
      setEarningsData({ totalEarned: 0, transactions: [] });
      return;
    }

    try {
      // 1. Fetch user's own requests
      const reqRes = await apiClient.getMyRequests().catch(() => ({ data: { requests: [] } }));
      setMyRequests(reqRes?.data?.requests || []);

      // 2. Fetch user's published routes
      const routesRes = await apiClient.getMyRoutes().catch(() => ({ data: { routes: [] } }));
      const userRt = routesRes?.data?.routes || [];
      setMyRoutes(userRt);
      if (userRt.length > 0) {
        const active = userRt.find((r) => r.active) || userRt[0];
        setActiveRouteState(active);
      }

      // 3. Fetch active deliveries carried by user
      const delivRes = await apiClient.getActiveDeliveries().catch(() => ({ data: { deliveries: [] } }));
      setActiveDeliveries(delivRes?.data?.deliveries || []);

      // 4. Fetch user's real earnings
      const earnRes = await apiClient.getEarnings().catch(() => ({ data: { totalEarned: 0, transactions: [] } }));
      setEarningsData(earnRes?.data || { totalEarned: 0, transactions: [] });
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
  }, [user]);

  useEffect(() => {
    refreshOpenRequests();
    if (user) {
      refreshUserData();
    }
  }, [user, refreshOpenRequests, refreshUserData]);

  // --- 3. DUAL-NETWORK SWITCHING & AUTH METHODS ---
  const switchNetwork = async (network) => {
    if (!['campus', 'community'].includes(network)) return;
    setActiveNetwork(network);

    if (user) {
      try {
        const res = await apiClient.switchNetworkPreference(network);
        if (res?.data?.user) {
          setUser(res.data.user);
          showToast(`Switched to Raahi ${network === 'campus' ? 'Campus' : 'Community'} Network`);
          refreshOpenRequests(network);
        }
      } catch (err) {
        showToast(err.message || 'Failed to switch network', 'error');
        setActiveNetwork(user.activeNetworkPreference || 'community');
      }
    } else {
      refreshOpenRequests(network);
    }
  };

  const enrollCampus = async (collegeName, institutionalEmail) => {
    try {
      const res = await apiClient.enrollCampus(collegeName, institutionalEmail);
      if (res?.data?.user) {
        setUser(res.data.user);
        setActiveNetwork('campus');
        showToast(`Enrolled in ${collegeName} Campus Network!`);
        refreshOpenRequests('campus');
        return res.data.user;
      }
    } catch (err) {
      showToast(err.message || 'Campus enrollment failed', 'error');
      throw err;
    }
  };

  const registerUser = async (registrationData) => {
    const res = await apiClient.register(registrationData);
    if (res?.data?.user) {
      setUser(res.data.user);
      setCurrentRole(res.data.user.defaultRole || 'customer');
      setActiveNetwork(res.data.user.activeNetworkPreference || 'community');
      showToast('Registration successful! Welcome to Raahi.');
      return res.data.user;
    }
    throw new Error('Registration failed');
  };

  const loginUser = async (email, password) => {
    const res = await apiClient.login({ email, password });
    if (res?.data?.user) {
      setUser(res.data.user);
      setCurrentRole(res.data.user.defaultRole || 'customer');
      setActiveNetwork(res.data.user.activeNetworkPreference || 'community');
      showToast(`Welcome back, ${res.data.user.name}!`);
      return res.data.user;
    }
    throw new Error('Login failed');
  };

  const logoutUser = () => {
    apiClient.setToken(null);
    setUser(null);
    setMyRequests([]);
    setMyRoutes([]);
    setActiveRouteState(null);
    setActiveDeliveries([]);
    setEarningsData({ totalEarned: 0, transactions: [] });
    showToast('Logged out successfully', 'info');
  };

  const setRole = (role) => {
    setCurrentRole(role);
    showToast(`Switched to ${role === 'customer' ? 'Customer' : 'Traveller'} mode`, 'info');
  };

  // --- 4. CUSTOMER ACTIONS ---
  const createRequest = async (requestData) => {
    if (!user) {
      showToast('Please sign in to post a request', 'error');
      return null;
    }

    try {
      const payload = {
        ...requestData,
        networkScope: (requestData.networkScope || activeNetwork).toUpperCase(),
      };
      const res = await apiClient.createRequest(payload);
      if (res?.data?.request) {
        showToast(`Request "${res.data.request.title}" broadcasted to ${activeNetwork} travellers!`);
        await refreshUserData();
        await refreshOpenRequests();
        return res.data.request;
      }
    } catch (err) {
      showToast(err.message || 'Failed to create request', 'error');
      throw err;
    }
  };

  const cancelRequest = async (requestId, reason) => {
    try {
      await apiClient.cancelRequest(requestId, reason);
      showToast('Request cancelled successfully', 'info');
      await refreshUserData();
      await refreshOpenRequests();
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to cancel request', 'error');
      return false;
    }
  };

  // --- 5. TRAVELLER ACTIONS ---
  const publishRoute = async (routeData) => {
    if (!user) {
      showToast('Please sign in to publish a route', 'error');
      return null;
    }

    try {
      const payload = {
        ...routeData,
        networkScope: (routeData.networkScope || activeNetwork).toUpperCase(),
      };
      const res = await apiClient.createRoute(payload);
      if (res?.data?.route) {
        setActiveRouteState(res.data.route);
        showToast(`Journey published: ${res.data.route.origin} ➔ ${res.data.route.destination}`);
        await refreshUserData();
        return res.data.route;
      }
    } catch (err) {
      showToast(err.message || 'Failed to publish route', 'error');
      throw err;
    }
  };

  const setActiveRoute = (route) => {
    setActiveRouteState(route);
    showToast(`Active route set: ${route.origin} ➔ ${route.destination}`, 'info');
  };

  const acceptRequest = async (requestId) => {
    if (!user) {
      showToast('Please sign in to accept delivery errands', 'error');
      return false;
    }

    try {
      const res = await apiClient.acceptRequest(requestId);
      if (res?.data?.request) {
        showToast(res.message || 'Delivery accepted!');
        await refreshUserData();
        await refreshOpenRequests();
        return res.data.request;
      }
    } catch (err) {
      showToast(err.message || 'Failed to accept delivery', 'error');
      return false;
    }
  };

  const advanceDeliveryStatus = async (requestId, inputOtp) => {
    try {
      const res = await apiClient.advanceDelivery(requestId, inputOtp);
      if (res?.data?.request) {
        showToast(res.message || 'Delivery updated');
        await refreshUserData();
        await refreshOpenRequests();
        return res.data.request;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update delivery status', 'error');
      return false;
    }
  };

  // --- 6. DYNAMIC ROUTE MATCHES ---
  const matchingRequests = useMemo(() => {
    return findMatchingRequests(activeRoute, requests);
  }, [activeRoute, requests]);

  // --- 7. METRICS & STATS (DERIVED STRICTLY FROM USER'S REAL DB RECORDS) ---
  const customerStats = useMemo(() => {
    const active = myRequests.filter((r) =>
      [REQUEST_STATUS.OPEN, REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status)
    );
    const awaiting = myRequests.filter((r) => r.status === REQUEST_STATUS.OPEN);
    const inProgress = myRequests.filter((r) =>
      [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status)
    );
    const completed = myRequests.filter((r) => r.status === REQUEST_STATUS.DELIVERED);
    const cancelled = myRequests.filter((r) => r.status === REQUEST_STATUS.CANCELLED);

    return {
      activeCount: active.length,
      awaitingCount: awaiting.length,
      inProgressCount: inProgress.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
    };
  }, [myRequests]);

  const travellerStats = useMemo(() => {
    return {
      activeDeliveriesCount: activeDeliveries.length,
      completedDeliveriesCount: user?.completedDeliveries || 0,
      totalEarned: earningsData.totalEarned || 0,
    };
  }, [activeDeliveries, user, earningsData]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const isCampusEnrolled = Boolean(user?.campusMembership?.enrolled);
  const isCampusEligible = Boolean(
    user?.campusMembership?.enrolled &&
      (user?.campusMembership?.eligibilityStatus === 'verified' || user?.campusMembership?.eligibilityStatus === 'pending')
  );
  const isCommunityEligible = Boolean(user?.communityMembership?.enrolled !== false);

  return (
    <RaahiContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        registerUser,
        loginUser,
        logoutUser,
        currentRole,
        setRole,
        activeNetwork,
        switchNetwork,
        enrollCampus,
        isCampusEnrolled,
        isCampusEligible,
        isCommunityEligible,
        campusInfo: user?.campusMembership || null,
        communityInfo: user?.communityMembership || null,
        requests,
        myRequests,
        createRequest,
        cancelRequest,
        myRoutes,
        activeRoute,
        publishRoute,
        setActiveRoute,
        activeDeliveries,
        acceptRequest,
        advanceDeliveryStatus,
        matchingRequests,
        earnings: earningsData.transactions || [],
        earningsData,
        notifications,
        unreadNotificationCount,
        customerStats,
        travellerStats,
        toast,
        showToast,
        refreshUserData,
        refreshOpenRequests,
      }}
    >
      {children}
    </RaahiContext.Provider>
  );
}

export function useRaahi() {
  const context = useContext(RaahiContext);
  if (!context) {
    throw new Error('useRaahi must be used within a RaahiProvider');
  }
  return context;
}
