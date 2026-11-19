import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storageService, DEFAULT_USER } from '../services/storageService';
import { findMatchingRequests } from '../utils/routeMatchingEngine';
import { REQUEST_STATUS } from '../utils/constants';

const RaahiContext = createContext(null);

export function RaahiProvider({ children }) {
  const [user, setUser] = useState(() => storageService.getUser());
  const [currentRole, setCurrentRole] = useState(() => storageService.getUser()?.role || 'customer');
  const [requests, setRequests] = useState(() => storageService.getRequests());
  const [routes, setRoutes] = useState(() => storageService.getRoutes());
  const [activeRoute, setActiveRouteState] = useState(() => storageService.getActiveRoute());
  const [earnings, setEarnings] = useState(() => storageService.getEarnings());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [activity, setActivity] = useState(() => storageService.getActivity());
  const [toast, setToast] = useState(null);

  // Sync role to user
  const setRole = (role) => {
    setCurrentRole(role);
    const updated = { ...user, role };
    setUser(updated);
    storageService.saveUser(updated);
    showToast(`Switched to ${role === 'customer' ? 'Customer' : 'Traveller'} mode`, 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // --- CUSTOMER ACTIONS ---
  const createRequest = (requestData) => {
    const created = storageService.saveRequest({
      ...requestData,
      customer: {
        name: user.name,
        dept: user.college,
        location: requestData.destination,
        rating: user.rating,
        phone: user.phone
      }
    });
    setRequests(storageService.getRequests());
    setActivity(storageService.getActivity());
    showToast(`Request "${created.title}" successfully broadcasted to campus travellers!`);
    return created;
  };

  const cancelRequest = (requestId, reason) => {
    const cancelled = storageService.cancelRequest(requestId, reason);
    setRequests(storageService.getRequests());
    setActivity(storageService.getActivity());
    showToast(`Order ${requestId} cancelled.`, 'warning');
    return cancelled;
  };

  // --- TRAVELLER ACTIONS ---
  const publishRoute = (routeData) => {
    const published = storageService.saveRoute(routeData);
    setRoutes(storageService.getRoutes());
    setActiveRouteState(published);
    setActivity(storageService.getActivity());
    showToast(`Journey published: ${published.origin} ➔ ${published.destination}`);
    return published;
  };

  const setActiveRoute = (route) => {
    storageService.setActiveRoute(route);
    setActiveRouteState(route);
    showToast(`Active route set: ${route.origin} ➔ ${route.destination}`, 'info');
  };

  const acceptRequest = (requestId) => {
    // Check availability
    const target = requests.find((r) => r.id === requestId);
    if (!target) {
      showToast('Request not found', 'error');
      return false;
    }
    if (target.status !== REQUEST_STATUS.OPEN) {
      showToast('This request is no longer available or was already accepted.', 'error');
      return false;
    }

    const updated = storageService.updateRequestStatus(requestId, REQUEST_STATUS.ACCEPTED, {
      traveller: {
        name: user.name,
        dept: user.college,
        rating: user.rating,
        phone: user.phone
      },
      acceptedAt: new Date().toISOString()
    });

    setRequests(storageService.getRequests());
    setActivity(storageService.getActivity());
    setNotifications(storageService.getNotifications());
    showToast(`Task accepted! +₹${updated.rewardFee} travel reward reserved.`);
    return updated;
  };

  const advanceDeliveryStatus = (requestId, inputOtp) => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) return null;

    let nextStatus = target.status;
    if (target.status === REQUEST_STATUS.ACCEPTED) {
      nextStatus = REQUEST_STATUS.PICKED_UP;
    } else if (target.status === REQUEST_STATUS.PICKED_UP) {
      nextStatus = REQUEST_STATUS.IN_TRANSIT;
    } else if (target.status === REQUEST_STATUS.IN_TRANSIT) {
      // Optional OTP check verification
      if (inputOtp && target.otp && inputOtp.trim() !== target.otp.trim()) {
        showToast('Invalid verification OTP code. Please check with customer.', 'error');
        return false;
      }
      nextStatus = REQUEST_STATUS.DELIVERED;
    }

    const updated = storageService.updateRequestStatus(requestId, nextStatus);
    setRequests(storageService.getRequests());
    setEarnings(storageService.getEarnings());
    setActivity(storageService.getActivity());
    setNotifications(storageService.getNotifications());

    if (nextStatus === REQUEST_STATUS.DELIVERED) {
      showToast(`Delivery completed! ₹${updated.rewardFee} credited to offset commute.`);
    } else {
      showToast(`Order status updated to ${nextStatus.replace('_', ' ')}.`);
    }

    return updated;
  };

  const disputeDelivery = (requestId, reason) => {
    const updated = storageService.updateRequestStatus(requestId, REQUEST_STATUS.DISPUTED, { disputeReason: reason });
    setRequests(storageService.getRequests());
    setActivity(storageService.getActivity());
    showToast('Delivery marked for review by campus team.', 'warning');
    return updated;
  };

  // --- DYNAMIC ROUTE MATCHES ---
  const matchingRequests = useMemo(() => {
    return findMatchingRequests(activeRoute, requests);
  }, [activeRoute, requests]);

  // --- METRICS & STATS ---
  const customerStats = useMemo(() => {
    const active = requests.filter((r) => [REQUEST_STATUS.OPEN, REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status));
    const awaiting = requests.filter((r) => r.status === REQUEST_STATUS.OPEN);
    const inProgress = requests.filter((r) => [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status));
    const completed = requests.filter((r) => r.status === REQUEST_STATUS.DELIVERED);
    const cancelled = requests.filter((r) => r.status === REQUEST_STATUS.CANCELLED);
    return { activeCount: active.length, awaitingCount: awaiting.length, inProgressCount: inProgress.length, completedCount: completed.length, cancelledCount: cancelled.length };
  }, [requests]);

  const travellerStats = useMemo(() => {
    const activeDeliveries = requests.filter((r) => [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.PICKED_UP, REQUEST_STATUS.IN_TRANSIT].includes(r.status) && r.traveller?.name === user.name);
    const completedDeliveries = requests.filter((r) => r.status === REQUEST_STATUS.DELIVERED && r.traveller?.name === user.name);
    const totalEarned = earnings.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return { activeDeliveriesCount: activeDeliveries.length, completedDeliveriesCount: completedDeliveries.length, totalEarned };
  }, [requests, earnings, user.name]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const markNotificationsRead = () => {
    storageService.markAllNotificationsRead();
    setNotifications(storageService.getNotifications());
  };

  const resetSampleData = () => {
    storageService.resetToSampleData();
    setUser(storageService.getUser());
    setRequests(storageService.getRequests());
    setRoutes(storageService.getRoutes());
    setActiveRouteState(storageService.getActiveRoute());
    setEarnings(storageService.getEarnings());
    setNotifications(storageService.getNotifications());
    setActivity(storageService.getActivity());
    showToast('Sample campus data loaded successfully.', 'info');
  };

  const clearData = () => {
    storageService.clearAllData();
    setUser(DEFAULT_USER);
    setRequests([]);
    setRoutes([]);
    setActiveRouteState(null);
    setEarnings([]);
    setNotifications([]);
    setActivity([]);
    showToast('Local application storage cleared.', 'warning');
  };

  return (
    <RaahiContext.Provider
      value={{
        user,
        setUser,
        currentRole,
        setRole,
        requests,
        createRequest,
        cancelRequest,
        routes,
        activeRoute,
        publishRoute,
        setActiveRoute,
        acceptRequest,
        advanceDeliveryStatus,
        disputeDelivery,
        matchingRequests,
        earnings,
        notifications,
        unreadNotificationCount,
        markNotificationsRead,
        activity,
        customerStats,
        travellerStats,
        toast,
        showToast,
        resetSampleData,
        clearData
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
