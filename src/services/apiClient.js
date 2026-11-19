// Centralized API Client for Raahi Backend
// Communicates with http://localhost:5000/api with automatic JWT injection

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('raahi_auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('raahi_auth_token', token);
    } else {
      localStorage.removeItem('raahi_auth_token');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('raahi_auth_token');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.warn(`[API] ${options.method || 'GET'} ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  // Auth APIs
  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async login(credentials) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async getMe() {
    return await this.request('/auth/me');
  }

  async switchNetworkPreference(network) {
    return await this.request('/auth/network-preference', {
      method: 'PUT',
      body: JSON.stringify({ network }),
    });
  }

  async enrollCampus(collegeName, institutionalEmail) {
    return await this.request('/auth/campus/enroll', {
      method: 'POST',
      body: JSON.stringify({ collegeName, institutionalEmail }),
    });
  }

  // Request APIs
  async createRequest(requestData) {
    return await this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getOpenRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/requests${query ? `?${query}` : ''}`);
  }

  async getMyRequests() {
    return await this.request('/requests/my');
  }

  async getRequestById(id) {
    return await this.request(`/requests/${id}`);
  }

  async cancelRequest(id, reason) {
    return await this.request(`/requests/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  // Route APIs
  async createRoute(routeData) {
    return await this.request('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }

  async getMyRoutes() {
    return await this.request('/routes/my');
  }

  async getRouteMatches(routeId) {
    return await this.request(`/routes/${routeId}/matches`);
  }

  // Delivery Lifecycle APIs
  async acceptRequest(requestId) {
    return await this.request(`/deliveries/${requestId}/accept`, {
      method: 'POST',
    });
  }

  async advanceDelivery(requestId, otp) {
    return await this.request(`/deliveries/${requestId}/advance`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
  }

  async getActiveDeliveries() {
    return await this.request('/deliveries/active');
  }

  async getEarnings() {
    return await this.request('/deliveries/earnings');
  }

  // Smart Pool Multi-Stop APIs
  async getSmartPoolCandidates(routeId) {
    const query = routeId ? `?routeId=${routeId}` : '';
    return await this.request(`/smart-pool/candidates${query}`);
  }

  async optimizeSmartPool(routeId, requestIds) {
    return await this.request('/smart-pool/optimize', {
      method: 'POST',
      body: JSON.stringify({ routeId, requestIds }),
    });
  }

  async confirmSmartPool(routeId, requestIds) {
    return await this.request('/smart-pool/confirm', {
      method: 'POST',
      body: JSON.stringify({ routeId, requestIds }),
    });
  }

  async getActiveSmartPool() {
    return await this.request('/smart-pool/active');
  }

  async getSmartPoolById(id) {
    return await this.request(`/smart-pool/${id}`);
  }

  async advanceSmartPoolStop(id, otpCode) {
    return await this.request(`/smart-pool/${id}/advance-stop`, {
      method: 'POST',
      body: JSON.stringify({ otpCode }),
    });
  }

  async cancelSmartPool(id, reason) {
    return await this.request(`/smart-pool/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }
}

export const apiClient = new ApiClient();
